from rest_framework import serializers
from .models import Application


class ApplicationSerializer(serializers.ModelSerializer):
    internship_title = serializers.CharField(source='internship.title', read_only=True)
    internship_company = serializers.CharField(source='internship.company_name', read_only=True)
    student_name = serializers.CharField(source='student.get_full_name', read_only=True)
    supervisor_email = serializers.SerializerMethodField()
    supervisor_name = serializers.CharField(source='internship.supervisor.get_full_name', read_only=True)

    class Meta:
        model = Application
        fields = [
            'id', 'student', 'student_name', 'internship', 'internship_title',
            'internship_company', 'resume', 'status', 'applied_at',
            'supervisor_email', 'supervisor_name',
        ]
        read_only_fields = ['id', 'student', 'status', 'applied_at']

    def get_supervisor_email(self, obj):
        if obj.status == Application.ACCEPTED:
            return obj.internship.supervisor.email
        return None
