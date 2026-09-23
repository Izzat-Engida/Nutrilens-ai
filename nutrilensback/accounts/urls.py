from django.urls import path
from .views import (
    RegisterView, LoginView, AccountView, RefreshTokenView, ProfileView,
    ForgotPasswordView, ResetPasswordView,
)
urlpatterns = [
    path("register/",RegisterView.as_view(),name="register"),
    path("login/",LoginView.as_view(),name="login"),
    path("account/",AccountView.as_view(),name="account"),
    path("token/refresh/",RefreshTokenView.as_view(),name="token-refresh"),
    path("profile/",ProfileView.as_view(),name="profile"),
    path("password-reset/", ForgotPasswordView.as_view(), name="password-reset"),
    path("password-reset/confirm/", ResetPasswordView.as_view(), name="password-reset-confirm"),
]
