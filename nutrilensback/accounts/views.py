from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken,AccessToken
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from django.contrib.auth.hashers import make_password
from django.core.mail import send_mail
from django.utils import timezone
from datetime import timedelta
import hashlib
import secrets
from .models import User,Profile,PasswordResetToken
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    UpdateUserSerializers,
    RefreshTokenSerializer,
    ProfileSerializer,
    ForgotPassWordSerializer,
    ResetPassWordSerializer
    )


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            return Response(
                {
                    "message": "Account created successfully",
                    "user": {
                        "id": user.id,
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                        "email": user.email,
                    },
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data["user"]

            refresh = RefreshToken()
            refresh["user_id"] = user.id

            access = AccessToken()
            access["user_id"] = user.id

            return Response(
                {
                    "message": "Login successful",
                    "tokens": {
                        "refresh": str(refresh),
                        "access": str(access),
                    },
                    "user": {
                        "id": user.id,
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                        "email": user.email,
                    },
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )
class AccountView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user

        serializer = UpdateUserSerializers(
            user,
            data=request.data,
            partial=True,
        )

        if serializer.is_valid():
            user = serializer.save()

            return Response(
                {
                    "message": "Account updated successfully",
                    "user": {
                        "id": user.id,
                        "full_name": user.get_full_name(),
                        "email": user.email,
                    },
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )

    def delete(self, request):
        user = request.user

        user.delete()

        return Response(
            {
                "message": "Account deleted successfully",
            },
            status=status.HTTP_204_NO_CONTENT,
        )
class ForgotPasswordView(APIView):
    def post(self,request):
        serializer=ForgotPassWordSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        email=serializer.validated_data["email"]

        try:
            user = User.objects.get(email=email, is_active=True)
        except User.DoesNotExist:
            user = None

        if user is not None:
            raw_token = secrets.token_urlsafe(32)
            PasswordResetToken.objects.filter(
                user=user, used_at__isnull=True
            ).update(used_at=timezone.now())
            PasswordResetToken.objects.create(
                user=user,
                token_hash=hashlib.sha256(raw_token.encode()).hexdigest(),
                expires_at=timezone.now() + timedelta(minutes=30),
            )
            reset_url = f"{settings.PASSWORD_RESET_URL}?token={raw_token}"
            send_mail(
                subject="Reset your Nutrilens password",
                message=(
                    "Use the following link to reset your password. "
                    f"This link expires in 30 minutes:\n\n{reset_url}"
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=False,
            )
        return Response(
            {"message": "If that email address exists in our system, a password reset link has been sent to it."},
            status=status.HTTP_200_OK
        )
class ResetPasswordView(APIView):
    def post(self, request):
        serializer = ResetPassWordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        token_hash = hashlib.sha256(
            serializer.validated_data["token"].encode()
        ).hexdigest()
        try:
            reset_token = PasswordResetToken.objects.select_related("user").get(
                token_hash=token_hash
            )
        except PasswordResetToken.DoesNotExist:
            return Response(
                {"detail": "This password reset link is invalid or expired."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not reset_token.is_valid or not reset_token.user.is_active:
            return Response(
                {"detail": "This password reset link is invalid or expired."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        reset_token.user.password = make_password(serializer.validated_data["password"])
        reset_token.user.save(update_fields=["password", "updated_at"])
        reset_token.used_at = timezone.now()
        reset_token.save(update_fields=["used_at"])

        return Response(
            {"message": "Password reset successfully. You can now log in."},
            status=status.HTTP_200_OK,
        )
class RefreshTokenView(APIView):

    def post(self, request):
        serializer = RefreshTokenSerializer(
            data=request.data
        )

        if serializer.is_valid():
            return Response(
                {
                    "access": serializer.validated_data["access"]
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )
class ProfileView(APIView):
    permission_classes=[IsAuthenticated]

    def get(self,request):
        user=request.user

        try:
            profile=Profile.objects.get(user=user)
        except Profile.DoesNotExist:
            return Response(
                {"error":"Profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        serlialzer=ProfileSerializer(profile)
        return Response(
            serlialzer.data,
            status=status.HTTP_200_OK
        )
    def post(self,request):
        user=request.user

        if Profile.objects.filter(user=user).exists():
            return Response(
                {"error":"profile already exists"},
                status=status.HTTP_400_BAD_REQUEST
            )
        serializer=ProfileSerializer(data=request.data)
        if serializer.is_valid():
            profile=serializer.save(user=user)
            return Response(
                {
                    "message":"Profile created successfully",
                    "profile":ProfileSerializer(profile).data,
                },
                status=status.HTTP_201_CREATED
            )
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    def put(self,request):
        user=request.user

        try:
            profile=Profile.objects.get(user=user)
        except Profile.DoesNotExist:
            return Response(
                {"error":"Profile not Found"},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer=ProfileSerializer(
            profile,
            data=request.data,
            partial=True,
        )
        if serializer.is_valid():
            profile=serializer.save()
            return Response(
                {
                    "message":"Profile updated successfully.",
                    "profile":ProfileSerializer(profile).data,
                },
                status=status.HTTP_200_OK
            )
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
