# core/urls.py
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.http import FileResponse, Http404
import os

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
    
    raise Http404("File not found")

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Auth routes (matching your API client /auth/ endpoints)
    path('auth/', include('user_accounts.urls')),
    
    # API routes (matching your API client /api/ endpoints)
    path('api/', include('feedback.urls')),  # This should include all your /api/ endpoints
    
    # Serve static files (CSS, JS, images)
    re_path(r'^(?:css|js|assets|images)/.*', serve_frontend_file),
    
    # Root path serves index.html
    path('', serve_frontend_file, name='home'),
    
    # Catch-all for frontend routing (SPA)
    re_path(r'^.*', serve_frontend_file, name='frontend_catchall'),
]


# Serve static files in development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)