from django.shortcuts import render, redirect
from django.contrib.auth import authenticate as auth_check
from django.contrib.auth import login as auth_login
from django.contrib.auth import logout as auth_logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import Http404, HttpResponse
from django.views import View


class DefaultView(View):

    def get(self, request):
        if request.user.is_authenticated:
            return redirect('/home')
        else:
            return redirect('/login')


class LoginView(View):

    def get(self, request):
        if request.user.is_authenticated:
            return redirect('/home')
        else:
            return render(request, 'ewald/login.html')

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

    def get(self, request):
        if request.user.is_authenticated:
            auth_logout(request)
        return redirect('/login')


class SignupView(View):

    def get(self, request):
        return render(request, 'ewald/signup.html')


class HomeView(LoginRequiredMixin, View):
    login_url = '/login/'

    def get(self, request):
        context = {
            'user': {
                'name': 'Elvis'
            }
        }
        return render(request, 'ewald/home.html', context=context)

