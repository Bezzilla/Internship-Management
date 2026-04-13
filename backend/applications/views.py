from rest_framework import generics, permissions
from rest_framework.exceptions import ValidationError
from .models import Application
from .serializers import ApplicationSerializer
from . import services


class IsStudent(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'student'


class IsSupervisor(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'supervisor'


class ApplicationCreateView(generics.CreateAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsStudent]

    def perform_create(self, serializer):
        try:
            services.apply_to_internship(self.request.user, serializer.validated_data)
        except ValueError as e:
            raise ValidationError(str(e))


class StudentApplicationListView(generics.ListAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsStudent]

    def get_queryset(self):
        return services.get_student_applications(self.request.user)


class InternshipApplicationListView(generics.ListAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsSupervisor]

    def get_queryset(self):
        return services.get_internship_applications(
            self.request.user, self.kwargs['internship_id']
        )


class ApplicationStatusUpdateView(generics.UpdateAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsSupervisor]

    def get_queryset(self):
        return Application.objects.filter(internship__supervisor=self.request.user)

    def perform_update(self, serializer):
        try:
            services.update_application_status(
                self.request.user,
                serializer.instance.id,
                self.request.data.get('status'),
            )
        except ValueError as e:
            raise ValidationError(str(e))
