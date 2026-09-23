from django.db import migrations, models
import django.core.validators
import django.db.models.deletion
from django.db.models import Q
import django.utils.timezone


class Migration(migrations.Migration):
    initial = True
    dependencies = [("accounts", "0002_passwordresettoken")]
    operations = [
        migrations.CreateModel(
            name="Meal",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("meal_type", models.CharField(choices=[("breakfast", "Breakfast"), ("lunch", "Lunch"), ("dinner", "Dinner"), ("snack", "Snack")], max_length=20)),
                ("consumed_at", models.DateTimeField(default=django.utils.timezone.now)),
                ("notes", models.TextField(blank=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("user", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="meals", to="accounts.user")),
            ],
            options={"ordering": ["-consumed_at", "-id"]},
        ),
        migrations.CreateModel(
            name="MealItem",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("food_name", models.CharField(max_length=200)),
                ("quantity", models.DecimalField(decimal_places=2, max_digits=10, validators=[django.core.validators.MinValueValidator(0.01)])),
                ("unit", models.CharField(max_length=50)),
                ("calories", models.DecimalField(decimal_places=2, max_digits=10, validators=[django.core.validators.MinValueValidator(0)])),
                ("protein", models.DecimalField(decimal_places=2, max_digits=10, validators=[django.core.validators.MinValueValidator(0)])),
                ("carbohydrates", models.DecimalField(decimal_places=2, max_digits=10, validators=[django.core.validators.MinValueValidator(0)])),
                ("fat", models.DecimalField(decimal_places=2, max_digits=10, validators=[django.core.validators.MinValueValidator(0)])),
                ("meal", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="items", to="meals.meal")),
            ],
            options={"ordering": ["id"]},
        ),
        migrations.AddConstraint(model_name="mealitem", constraint=models.CheckConstraint(condition=Q(("quantity__gt", 0)), name="meal_item_quantity_positive")),
        migrations.AddConstraint(model_name="mealitem", constraint=models.CheckConstraint(condition=Q(("calories__gte", 0)), name="meal_item_calories_nonnegative")),
        migrations.AddConstraint(model_name="mealitem", constraint=models.CheckConstraint(condition=Q(("protein__gte", 0)), name="meal_item_protein_nonnegative")),
        migrations.AddConstraint(model_name="mealitem", constraint=models.CheckConstraint(condition=Q(("carbohydrates__gte", 0)), name="meal_item_carbs_nonnegative")),
        migrations.AddConstraint(model_name="mealitem", constraint=models.CheckConstraint(condition=Q(("fat__gte", 0)), name="meal_item_fat_nonnegative")),
    ]
