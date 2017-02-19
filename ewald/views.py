from django.shortcuts import render, redirect
from django.http import HttpResponse

def default(request):
    return redirect('/login')

def login(request):
    if request.method == 'POST':
        print('Received POST:', request.POST)
        return HttpResponse('')
    else:
        return render(request, 'ewald/login.html')

def signup(request):
    return render(request, 'ewald/signup.html')

def home(request):
    return render(request, 'ewald/home.html')

