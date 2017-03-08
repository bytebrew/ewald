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

from django.shortcuts import render, redirect
from django.contrib.auth import authenticate as auth_check
from django.contrib.auth import login as auth_login
from django.contrib.auth import logout as auth_logout
from django.http import Http404, HttpResponse
from django.views import View
from .models import PowderSample
import os

def ewald_render(request, view, context={}):
    context['viewinfo'] = request.viewinfo
    print(context['viewinfo'])
    return render(request, view, context)

class DefaultView(View):
    """Default view for error conditions of GET /"""
    def get(self, request):
        if request.user.is_authenticated():
            return redirect('/home')
        else:
            return redirect('/login')


class LoginView(View):
    """Login view"""
    def get(self, request):
        if request.user.is_authenticated():
            return redirect('/home')
        else:
            return ewald_render(request, 'ewald/login.html')

    def post(self, request):
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
        return ewald_render(request, 'ewald/signup.html')


class HomeView(View):
    """Ewald main page where the user can start any kind of job"""
    def get(self, request):
        sample = PowderSample.objects.get(nickname='devsample')
        sample_data = sample.powder_diffrac
        context = {
            'xData': str(sample_data['angles']),
            'yData': str(sample_data['intensities'])
        }
        return ewald_render(request, 'ewald/home.html', context=context)
