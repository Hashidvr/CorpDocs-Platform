from django.urls import path
from .views import RegisterView 
from rest_framework_simplejwt.views import TokenObtainPairView
from .views import ForgotPasswordView
from .views import ResetPasswordView
from .views import CustomTokenObtainPairView


urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    # path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path("forgot-password/", ForgotPasswordView.as_view()),
    path("reset-password/<uidb64>/<token>/", ResetPasswordView.as_view()),
    path('login/', CustomTokenObtainPairView.as_view(), name='custom_login'),
]
