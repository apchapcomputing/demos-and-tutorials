from django.urls import path
from .views import SessionView, CreateSessionView, GetSessionView, UserJoinSession, UserInSession

urlpatterns = [
    path('sessions', SessionView.as_view()),
    path('create-session', CreateSessionView.as_view()),
    path('get-session', GetSessionView.as_view()),
    path('join-session', UserJoinSession.as_view()),
    path('in-session', UserInSession.as_view()),
]
