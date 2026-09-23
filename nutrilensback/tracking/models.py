from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db.models import Q
from django.utils import timezone

from accounts.models import User


class WeightEntry(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="weight_entries",
    )
    weight_kg = models.DecimalField(
        max_digits=7,
        decimal_places=2,
        validators=[
            MinValueValidator(0.01),
            MaxValueValidator(1000),
        ],
    )
    date = models.DateField(default=timezone.localdate)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-date", "-created_at", "-id"]
        constraints = [
            models.UniqueConstraint(
                fields=["user", "date"],
                name="unique_weight_entry_user_date",
            ),
            models.CheckConstraint(
                condition=Q(weight_kg__gt=0),
                name="weight_entry_weight_positive",
            ),
        ]

    def __str__(self):
        return f"{self.user.email}: {self.weight_kg} kg on {self.date}"

# Create your models here.
