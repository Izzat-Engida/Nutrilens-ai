from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True
    dependencies = [("accounts", "0002_passwordresettoken")]
    operations = [migrations.CreateModel(
        name="DailyNutrition",
        fields=[
            ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
            ("date", models.DateField()),
            ("calorie_target", models.PositiveIntegerField()),
            ("protein_target", models.PositiveIntegerField()),
            ("carbohydrate_target", models.PositiveIntegerField()),
            ("fat_target", models.PositiveIntegerField()),
            ("calories_consumed", models.PositiveIntegerField(default=0)),
            ("protein_consumed", models.PositiveIntegerField(default=0)),
            ("carbohydrates_consumed", models.PositiveIntegerField(default=0)),
            ("fat_consumed", models.PositiveIntegerField(default=0)),
            ("created_at", models.DateTimeField(auto_now_add=True)),
            ("updated_at", models.DateTimeField(auto_now=True)),
            ("user", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="daily_nutrition", to="accounts.user")),
        ],
        options={"ordering": ["-date"]},
    ), migrations.AddConstraint(
        model_name="dailynutrition",
        constraint=models.UniqueConstraint(fields=("user", "date"), name="unique_daily_nutrition_user_date"),
    )]
