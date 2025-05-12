from django.urls import path
from .views import NewsLetterView
urlpatterns = [
   path("", NewsLetterView.as_view(), name="NewsLetterView"),
]
