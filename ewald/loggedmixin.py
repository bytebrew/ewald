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

from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth import logout as auth_logout
from django.conf import settings
import datetime

class LoggedMixin(LoginRequiredMixin):
    login_url = '/login/'

    def dispatch(self, request, *args, **kwargs):
        now = datetime.datetime.now()
        if request.user.is_authenticated():
            if 'last_request_time' in request.session:
                minutes = (1./60.) * (now -
                    request.session['last_request_time']).total_seconds()
                if minutes > settings.LOGGEDIN_MIXIN_INACTIVITY_TIME:
                    del request.session['last_request_time']
                    auth_logout(request)
                else:
                    request.session['last_request_time'] = now
            else:
                request.session['last_request_time'] = now
        return super().dispatch(request, *args, **kwargs)
