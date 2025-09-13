from rest_framework.decorators import api_view, authentication_classes
from rest_framework.response import Response
from .models import Course, Feedback
from .serializers import CourseSerializer, FeedbackSerializer
from user_accounts.authentication import JWTAuthentication
from django.utils import timezone
from django.shortcuts import render

# Create your views here.

# --------------------------
# Course Endpoints (Admin)
# --------------------------
@api_view(['POST'])
@authentication_classes([JWTAuthentication])
def create_course(request):
    if request.user.role != 'admin':
        return Response({"error": "Admin access required"}, status=403)
    # ADD LOGIC TO CREATE COURSES
    return Response({"message": "Course created (placeholder)"})


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
def list_courses(request):
    # ADD LOGIC TO LIST COURSES
    return Response({"courses": []})


@api_view(['PUT'])
@authentication_classes([JWTAuthentication])
def edit_course(request, course_id):
    if request.user.role != 'admin':
        return Response({"error": "Admin access required"}, status=403)
    # ADD LOGIC TO EDIT COURSES
    return Response({"message": "Course updated (placeholder)"})


@api_view(['DELETE'])
@authentication_classes([JWTAuthentication])
def delete_course(request, course_id):
    if request.user.role != 'admin':
        return Response({"error": "Admin access required"}, status=403)
    # ADD LOGIC TO DELETE COURSES
    return Response({"message": "Course deleted (placeholder)"})


# --------------------------
# Feedback Endpoints (Student)
# --------------------------
@api_view(['POST'])
@authentication_classes([JWTAuthentication])
def submit_feedback(request):
    if request.user.role != 'student':
        return Response({"error": "Only students can submit feedback"}, status=403)
    # ADD LOGIC TO SUBMIT FEEDBACK
    return Response({"message": "Feedback submitted (placeholder)"})


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
def list_feedback(request):
    # ADD LOGIC TO LIST FEEDBACK
    return Response({"feedbacks": []})


@api_view(['PUT'])
@authentication_classes([JWTAuthentication])
def edit_feedback(request, feedback_id):
    # ADD LOGIC TO EDIT FEEDBACK
    return Response({"message": "Feedback updated (placeholder)"})


@api_view(['DELETE'])
@authentication_classes([JWTAuthentication])
def delete_feedback(request, feedback_id):
    # ADD LOGIC TO DELETE FEEDBACK
    return Response({"message": "Feedback deleted (placeholder)"})


# --------------------------
# Admin Feedback Endpoints
# --------------------------
@api_view(['GET'])
@authentication_classes([JWTAuthentication])
def list_all_feedback(request):
    if request.user.role != 'admin':
        return Response({"error": "Admin access required"}, status=403)
    # ADD LOGIC TO LIST ALL FEEDBACKS
    return Response({"feedbacks": []})


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
def export_feedback_csv(request):
    if request.user.role != 'admin':
        return Response({"error": "Admin access required"}, status=403)
    # ADD LOGIC TO EXPORT FEEDBACK CSV
    return Response({"message": "CSV export (placeholder)"})
