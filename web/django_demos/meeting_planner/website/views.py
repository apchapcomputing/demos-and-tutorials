from datetime import datetime
from django.shortcuts import render
from django.http import HttpResponse

from meetings.models import Meeting


def welcome(request):
    return render(request, "website/welcome.html",
                  {
                      "message": "This data was sent from the view to the template!",
                      "meetings": Meeting.objects.all()
                  })

def date(request):
    return HttpResponse("This page was served at " + str(datetime.now()))

def about(request):
    return HttpResponse("I'm Ashlyn :)")
