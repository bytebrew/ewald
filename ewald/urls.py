#
# Copyright (C) 2017 Elvis Teixeira
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

from django.conf.urls import url, include
from ewald.views import *

urlpatterns = [
    url(r'^home/$', HomeView.as_view(), name='home'),
    url(r'^samples/$', SamplesView.as_view(), name='samples'),
    url(r'^sample/(?P<samp_name>[a-zA-Z_-]+)/(?P<samp_attr>[a-zA-Z_-]+)$',
        SampleView.as_view(), name='sample'),
    url(r'^terminal/$', TerminalView.as_view(), name='terminal'),
    url(r'^terminal/command/$',
        TerminalCommandView.as_view(), name='terminal_command'),
    url(r'^login/$', LoginView.as_view(), name='login'),
    url(r'^logout/$', LogoutView.as_view(), name='logout'),
    url(r'^signup/$', SignupView.as_view(), name='signup'),
    url(r'^$', DefaultView.as_view(), name='default'),
]

# Make sure no one is logged in on server start up
from django.contrib.sessions.models import Session
Session.objects.all().delete()
