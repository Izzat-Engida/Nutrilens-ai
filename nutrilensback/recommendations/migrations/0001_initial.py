from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True
    dependencies = [("accounts", "0002_passwordresettoken")]
    operations = [
        migrations.CreateModel(
            name="Recommendation",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("category", models.CharField(choices=[("nutrition", "Nutrition"), ("protein", "Protein"), ("calories", "Calories"), ("weight", "Weight"), ("meals", "Meals"), ("progress", "Progress"), ("general", "General")], max_length=20)),
                ("title", models.CharField(max_length=200)),
                ("message", models.TextField()),
                ("priority", models.CharField(choices=[("low", "Low"), ("medium", "Medium"), ("high", "High")], default="medium", max_length=10)),
                ("rule_key", models.CharField(max_length=80)),
                ("is_read", models.BooleanField(default=False)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("expires_at", models.DateTimeField(blank=True, null=True)),
                ("user", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="recommendations", to="accounts.user")),
            ],
            options={"ordering": ["is_read", "-created_at"]},
        ),
        migrations.AddConstraint(
            model_name="recommendation",
            constraint=models.UniqueConstraint(fields=("user", "rule_key"), name="unique_recommendation_user_rule"),
        ),
    ]
