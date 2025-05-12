from django.db import models

class Newsletter(models.Model):
    email = models.CharField(unique=True, max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
