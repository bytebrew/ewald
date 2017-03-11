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

from django.shortcuts import redirect
from django.contrib.auth import authenticate as auth_check
from django.contrib.auth import login as auth_login
from django.contrib.auth import logout as auth_logout
from django.http import Http404, HttpResponse
from django.views import View
from .models import PowderSample
from .viewinfo import render
import json


class SamplesView(View):
    """View tht shows a list of samples owned by a user"""
    def get(self, request):
        query = PowderSample.objects.filter(user__exact=request.user)
        return render(request, 'ewald/samples.html', context={
            'samples' : query,
        })


class ConsoleView(View):
    """A console page for the users to manage their resources"""
    def get(self, request):
        return render(request, 'ewald/console.html')


class LoginView(View):
    """Login view"""
    def get(self, request):
        """GETS to the login route retrieve the html page
        with the login form"""
        if request.user.is_authenticated():
            return redirect('/home')
        else:
            return render(request, 'ewald/login.html')

    def post(self, request):
        """POSTS to the login route are the actual login attempts"""
        user = auth_check(
            username=request.POST['username'],
            password=request.POST['password'])
        if user is not None:
            auth_login(request, user)
            return HttpResponse(status=200)
        else:
            return HttpResponse(status=403)


class LogoutView(View):
    """Logout view"""
    def get(self, request):
        if request.user.is_authenticated:
            auth_logout(request)
        return redirect('/login')


class SignupView(View):
    """View for new user registration"""
    def get(self, request):
        return render(request, 'ewald/signup.html')


class HomeView(View):
    """Ewald main page where the user can start any kind of job"""
    def get(self, request):
        return render(request, 'ewald/home.html')


class DefaultView(View):
    """Default view for error conditions of GET /"""
    def get(self, request):
        if request.user.is_authenticated():
            return redirect('/home')
        else:
            return redirect('/login')
