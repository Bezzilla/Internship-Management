from django.urls import path
from . import views

urlpatterns = [
    path('', views.StudentApplicationListView.as_view(), name='my-applications'),
    path('apply/', views.ApplicationCreateView.as_view(), name='apply'),
    path('internship/<int:internship_id>/', views.InternshipApplicationListView.as_view(), name='internship-applications'),
    path('<int:pk>/status/', views.ApplicationStatusUpdateView.as_view(), name='application-status'),
]
