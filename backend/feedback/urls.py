from django.urls import path
from . import views

urlpatterns = [
    # Courses (Admin)
    path('courses/', views.list_courses, name='list_courses'),
    path('courses/create/', views.create_course, name='create_course'),
    path('courses/<str:course_id>/edit/', views.edit_course, name='edit_course'),
    path('courses/<str:course_id>/delete/', views.delete_course, name='delete_course'),

    # Feedback (Student)
    path('feedback/', views.list_feedback, name='list_feedback'),
    path('feedback/submit/', views.submit_feedback, name='submit_feedback'),
    path('feedback/<str:feedback_id>/edit/', views.edit_feedback, name='edit_feedback'),
    path('feedback/<str:feedback_id>/delete/', views.delete_feedback, name='delete_feedback'),

    # Admin feedback
    path('admin/feedback/', views.list_all_feedback, name='list_all_feedback'),
    path('admin/feedback/export/', views.export_feedback_csv, name='export_feedback_csv'),
]
