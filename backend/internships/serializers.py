from rest_framework import serializers
from .models import Internship


class InternshipSerializer(serializers.ModelSerializer):
    supervisor_name = serializers.CharField(source='supervisor.get_full_name', read_only=True)

    class Meta:
        model = Internship
        fields = [
            'id', 'title', 'description', 'company_name', 'location',
            'duration', 'deadline', 'logo', 'supervisor', 'supervisor_name',
            'status', 'created_at',
        ]
        read_only_fields = ['id', 'supervisor', 'status', 'created_at']
