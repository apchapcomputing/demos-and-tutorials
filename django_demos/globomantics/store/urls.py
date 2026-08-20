from django.urls import re_path, path

from . import views
from .views import EquipmentView

urlpatterns = [
    path('', views.index, name='index'),
    re_path(r'^\d+', views.detail, name='detail'),
    # re_path(r'^electronics', views.electronics, name='electronics'),
    re_path(r'^electronics', EquipmentView.as_view(), name='electronics'),
    re_path(r'^logout', views.logout, name='logout'),
]
