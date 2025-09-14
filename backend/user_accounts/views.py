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
import cloudinary.uploader

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

'''
@api_view(['GET'])
@authentication_classes([JWTAuthentication])
def get_profile(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)
'''
@api_view(['GET'])
@authentication_classes([JWTAuthentication])
def get_profile(request):
    try:
        user = request.user
        user.reload()  # Ensure we have the latest data from database
        
        print(f"Getting profile for user: {user.email}")
        print(f"Profile picture in DB: {user.profile_picture}")
        
        serializer = UserSerializer(user)
        return Response({
            "user": serializer.data
        })
    except Exception as e:
        print(f"Get profile error: {e}")
        return Response({
            "error": "Failed to get profile",
            "details": str(e)
        }, status=500)


@api_view(['PUT'])
@authentication_classes([JWTAuthentication])
def update_profile(request):
    data = request.data.copy()
    user = request.user

    try:
        print(f"Received data: {data.keys()}")  # Debug log
        
        # Handle profile picture upload
        if 'profile_picture' in data and data['profile_picture']:
            profile_pic_data = data['profile_picture']
            print(f"Profile picture data received, length: {len(str(profile_pic_data))}")
            
            if isinstance(profile_pic_data, str) and profile_pic_data.startswith('data:image'):
                try:
                    # Upload to Cloudinary
                    upload_result = cloudinary.uploader.upload(
                        profile_pic_data,
                        folder='profile_pics',
                        overwrite=True,
                        resource_type='image',
                        quality='auto:good',
                        fetch_format='auto'
                    )
                    
                    # Extract just the URL string
                    cloudinary_url = upload_result['secure_url']
                    print(f"Cloudinary upload successful: {cloudinary_url}")
                    
                    # Update the data with the URL string
                    data['profile_picture'] = cloudinary_url
                    
                except Exception as upload_error:
                    print(f"Cloudinary upload error: {upload_error}")
                    return Response({
                        "error": "Failed to upload image",
                        "details": str(upload_error)
                    }, status=400)
            else:
                # Invalid format, remove from data
                data.pop('profile_picture', None)
                print("Invalid profile picture format, skipping")

        # Validate data with serializer (excluding profile_picture for now)
        profile_picture_url = data.pop('profile_picture', None)
        
        serializer = UserSerializer(user, data=data, partial=True)
        if serializer.is_valid():
            print(f"Serializer validation passed")
            
            # Update user fields manually
            for field, value in serializer.validated_data.items():
                if hasattr(user, field):
                    setattr(user, field, value)
                    print(f"Updated {field}: {value}")
            
            # Handle profile picture separately to ensure it's saved as string
            if profile_picture_url:
                user.profile_picture = str(profile_picture_url)  # Ensure it's a string
                print(f"Set profile_picture: {user.profile_picture}")
            
            # Update timestamp
            user.updated_at = datetime.utcnow()
            
            # Save the user
            user.save()
            print(f"User saved successfully")
            
            # Verify what was actually saved
            user.reload()  # Reload from database
            print(f"After reload, profile_picture: {user.profile_picture}")
            
            # Return updated data
            updated_serializer = UserSerializer(user)
            return Response({
                "message": "Profile updated successfully",
                "user": updated_serializer.data
            })
        else:
            print(f"Serializer validation failed: {serializer.errors}")
            return Response(serializer.errors, status=400)
            
    except Exception as e:
        print(f"Profile update error: {e}")
        import traceback
        traceback.print_exc()
        return Response({
            "error": "Failed to update profile",
            "details": str(e)
        }, status=500)



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
