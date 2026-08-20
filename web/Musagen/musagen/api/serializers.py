from rest_framework import serializers
from .models import Session


class SessionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Session
        fields = ('id', 'code', 'host', 'guest_can_pause', 'votes_to_skip', 'created_at')


class CreateSessionSerializer(serializers.ModelSerializer):

    # /create-session {}
    class Meta:
        model = Session
        fields = ('guest_can_pause', 'votes_to_skip')

