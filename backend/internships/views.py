from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from .models import Internship
from .serializers import InternshipSerializer
from . import services


class IsSupervisor(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'supervisor'


class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'


class InternshipListView(generics.ListAPIView):
    serializer_class = InternshipSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return services.get_internships_for_user(self.request.user)


class InternshipCreateView(generics.CreateAPIView):
    serializer_class = InternshipSerializer
    permission_classes = [IsSupervisor]

    def perform_create(self, serializer):
        services.create_internship(self.request.user, serializer.validated_data)


class InternshipDetailView(generics.RetrieveAPIView):
    queryset = Internship.objects.filter(status=Internship.APPROVED)
    serializer_class = InternshipSerializer
    permission_classes = [permissions.IsAuthenticated]


class InternshipDeleteView(generics.DestroyAPIView):
    serializer_class = InternshipSerializer
    permission_classes = [IsSupervisor]

    def get_queryset(self):
        return Internship.objects.filter(supervisor=self.request.user)

    def perform_destroy(self, instance):
        from . import services
        services.delete_internship(self.request.user, instance.id)


class InternshipAdminDeleteView(generics.DestroyAPIView):
    queryset = Internship.objects.all()
    serializer_class = InternshipSerializer
    permission_classes = [IsAdmin]


class InternshipApproveView(generics.UpdateAPIView):
    queryset = Internship.objects.all()
    serializer_class = InternshipSerializer
    permission_classes = [IsAdmin]

    def perform_update(self, serializer):
        try:
            services.approve_internship(serializer.instance, self.request.data.get('status'))
        except ValueError as e:
            raise ValidationError(str(e))
