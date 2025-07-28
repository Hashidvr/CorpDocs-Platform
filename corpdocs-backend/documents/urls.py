from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DocumentViewSet
from .views import view_public_document, edit_public_document
from .views import get_document_versions

router = DefaultRouter()
router.register(r'', DocumentViewSet, basename='document')

urlpatterns = [
    path('', include(router.urls)),
    path('public-documents/<int:pk>/', view_public_document),
    path('public-documents/<int:pk>/edit/', edit_public_document),
    path('<int:pk>/versions/', get_document_versions),
]
