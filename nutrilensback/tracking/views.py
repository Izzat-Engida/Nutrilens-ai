from decimal import Decimal

from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import Profile

from .models import WeightEntry
from .serializers import WeightEntrySerializer, WeightProgressSerializer


class WeightEntryViewSet(viewsets.ModelViewSet):
    serializer_class = WeightEntrySerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["get", "post", "put", "patch", "delete", "head", "options"]

    def get_queryset(self):
        return WeightEntry.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ProgressView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        entries = list(
            WeightEntry.objects.filter(user=request.user).order_by("date", "created_at", "id")
        )

        if not entries:
            target_weight = None
            try:
                target_weight = Profile.objects.get(user=request.user).target_weight_kg
            except Profile.DoesNotExist:
                pass
            data = {
                "current_weight": None,
                "starting_weight": None,
                "lowest_weight": None,
                "highest_weight": None,
                "total_change": None,
                "target_weight": target_weight,
                "target_progress_percent": None,
                "entries_count": 0,
                "history": [],
            }
            return Response(WeightProgressSerializer(data).data)

        starting = entries[0].weight_kg
        current = entries[-1].weight_kg
        lowest = min(entry.weight_kg for entry in entries)
        highest = max(entry.weight_kg for entry in entries)
        total_change = current - starting

        target_weight = None
        try:
            target_weight = Profile.objects.get(user=request.user).target_weight_kg
        except Profile.DoesNotExist:
            pass

        target_progress = None
        if target_weight is not None and starting != target_weight:
            # Works for both loss and gain goals: 0% at the starting weight,
            # 100% at the target, and is capped to a useful display range.
            target_progress = ((starting - current) / (starting - Decimal(str(target_weight)))) * 100
            target_progress = max(Decimal("0"), min(Decimal("100"), target_progress))
            target_progress = target_progress.quantize(Decimal("0.01"))

        data = {
            "current_weight": current,
            "starting_weight": starting,
            "lowest_weight": lowest,
            "highest_weight": highest,
            "total_change": total_change,
            "target_weight": target_weight,
            "target_progress_percent": target_progress,
            "entries_count": len(entries),
            "history": entries,
        }
        return Response(WeightProgressSerializer(data).data)
