from django.test import TestCase
from users.models import CustomUser
from django.contrib.auth import get_user_model


class ModelTests(TestCase):

    def test_create_user(self):
        """Test creating a new user with required fields is successful"""
        username = 'mike'
        password = '123'
        email = 'mike@gmail.com'
        user = CustomUser.objects.create_user(
            username=username,
            password=password,
            email=email
        )

        self.assertEqual(user.email, email)
        self.assertTrue(user.check_password(password))
        self.assertEqual(user.username, username)
