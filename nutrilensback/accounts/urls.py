from django.urls import path
from .views import RegisterView,LoginView,AccountView,RefreshTokenView
urlpatterns = [
    path("register/",RegisterView.as_view(),name="register"),
    path("login/",LoginView.as_view(),name="login"),
    path("account/",AccountView.as_view(),name="account"),
    path("token/refresh/",RefreshTokenView.as_view(),name="token-refresh")
]
