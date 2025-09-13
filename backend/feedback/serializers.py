from rest_framework import serializers
from .models import Feedback, Course
from user_accounts.models import User

class CourseSerializer(serializers.Serializer):
    id = serializers.CharField(source="_id", read_only=True)
    name = serializers.CharField(max_length=200)
    description = serializers.CharField(required=False, allow_blank=True)

class FeedbackSerializer(serializers.Serializer):
    id = serializers.CharField(source="_id", read_only=True)
    student = serializers.CharField()  # store ObjectId as string
    course = serializers.CharField()   # store ObjectId as string
    rating = serializers.IntegerField(min_value=1, max_value=5)
    message = serializers.CharField(required=False, allow_blank=True)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)

class AdminUserSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    name = serializers.CharField()
    email = serializers.EmailField()
    role = serializers.CharField()
    phone = serializers.CharField(required=False, allow_blank=True)
    dob = serializers.DateField(required=False, allow_null=True)
    address = serializers.CharField(required=False, allow_blank=True)
    profile_picture = serializers.URLField(required=False, allow_blank=True)
    is_blocked = serializers.BooleanField()