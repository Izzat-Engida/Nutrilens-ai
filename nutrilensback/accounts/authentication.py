from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import AccessToken

from .models import User


class JWTAuthentication(BaseAuthentication):

    def authenticate(self, request):
        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return None

        try:
            token_type, token = auth_header.split(" ", 1)
        except ValueError:
            raise AuthenticationFailed(
                "Invalid authorization header."
            )

        if token_type.lower() != "bearer":
            raise AuthenticationFailed(
                "Authorization header must use Bearer token."
            )

        try:
            access_token = AccessToken(token)
            user_id = access_token["user_id"]
        except Exception:
            raise AuthenticationFailed(
                "Invalid or expired token."
            )

        try:
            user = User.objects.get(
                id=user_id,
                is_active=True,
            )
        except User.DoesNotExist:
            raise AuthenticationFailed(
                "User not found."
            )

        return (user, access_token)