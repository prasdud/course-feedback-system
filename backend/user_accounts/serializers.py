from rest_framework import serializers
from drf_extra_fields.fields import Base64ImageField
from .models import User

class UserSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    name = serializers.CharField(required=True, max_length=100)
    email = serializers.EmailField(read_only=True)  # email shouldnt be editable
    role = serializers.CharField(read_only=True)   # role not editable by user
    #profile_picture = serializers.URLField(required=False, allow_null=True, allow_blank=True)
    profile_picture = serializers.URLField(required=False, allow_null=True, allow_blank=True)
    phone = serializers.CharField(required=False, allow_blank=True, max_length=15)
    dob = serializers.DateTimeField(required=False, allow_null=True)
    address = serializers.CharField(required=False, allow_blank=True, max_length=300)
    
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'profile_picture', 'phone', 'dob', 'address']