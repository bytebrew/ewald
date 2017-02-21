from django.conf.urls import url, include
from ewald.views import *

urlpatterns = [
    url(r'^$', DefaultView.as_view(), name='default'),
    url(r'^home/$', HomeView.as_view(), name='home'),
    url(r'^login/$', LoginView.as_view(), name='login'),
    url(r'^logout/$', LogoutView.as_view(), name='logout'),
    url(r'^signup/$', SignupView.as_view(), name='signup'),
]

