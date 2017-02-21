from django.shortcuts import render, redirect
from django.contrib.auth import authenticate as auth_check
from django.contrib.auth import login as auth_login
from django.contrib.auth import logout as auth_logout
from django.contrib.auth.decorators import login_required
from django.http import Http404
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
            return redirect('/home')
        else:
            raise Http404('User not found')


class LogoutView(View):

    def get(self, request):
        if request.user.is_authenticated:
            auth_logout(request)
        return redirect('/login')


class SignupView(View):

    def get(self, request):
        return render(request, 'ewald/signup.html')


class HomeView(View):

    def get(self, request):
        return render(request, 'ewald/home.html', context={
            'username':'Elvis'
        })

