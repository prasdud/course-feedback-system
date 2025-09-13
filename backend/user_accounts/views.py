from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from mongoengine.errors import NotUniqueError
from .models import User
import bcrypt
import re

# Create your views here.


@api_view(['POST'])
def register(request):
    data = request.data
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    #Validate password
    if len(password) < 8 or not re.search(r'\d', password) or not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        return Response({"error": "Password does not meet requirements"}, status=400)

    #Hash password
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

    #Save user
    try:
        user = User(name=name, email=email, password=hashed_password)
        user.save()
        return Response({"message": "User registered successfully"})
    except NotUniqueError:
        return Response({"error": "Email already exists"}, status=400)
