from django.shortcuts import render
from .serializers import NewsLetterSerializer
from .models import Newsletter
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated

class NewsLetterView(APIView):

    def get_permissions(self):
        return [AllowAny()]

    def get(self, request):
        data = Newsletter.objects.all()
        serializer = NewsLetterSerializer(data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = NewsLetterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


