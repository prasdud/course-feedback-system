from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from mongoengine.errors import NotUniqueError
from .models import User
import bcrypt
import re
import jwt
from datetime import datetime, timedelta
from django.conf import settings

# Create your views here.


@api_view(['POST'])
def register(request):
    data = request.data
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    role = data.get("role", "student")

    #Validate password
    if len(password) < 8 or not re.search(r'\d', password) or not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        return Response({"error": "Password does not meet requirements"}, status=400)

    #Hash password
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

    #Save user
    try:
        user = User(name=name, email=email, password=hashed_password, role=role)
        user.save()
        return Response({"message": "User registered successfully"})
    except NotUniqueError:
        return Response({"error": "Email already exists"}, status=400)

@api_view(['POST'])
def login(request):
    data = request.data
    email = data.get('email')
    password = data.get('password')

    #check user existence
    try:
        user = User.objects.get(email = email)
    except User.DoesNotExist:
        return Response({"error": "Invalid email or password"}, status=401)

    #verify password
    if not bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
        return Response({"error": "Invalid email or password"}, status=401)
    
    #generate jwt
    payload = {
        "user_id": str(user.id),
        "role": user.role,
        "exp": datetime.utcnow() + timedelta(hours=1)
    }
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
    '''
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
    if isinstance(token, bytes):  
        token = token.decode("utf-8")
    '''
    return Response({"token": token})