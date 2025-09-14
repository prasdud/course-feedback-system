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
from django.http import FileResponse
from django.conf.urls.static import static


def serve_frontend_file(request, file_path=''):
    """Serve frontend files directly"""
    if not file_path:
        file_path = 'index.html'  # Default to index.html
    
    frontend_dir = os.path.join(settings.BASE_DIR, '..', 'frontend')
    file_full_path = os.path.join(frontend_dir, file_path)
    
    if os.path.exists(file_full_path) and os.path.isfile(file_full_path):
        return FileResponse(open(file_full_path, 'rb'))
    else:
        # If file not found, serve index.html for SPA routing
        index_path = os.path.join(frontend_dir, 'index.html')
        if os.path.exists(index_path):
            return FileResponse(open(index_path, 'rb'))
    
    from django.http import Http404
    raise Http404("File not found")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('user_accounts.urls')),
    path('api/', include('feedback.urls')),
    path('<path:file_path>', serve_frontend_file, name='serve_frontend'),
    path('', serve_frontend_file, name='home'),

]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)