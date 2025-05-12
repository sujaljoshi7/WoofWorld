from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import ContactSerializer
from .models import Contact
from rest_framework.response import Response
from rest_framework import status


class ContactView(APIView):
    def get_permissions(self):
        return [AllowAny()]

    def get(self, request):
        data = Contact.objects.all()
        serializer = ContactSerializer(data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        phone = request.data.get('phone')
        if len(str(phone)) != 10 or not str(phone).isdigit():
            return Response({"phone": "Phone number must be exactly 10 digits."}, status=status.HTTP_400_BAD_REQUEST)
        serializer = ContactSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
