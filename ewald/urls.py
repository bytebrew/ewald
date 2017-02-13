from django.conf.urls import url, include
from . import views 

urlpatterns = [
    url(r'^login', views.login, name='login'),
    url(r'^home', views.home, name='home'),
    url(r'', views.default, name='default'),
]

