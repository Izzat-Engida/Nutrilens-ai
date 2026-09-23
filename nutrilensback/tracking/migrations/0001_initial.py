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
            name="WeightEntry",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("weight_kg", models.DecimalField(decimal_places=2, max_digits=7, validators=[django.core.validators.MinValueValidator(0.01), django.core.validators.MaxValueValidator(1000)])),
                ("date", models.DateField(default=django.utils.timezone.localdate)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("user", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="weight_entries", to="accounts.user")),
            ],
            options={"ordering": ["-date", "-created_at", "-id"]},
        ),
        migrations.AddConstraint(
            model_name="weightentry",
            constraint=models.UniqueConstraint(fields=("user", "date"), name="unique_weight_entry_user_date"),
        ),
        migrations.AddConstraint(
            model_name="weightentry",
            constraint=models.CheckConstraint(condition=Q(("weight_kg__gt", 0)), name="weight_entry_weight_positive"),
        ),
    ]
