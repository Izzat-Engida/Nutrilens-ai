from django.db import models

from accounts.models import User


class Recommendation(models.Model):
    NUTRITION = "nutrition"
    PROTEIN = "protein"
    CALORIES = "calories"
    WEIGHT = "weight"
    MEALS = "meals"
    PROGRESS = "progress"
    GENERAL = "general"

    TYPE_CHOICES = [
        (NUTRITION, "Nutrition"),
        (PROTEIN, "Protein"),
        (CALORIES, "Calories"),
        (WEIGHT, "Weight"),
        (MEALS, "Meals"),
        (PROGRESS, "Progress"),
        (GENERAL, "General"),
    ]

    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

    PRIORITY_CHOICES = [
        (LOW, "Low"),
        (MEDIUM, "Medium"),
        (HIGH, "High"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="recommendations",
    )
    category = models.CharField(max_length=20, choices=TYPE_CHOICES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default=MEDIUM)
    rule_key = models.CharField(max_length=80)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["is_read", "-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["user", "rule_key"],
                name="unique_recommendation_user_rule",
            ),
        ]

    def __str__(self):
        return f"{self.title} for {self.user.email}"
