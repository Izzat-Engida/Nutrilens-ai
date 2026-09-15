from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken,AccessToken
from rest_framework.permissions import IsAuthenticated
from .models import User,Profile
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    UpdateUserSerializers,
    RefreshTokenSerializer,
    ProfileSerializer
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
                        "full_name": user.get_full_name(),
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