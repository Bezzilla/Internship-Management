from django.urls import path
from . import views

urlpatterns = [
    path('', views.InternshipListView.as_view(), name='internship-list'),
    path('create/', views.InternshipCreateView.as_view(), name='internship-create'),
    path('<int:pk>/', views.InternshipDetailView.as_view(), name='internship-detail'),
    path('<int:pk>/approve/', views.InternshipApproveView.as_view(), name='internship-approve'),
]
