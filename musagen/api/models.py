from django.db import models
import random
import string

def generate_session_code():
    length = 6
    while True:
        code = ''.join(random.choices(string.ascii_uppercase, k=length))
        print(code)
        if Session.objects.get(code=code) is None:
            break
    return code

class Session(models.Model):

    code = models.CharField(max_length=8, unique=True, default=generate_session_code)
    host = models.CharField(max_length=255, unique=True)
    guest_can_pause = models.BooleanField(default=False, null=False)
    votes_to_skip = models.IntegerField(default=1, null=False)
    created_at = models.DateTimeField(auto_now_add=True)

