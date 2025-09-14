"""core URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
import os
from django.views.static import serve
from django.conf import settings

def serve_frontend(request, filename='index.html'):
    path_to_file = os.path.join(settings.FRONTEND_DIR, filename)
    return serve(request, os.path.basename(path_to_file), os.path.dirname(path_to_file))


urlpatterns = [
    path('', serve_frontend, name='index'),
    path('admin/', admin.site.urls),
    path('auth/', include('user_accounts.urls')),
    path('api/', include('feedback.urls')),
]
