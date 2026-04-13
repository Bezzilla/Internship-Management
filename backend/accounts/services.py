from .models import User


def register_user(data: dict) -> User:
    return User.objects.create_user(
        username=data['username'],
        email=data.get('email', ''),
        password=data['password'],
        first_name=data.get('first_name', ''),
        last_name=data.get('last_name', ''),
        role=data.get('role', User.STUDENT),
        phone=data.get('phone', ''),
    )


def get_user_profile(user: User) -> User:
    return user


def update_user_profile(user: User, data: dict) -> User:
    for field in ['first_name', 'last_name', 'phone']:
        if field in data:
            setattr(user, field, data[field])
    user.save()
    return user
