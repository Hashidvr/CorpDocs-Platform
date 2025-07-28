from django.db import models
from django.conf import settings
from django.contrib.auth import get_user_model
User = get_user_model()
class Document(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="documents")
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    mentions = models.ManyToManyField(User, related_name="mentioned_in")
    is_public = models.BooleanField(default=False)
    last_updated = models.DateTimeField(auto_now=True)
    shared_with = models.ManyToManyField(
    settings.AUTH_USER_MODEL,
    blank=True,
    related_name="shared_docs"
)
    def __str__(self):
        return self.title
    
class DocumentVersion(models.Model):
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='versions')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    edited_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)  # ✅ Add blank=True

