from django.shortcuts import render
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.response import Response
from mongoengine.errors import NotUniqueError
from .models import User
import bcrypt
import re
import jwt
from datetime import datetime, timedelta
from django.conf import settings
from .authentication import JWTAuthentication
from .serializers import UserSerializer

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

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
def get_profile(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@api_view(['PUT'])
@authentication_classes([JWTAuthentication])
def update_profile(request):
    data = request.data
    user = request.user

    serializer = UserSerializer(user, data=data, partial=True)
    if serializer.is_valid():
        # update user fields manually since it's mongoengine
        for field, value in serializer.validated_data.items():
            setattr(user, field, value)
        user.save()
        return Response({"message": "Profile updated successfully"})
    return Response(serializer.errors, status=400)


@api_view(['PUT'])
@authentication_classes([JWTAuthentication])
def change_password(request):
    user = request.user
    current_password = request.data.get('current_password')
    new_password = request.data.get('new_password')

    # Check if passwords are provided
    if not current_password or not new_password:
        return Response({"error": "Both current and new passwords are required"}, status=400)

    # Check current password
    if not bcrypt.checkpw(current_password.encode('utf-8'), user.password.encode('utf-8')):
        return Response({"error": "Current password is incorrect"}, status=400)

    # Validate new password
    if len(new_password) < 8 or not re.search(r'\d', new_password) or not re.search(r'[!@#$%^&*(),.?\":{}|<>]', new_password):
        return Response({"error": "New password does not meet requirements"}, status=400)

    # Hash new password
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), salt).decode('utf-8')
    user.password = hashed_password
    user.save()

    return Response({"message": "Password updated successfully"})
