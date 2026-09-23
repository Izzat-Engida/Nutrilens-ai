from django.db.models import Q
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Recommendation
from .serializers import RecommendationReadSerializer, RecommendationSerializer
from .services import generate_recommendations


class RecommendationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        recommendations = Recommendation.objects.filter(user=request.user).filter(
            Q(expires_at__isnull=True) | Q(expires_at__gte=timezone.now())
        ).order_by("is_read", "-created_at")
        return Response(RecommendationSerializer(recommendations, many=True).data)


class RecommendationGenerateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        recommendations = generate_recommendations(request.user)
        return Response(
            RecommendationSerializer(recommendations, many=True).data,
            status=status.HTTP_200_OK,
        )


class RecommendationReadView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            recommendation = Recommendation.objects.get(pk=pk, user=request.user)
        except Recommendation.DoesNotExist:
            return Response({"detail": "Recommendation not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = RecommendationReadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        recommendation.is_read = serializer.validated_data.get("is_read", True)
        recommendation.save(update_fields=["is_read"])
        return Response(RecommendationSerializer(recommendation).data)
