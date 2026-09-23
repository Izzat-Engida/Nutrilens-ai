from django.db import models
from django.core.validators import MinValueValidator
from django.db.models import Q
from django.utils import timezone

from accounts.models import User


class Meal(models.Model):
    BREAKFAST = "breakfast"
    LUNCH = "lunch"
    DINNER = "dinner"
    SNACK = "snack"

    MEAL_TYPE_CHOICES = [
        (BREAKFAST, "Breakfast"),
        (LUNCH, "Lunch"),
        (DINNER, "Dinner"),
        (SNACK, "Snack"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="meals",
    )
    meal_type = models.CharField(max_length=20, choices=MEAL_TYPE_CHOICES)
    consumed_at = models.DateTimeField(default=timezone.now)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-consumed_at", "-id"]

    def __str__(self):
        return f"{self.get_meal_type_display()} for {self.user.email}"


class MealItem(models.Model):
    meal = models.ForeignKey(
        Meal,
        on_delete=models.CASCADE,
        related_name="items",
    )
    food_name = models.CharField(max_length=200)
    quantity = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0.01)],
    )
    unit = models.CharField(max_length=50)
    calories = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
    )
    protein = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
    )
    carbohydrates = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
    )
    fat = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
    )

    class Meta:
        ordering = ["id"]
        constraints = [
            models.CheckConstraint(
                condition=Q(quantity__gt=0),
                name="meal_item_quantity_positive",
            ),
            models.CheckConstraint(
                condition=Q(calories__gte=0),
                name="meal_item_calories_nonnegative",
            ),
            models.CheckConstraint(
                condition=Q(protein__gte=0),
                name="meal_item_protein_nonnegative",
            ),
            models.CheckConstraint(
                condition=Q(carbohydrates__gte=0),
                name="meal_item_carbs_nonnegative",
            ),
            models.CheckConstraint(
                condition=Q(fat__gte=0),
                name="meal_item_fat_nonnegative",
            ),
        ]

    def __str__(self):
        return self.food_name

# Create your models here.
