from .models import Application
from internships.models import Internship


def apply_to_internship(student, data: dict) -> Application:
    internship = Internship.objects.get(id=data['internship'], status=Internship.APPROVED)

    if Application.objects.filter(student=student, internship=internship).exists():
        raise ValueError("You have already applied to this internship.")

    return Application.objects.create(
        student=student,
        internship=internship,
        resume=data['resume'],
        status=Application.PENDING,
    )


def get_student_applications(student):
    return Application.objects.filter(student=student)


def get_internship_applications(supervisor, internship_id):
    return Application.objects.filter(
        internship_id=internship_id,
        internship__supervisor=supervisor,
    )


def update_application_status(supervisor, application_id: int, status: str) -> Application:
    if status not in [Application.ACCEPTED, Application.REJECTED]:
        raise ValueError(f"Invalid status: {status}")

    application = Application.objects.get(
        id=application_id,
        internship__supervisor=supervisor,
    )
    application.status = status
    application.save()
    return application
