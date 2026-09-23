from django.contrib.auth.hashers import make_password,check_password
from rest_framework import serializers

from .models import User,Profile


class ForgotPassWordSerializer(serializers.Serializer):
    email=serializers.EmailField()

class ResetPassWordSerializer(serializers.Serializer):
    token = serializers.CharField()
    password = serializers.CharField(
           write_only=True,
           min_length=8,)
    password_confirmation = serializers.CharField(write_only=True, min_length=8)

    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirmation"]:
            raise serializers.ValidationError({"password_confirmation": "Passwords do not match."})
        return attrs


class LoginSerializer(serializers.Serializer):
    email=serializers.EmailField()
    password=serializers.CharField(write_only=True)

    def validate(self,attrs):
        email=attrs["email"]
        password=attrs["password"]

        try:
            user=User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError(
                "Invalid email or password"
            )
        if not check_password(password,user.password):
            raise serializers.ValidationError(
                "Invalid email or password"
            )
        if not user.is_active:
            raise serializers.ValidationError(
                "This account is inactive."
            )
        attrs["user"]=user
        return attrs

class RegisterSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(write_only=True)
    password = serializers.CharField(
        write_only=True,
        min_length=8,
    )

    class Meta:
        model = User
        fields = [
            "full_name",
            "email",
            "password",
        ]

    def create(self, validated_data):
        full_name = validated_data.pop("full_name")
        password = validated_data.pop("password")

        name_parts = full_name.strip().split()

        first_name = name_parts[0]
        last_name = " ".join(name_parts[1:]) if len(name_parts) > 1 else ""

        user = User.objects.create(
            first_name=first_name,
            last_name=last_name,
            email=validated_data["email"],
            password=make_password(password),
        )

        return user
class UpdateUserSerializers(serializers.ModelSerializer):
    full_name=serializers.CharField(
        required=False
    )
    class Meta:
        model=User
        fields=[
            "full_name",
            "email"
        ]
    def update(self,instance,validated_data):
        full_name=validated_data.pop("full_name",None)
        if full_name is not None:
            name_parts = full_name.strip().split()
            if name_parts:
                instance.first_name=name_parts[0]
            instance.last_name=(
                " ".join(name_parts[1:])
                if len(name_parts)>1
                else ""
            )
        for field, value in validated_data.items():
            setattr(instance, field, value)
        instance.save()
        return instance
from rest_framework_simplejwt.tokens import RefreshToken

class RefreshTokenSerializer(serializers.Serializer):
    refresh = serializers.CharField()

    def validate(self, attrs):
        refresh_token = attrs["refresh"]

        try:
            refresh = RefreshToken(refresh_token)

            user_id = refresh["user_id"]

            user = User.objects.get(
                id=user_id,
                is_active=True,
            )

            # Create a new access token
            access = refresh.access_token
            access["user_id"] = user.id

            attrs["access"] = str(access)

        except User.DoesNotExist:
            raise serializers.ValidationError(
                "User not found or inactive."
            )
        except Exception:
            raise serializers.ValidationError(
                "Invalid or expired refresh token."
            )

        return attrs

class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = Profile
        fields = [
            "goal",
            "height_cm",
            "weight_kg",
            "gender",
            "age",
            "activity_level",
            "target_weight_kg",
            "pace",
            "unit_system",
        ]
