from rest_framework import serializers
from .models import Document
from django.conf import settings
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from .models import DocumentVersion

User = get_user_model()

class DocumentSerializer(serializers.ModelSerializer):
    mentions = serializers.ListField(
        child=serializers.EmailField(),
        required=False,
        write_only=True
    )
    shared_with = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='email'
    )

    class Meta:
        model = Document
        fields = [
            'id', 'title', 'content',
            'created_at', 'last_updated',
            'owner', 'mentions', 'shared_with', 'is_public'
        ]
        read_only_fields = [
            'id', 'created_at', 'last_updated',
            'owner', 'shared_with'
        ]

    def create(self, validated_data):
        mentions = validated_data.pop('mentions', [])
        document = super().create(validated_data)
        self._handle_shares_and_emails(mentions, document)
        return document
    
    def to_representation(self, instance):
        """Ensure content is returned with all HTML formatting intact"""
        representation = super().to_representation(instance)
        representation['content'] = instance.content
        return representation

    def update(self, instance, validated_data):
        mentions = validated_data.pop('mentions', [])

        # Only save version if content is changing
        if 'content' in validated_data:
            DocumentVersion.objects.create(
                document=instance,
                content=instance.content,
                edited_by=self.context['request'].user if 'request' in self.context else None
            )

        document = super().update(instance, validated_data)
        self._handle_shares_and_emails(mentions, document)
        return document


    def _handle_shares_and_emails(self, mentions, document):
        # 1. Deduplicate mentions
        unique_emails = set(mentions)

        for email in unique_emails:
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                continue

            # 2. Only share/send if not already shared
            if not document.shared_with.filter(id=user.id).exists():
                document.shared_with.add(user)

                # 3. Send one email
                send_mail(
                    subject=f"You were mentioned in '{document.title}'",
                    message=(
                        f"Hey {user.username},\n\n"
                        f"You were just mentioned in the document “{document.title}” by {document.owner.username}.\n"
                        "Click the link below to view and edit it now:\n\n"
                        f"http://your-frontend.com/docs/{document.id}\n\n"
                        "Cheers,\n"
                        "The CorpDocs Team"
                    ),
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[email],
                    fail_silently=True,
                )
