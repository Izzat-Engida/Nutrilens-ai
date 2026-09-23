from django.db import models

from accounts.models import User


class DailyNutrition(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="daily_nutrition")
    date = models.DateField()
    calorie_target = models.PositiveIntegerField()
    protein_target = models.PositiveIntegerField()
    carbohydrate_target = models.PositiveIntegerField()
    fat_target = models.PositiveIntegerField()
    calories_consumed = models.PositiveIntegerField(default=0)
    protein_consumed = models.PositiveIntegerField(default=0)
    carbohydrates_consumed = models.PositiveIntegerField(default=0)
    fat_consumed = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [models.UniqueConstraint(
            fields=["user", "date"], name="unique_daily_nutrition_user_date",
        )]
        ordering = ["-date"]

    def __str__(self):
        return f"{self.user.email} nutrition for {self.date}"
