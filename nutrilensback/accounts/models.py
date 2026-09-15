from django.db import models


class User(models.Model):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150, blank=True)
    password = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def is_authenticated(self):
        return True

    @property
    def is_anonymous(self):
        return False

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip()

    def __str__(self):
        return self.email

class Profile(models.Model):
    UNIT_CHOICES = [
        ("metric", "Metric"),
        ("imperial", "Imperial"),
    ]

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile",
    )

    goal = models.CharField(
        max_length=100,
    )

    height_cm = models.FloatField()

    weight_kg = models.FloatField()

    gender = models.CharField(
        max_length=30,
    )

    age = models.PositiveIntegerField()

    activity_level = models.CharField(
        max_length=100,
    )

    unit_system = models.CharField(
        max_length=10,
        choices=UNIT_CHOICES,
        default="metric",
    )

    def __str__(self):
        return f"{self.user.email}'s profile"