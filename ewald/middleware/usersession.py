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

from django.contrib.auth import logout as auth_logout
from django.conf import settings
from django.http import HttpResponseRedirect
import datetime

class UserSessionError(Exception):
    """Error thrown when a session can not be validadet or
    have expired"""
    pass

class UserSession(object):
    """This middleware takes care of the routes that require login and
    of the session expiration logic for Ewald"""
    def __init__(self, get_response):
        self.get_response = get_response

    def process_request(self, request):
        now = datetime.datetime.now()
        last_request = now
        if 'last_request_time' in request.session:
            last_request = request.session['last_request_time']
        elapsed = (1./60.) * float((now - last_request).total_seconds())
        request.session['last_request_time'] = now
        try:
            # conditions for session invalidation are:
            #  - the time since last request exceeds the maximum allowed
            #  - used is not logged in and trying to access a restricted url
            if elapsed > settings.USERSESSION_MAX_INACTIVITY:
                raise UserSessionError
            if request.path not in settings.USERSESSION_PUBLIC_URLS:
                if not request.user.is_authenticated():
                    raise UserSessionError
                if request.user.last_login.day != now.day:
                    raise UserSessionError
        except UserSessionError:
            if not request.user.is_authenticated():
                auth_logout(request)
            return HttpResponseRedirect('/login/')
        response = self.get_response(request)
        return response

    def __call__(self, request):
        return self.process_request(request)

