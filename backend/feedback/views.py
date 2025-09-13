from rest_framework.decorators import api_view, authentication_classes
from rest_framework.response import Response
from .models import Course, Feedback
from .serializers import CourseSerializer, FeedbackSerializer
from user_accounts.authentication import JWTAuthentication
from django.utils import timezone
import csv
from django.http import HttpResponse

# --------------------------
# Course Endpoints (Admin)
# --------------------------
@api_view(['POST'])
@authentication_classes([JWTAuthentication])
def create_course(request):
    if request.user.role != 'admin':
        return Response({"error": "Admin access required"}, status=403)

    serializer = CourseSerializer(data=request.data)
    if serializer.is_valid():
        course = Course(**serializer.validated_data)
        course.save()
        return Response({"message": "Course created successfully"})
    else:
        return Response(serializer.errors, status=400)


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
def list_courses(request):
    courses = Course.objects.all()
    serializer = CourseSerializer(courses, many=True)
    return Response({"courses": serializer.data})


@api_view(['PUT'])
@authentication_classes([JWTAuthentication])
def edit_course(request, course_id):
    if request.user.role != 'admin':
        return Response({"error": "Admin access required"}, status=403)

    try:
        course = Course.objects.get(id=course_id)
    except Course.DoesNotExist:
        return Response({"error": "Course not found"}, status=404)

    serializer = CourseSerializer(data=request.data)
    if serializer.is_valid():
        course.update(**serializer.validated_data)
        return Response({"message": "Course updated successfully"})
    else:
        return Response(serializer.errors, status=400)


@api_view(['DELETE'])
@authentication_classes([JWTAuthentication])
def delete_course(request, course_id):
    if request.user.role != 'admin':
        return Response({"error": "Admin access required"}, status=403)

    try:
        course = Course.objects.get(id=course_id)
        course.delete()
        return Response({"message": "Course deleted successfully"})
    except Course.DoesNotExist:
        return Response({"error": "Course not found"}, status=404)


# --------------------------
# Feedback Endpoints (Student)
# --------------------------
@api_view(['POST'])
@authentication_classes([JWTAuthentication])
def submit_feedback(request):
    if request.user.role != 'student':
        return Response({"error": "Only students can submit feedback"}, status=403)

    data = request.data
    data['student'] = request.user.id

    serializer = FeedbackSerializer(data=data)
    if serializer.is_valid():
        Feedback(
            student=request.user,
            course=serializer.validated_data['course'],
            rating=serializer.validated_data['rating'],
            message=serializer.validated_data.get('message', ''),
            created_at=timezone.now(),
            updated_at=timezone.now()
        ).save()
        return Response({"message": "Feedback submitted successfully"})
    else:
        return Response(serializer.errors, status=400)


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
def list_feedback(request):
    if request.user.role != 'student':
        return Response({"error": "Only students can view feedback"}, status=403)

    feedbacks = Feedback.objects(student=request.user)
    serializer = FeedbackSerializer(feedbacks, many=True)
    return Response({"feedbacks": serializer.data})


@api_view(['PUT'])
@authentication_classes([JWTAuthentication])
def edit_feedback(request, feedback_id):
    try:
        feedback = Feedback.objects.get(id=feedback_id)
    except Feedback.DoesNotExist:
        return Response({"error": "Feedback not found"}, status=404)

    if feedback.student != request.user:
        return Response({"error": "Cannot edit others' feedback"}, status=403)

    serializer = FeedbackSerializer(data=request.data)
    if serializer.is_valid():
        feedback.update(
            rating=serializer.validated_data['rating'],
            message=serializer.validated_data.get('message', feedback.message),
            updated_at=timezone.now()
        )
        return Response({"message": "Feedback updated successfully"})
    else:
        return Response(serializer.errors, status=400)


@api_view(['DELETE'])
@authentication_classes([JWTAuthentication])
def delete_feedback(request, feedback_id):
    try:
        feedback = Feedback.objects.get(id=feedback_id)
    except Feedback.DoesNotExist:
        return Response({"error": "Feedback not found"}, status=404)

    if feedback.student != request.user:
        return Response({"error": "Cannot delete others' feedback"}, status=403)

    feedback.delete()
    return Response({"message": "Feedback deleted successfully"})


# --------------------------
# Admin Feedback Endpoints
# --------------------------
@api_view(['GET'])
@authentication_classes([JWTAuthentication])
def list_all_feedback(request):
    if request.user.role != 'admin':
        return Response({"error": "Admin access required"}, status=403)

    feedbacks = Feedback.objects.all()
    serializer = FeedbackSerializer(feedbacks, many=True)
    return Response({"feedbacks": serializer.data})


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
def export_feedback_csv(request):
    if request.user.role != 'admin':
        return Response({"error": "Admin access required"}, status=403)

    feedbacks = Feedback.objects.all()
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="feedbacks.csv"'

    writer = csv.writer(response)
    writer.writerow(['Student', 'Course', 'Rating', 'Message', 'Created At'])

    for f in feedbacks:
        writer.writerow([f.student.name, f.course.name, f.rating, f.message, f.created_at])

    return response
