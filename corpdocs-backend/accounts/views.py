from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer , CustomTokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from rest_framework_simplejwt.views import TokenObtainPairView

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'username': user.username
                },
                'token': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

User = get_user_model()

class ForgotPasswordView(APIView):
    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"detail": "Email is required"}, status=400)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "User not found"}, status=404)

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = PasswordResetTokenGenerator().make_token(user)
        reset_url = f"http://localhost:5173/reset-password/{uid}/{token}/"

        send_mail(
            subject="CorpDocs Password Reset",
            message=f"Click the link to reset your password:\n{reset_url}",
            from_email="no-reply@corpdocs.com",
            recipient_list=[email],
        )

        return Response({"detail": "Password reset link sent"}, status=200)
    
class ResetPasswordView(APIView):
    def post(self, request, uidb64, token):
        password = request.data.get("password")
        if not password:
            return Response({"detail": "Password is required"}, status=400)

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({"detail": "Invalid link"}, status=400)

        if not PasswordResetTokenGenerator().check_token(user, token):
            return Response({"detail": "Token is invalid or expired"}, status=400)

        user.set_password(password)
        user.save()

        return Response({"message": "Password reset successful"}, status=200)
    
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer