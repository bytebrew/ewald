from django.shortcuts import render, redirect
from django.http import HttpResponse

def default(request):
    # TODO: check if user is logged in
    return redirect('/login')

def login(request):
    return render(request, 'ewald/login.html')

def home(request):
    return render(request, 'ewald/home.html')

