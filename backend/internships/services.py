from .models import Internship


def create_internship(supervisor, data: dict) -> Internship:
    return Internship.objects.create(
        supervisor=supervisor,
        title=data['title'],
        description=data['description'],
        company_name=data['company_name'],
        location=data['location'],
        duration=data['duration'],
        deadline=data['deadline'],
        logo=data.get('logo'),
        status=Internship.PENDING_APPROVAL,
    )


def get_internships_for_user(user):
    if user.role == 'supervisor':
        return Internship.objects.filter(supervisor=user)
    if user.role == 'admin':
        return Internship.objects.all()
    return Internship.objects.filter(status=Internship.APPROVED)


def delete_internship(supervisor, internship_id: int) -> None:
    internship = Internship.objects.get(id=internship_id, supervisor=supervisor)
    internship.delete()


def approve_internship(internship: Internship, status: str) -> Internship:
    if status not in [Internship.APPROVED, Internship.REJECTED]:
        raise ValueError(f"Invalid status: {status}")
    internship.status = status
    internship.save()
    return internship
