from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action, api_view
from django.db.models import Q
from .models import Document
from .serializers import DocumentSerializer
from django.shortcuts import get_object_or_404
from .models import DocumentVersion
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

class DocumentViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentSerializer

    def get_permissions(self):
        if self.action in ["retrieve", "update"]:
            return []  # Allow public access, custom permission below
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return Document.objects.filter(
                Q(owner=user) | Q(shared_with=user)
            ).distinct()
        return Document.objects.filter(is_public=True)

    def retrieve(self, request, *args, **kwargs):
        doc = get_object_or_404(Document, pk=kwargs["pk"])
        if doc.is_public or (request.user.is_authenticated and (doc.owner == request.user or request.user in doc.shared_with.all())):
            serializer = self.get_serializer(doc)
            return Response(serializer.data)
        return Response({"detail": "Not authorized."}, status=status.HTTP_403_FORBIDDEN)

    def update(self, request, *args, **kwargs):
        doc = get_object_or_404(Document, pk=kwargs["pk"])
        if doc.is_public or (request.user.is_authenticated and (doc.owner == request.user or request.user in doc.shared_with.all())):
            serializer = self.get_serializer(doc, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        return Response({"detail": "Not authorized."}, status=status.HTTP_403_FORBIDDEN)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def perform_update(self, serializer):
        serializer.save()

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_document_versions(request, pk):
    document = get_object_or_404(Document, pk=pk)

    # Only allow author or shared_with users
    if request.user != document.owner and request.user not in document.shared_with.all():
        return Response({"detail": "Access denied"}, status=403)

    versions = document.versions.all().order_by('-created_at')

    data = [
        {
            "id": v.id,
            "edited_by": v.edited_by.username if v.edited_by else "Unknown",
            "created_at": v.created_at,
            "content": v.content,
        }
        for v in versions
    ]
    return Response(data)

# ✅ Public view-only endpoint for unauthenticated use
@api_view(["GET"])
def view_public_document(request, pk):
    """Allow anyone to view public document"""
    try:
        doc = Document.objects.get(pk=pk, is_public=True)
    except Document.DoesNotExist:
        return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = DocumentSerializer(doc)
    return Response(serializer.data)

@api_view(["PUT"])
def edit_public_document(request, pk):
    """Allow anyone to edit a public document"""
    try:
        doc = Document.objects.get(pk=pk, is_public=True)
    except Document.DoesNotExist:
        return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = DocumentSerializer(doc, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
