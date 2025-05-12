from rest_framework import serializers
from .models import Newsletter
from django.contrib.auth.models import User

class NewsLetterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Newsletter
        fields = '__all__'