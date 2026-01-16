from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient


class AuthTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_register_creates_user_and_returns_token(self):
        response = self.client.post(
            "/api/auth/register/", {"username": "testuser", "email": "test@example.com", "password": "testpass123"}
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("token", response.data)
        self.assertEqual(response.data["user"]["username"], "testuser")
        self.assertTrue(User.objects.filter(username="testuser").exists())

    def test_register_duplicate_username_fails(self):
        User.objects.create_user(username="existing", password="pass123")
        response = self.client.post("/api/auth/register/", {"username": "existing", "password": "testpass123"})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_returns_token(self):
        User.objects.create_user(username="testuser", password="testpass123")
        response = self.client.post("/api/auth/login/", {"username": "testuser", "password": "testpass123"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("token", response.data)

    def test_login_invalid_credentials_fails(self):
        User.objects.create_user(username="testuser", password="testpass123")
        response = self.client.post("/api/auth/login/", {"username": "testuser", "password": "wrongpass"})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
