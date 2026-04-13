from rest_framework import serializers
from .models import Application


class ApplicationSerializer(serializers.ModelSerializer):
    internship_title = serializers.CharField(source='internship.title', read_only=True)
    student_name = serializers.CharField(source='student.get_full_name', read_only=True)

    class Meta:
        model = Application
        fields = [
            'id', 'student', 'student_name', 'internship', 'internship_title',
            'resume', 'status', 'applied_at',
        ]
        read_only_fields = ['id', 'student', 'status', 'applied_at']
