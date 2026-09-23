from django.db import models

from accounts.models import User


class FoodAnalysis(models.Model):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    CONFIRMED = "confirmed"

    STATUS_CHOICES = [
        (PENDING, "Pending"),
        (COMPLETED, "Completed"),
        (FAILED, "Failed"),
        (CONFIRMED, "Confirmed"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="food_analyses",
    )
    image = models.ImageField(upload_to="food_analysis/%Y/%m/%d/")
    detected_food = models.CharField(max_length=200, blank=True)
    confidence = models.DecimalField(
        max_digits=8, decimal_places=7, null=True, blank=True
    )
    predictions = models.JSONField(default=list, blank=True)
    estimated_portion_grams = models.DecimalField(
        max_digits=8, decimal_places=2, null=True, blank=True
    )
    raw_result = models.JSONField(default=dict, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=PENDING)
    # Kept for server diagnostics only; never serialized to clients.
    error_message = models.TextField(blank=True)
    confirmed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at", "-id"]

    def __str__(self):
        return f"{self.detected_food or 'Food analysis'} for {self.user.email}"
