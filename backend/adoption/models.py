from django.db import models
from django.contrib.auth.models import User
from django.utils.timezone import now
from django.core.exceptions import ValidationError

def validate_image_size(value):
    limit = 5 * 1024 * 1024  # 5MB limit
    if value.size > limit:
        raise ValidationError("Image size should not exceed 5MB.")

class Breed(models.Model):
    name = models.CharField(max_length=100, unique=True)
    status = models.IntegerField()
    created_at = models.DateTimeField(default=now, editable=False)

class Dogs(models.Model):
    dog_id = models.CharField(max_length=100, unique=True, null=True, blank=True)
    breed = models.ForeignKey(Breed, on_delete=models.CASCADE, related_name='dogs_breed')
    name = models.CharField(max_length=100)
    age = models.FloatField()
    gender = models.CharField(max_length=12)
    disease = models.CharField(max_length=100)
    color = models.CharField(max_length=100)
    personality = models.CharField(max_length=100)
    image = models.URLField(max_length=500)
    looking_for = models.TextField()
    weight = models.FloatField()
    energy_level = models.CharField(max_length=10)
    vaccinated_status = models.CharField(max_length=30)
    status = models.IntegerField()
    views = models.IntegerField(default=0)
    created_at = models.DateTimeField(default=now, editable=False)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_adoption')

class AdoptionRequest(models.Model):
    name = models.CharField(max_length=100)
    email = models.CharField(max_length=100)
    phone = models.CharField(max_length=10)
    dog = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    status = models.IntegerField(default=1) # 0 for Cancelled, 1 for pending, 2 for in progress, 3 for visiting, 4 for appreved
    created_at = models.DateTimeField(default=now, editable=False)