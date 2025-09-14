from rest_framework import serializers
from .models import Feedback, Course
from user_accounts.models import User
from rest_framework import serializers
from .models import Feedback

class CourseSerializer(serializers.Serializer):
    id = serializers.SerializerMethodField() # changed to serializermethodfield
    name = serializers.CharField(max_length=200)
    description = serializers.CharField(required=False, allow_blank=True)

    def get_id(self, obj):
        return str(obj.id) # convert ObjectId to string


class FeedbackSerializer(serializers.Serializer):
    id = serializers.SerializerMethodField()  # Changed from CharField with source="_id"
    student_name = serializers.CharField(source='student.name', read_only=True)
    course_name = serializers.CharField(source='course.name', read_only=True)
    course_id = serializers.SerializerMethodField()
    rating = serializers.IntegerField(min_value=1, max_value=5)
    message = serializers.CharField(required=False, allow_blank=True)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)

    def get_id(self, obj):
        return str(obj.id)  # Convert ObjectId to string

    def get_course_id(self, obj):
        return str(obj.course.id)

    # **Implement update() manually**
    def update(self, instance, validated_data):
        instance.rating = validated_data.get('rating', instance.rating)
        instance.message = validated_data.get('message', instance.message)
        instance.updated_at = validated_data.get('updated_at', instance.updated_at)
        instance.save()
        return instance

    # Optional, implement create if you use serializer.save() for creation
    def create(self, validated_data):
        return Feedback(**validated_data).save()


class AdminUserSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    name = serializers.CharField()
    email = serializers.EmailField()
    role = serializers.CharField()
    phone = serializers.CharField(required=False, allow_blank=True)
    dob = serializers.DateTimeField(required=False, allow_null=True)
    address = serializers.CharField(required=False, allow_blank=True)
    profile_picture = serializers.URLField(required=False, allow_blank=True)
    is_blocked = serializers.BooleanField()