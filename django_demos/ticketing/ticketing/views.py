from django.http import HttpResponse
from django.shortcuts import render

from ticketing.models import Ticket


def index(request):
    return render(request, 'index.html')


def submit(request):
    new_ticket = Ticket(submitter="Test User", body="Help me Obi Wan Kenobi, you're my only hope!")
    new_ticket.save()
    return render(request, 'submit.html')


def tickets(request):
    all_tickets = Ticket.objects.all()
    return render(request, 'tickets.html', {'tickets': all_tickets})
