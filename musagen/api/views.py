from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Session
from .serializers import SessionSerializer, CreateSessionSerializer


class SessionView(generics.ListAPIView):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer


class GetSessionView(APIView):
    serializer_class = SessionSerializer
    lookup_url_kwarg = 'code'

    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)
        if code is not None:
            session = Session.objects.get(code=code)
            if session is not None:
                data = SessionSerializer(session).data
                data['is_host'] = self.request.session.session_key == session.host
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Session Not Found': 'Invalid Room Code'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Code not found'}, status=status.HTTP_400_BAD_REQUEST)

class CreateSessionView(APIView):
    serializer_class = CreateSessionSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            # if current user does not have active session, create one
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            host = self.request.session.session_key

            queryset = Session.objects.filter(host=host)
            if queryset.exists():
                # updating existing room
                session = queryset[0]
                session.guest_can_pause = guest_can_pause
                session.votes_to_skip = votes_to_skip
                session.save(update_fields=['guest_can_pause', 'votes_to_skip'])
                self.request.session['session_code'] = session.code
                return Response(SessionSerializer(session).data, status=status.HTTP_200_OK)
            else:
                # creating new room
                session = Session(host=host, guest_can_pause=guest_can_pause, votes_to_skip=votes_to_skip)
                session.save()
                self.request.session['session_code'] = session.code
                return Response(SessionSerializer(session).data, status=status.HTTP_201_CREATED)

        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)


class UserJoinSession(APIView):
    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        code = request.data.get('code')
        if code is not None:
            session = Session.objects.get(code=code)
            if session is not None:
                self.request.session['session_code'] = code
                # return Response(SessionSerializer(session).data, status=status.HTTP_200_OK)
                return Response({'message': 'Room joined'}, status=status.HTTP_200_OK)
            
            return Response({'Bad Request': 'Invalid session code. Session not found'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'Bad Request': 'No session code'}, status=status.HTTP_400_BAD_REQUEST)


class UserInSession(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        data = {
            'code': self.request.session.get('session_code')
        }

        return JsonResponse(data, status.HTTP_200_OK)
