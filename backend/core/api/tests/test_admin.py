from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from ..models import Order, Product


class AdminOrdersTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_user(username="admin", password="adminpass123", is_staff=True)
        self.regular_user = User.objects.create_user(username="regular", password="regularpass123")
        self.product = Product.objects.create(
            name="Test Product", description="A test product", price="29.99", imageUrl="/test.jpg"
        )
        Order.objects.create(user=self.admin_user, product=self.product, card_last_four="1111", status="paid")
        Order.objects.create(user=self.regular_user, product=self.product, card_last_four="2222", status="paid")

    def test_admin_can_view_all_orders(self):
        response = self.client.post("/api/auth/login/", {"username": "admin", "password": "adminpass123"})
        token = response.data["token"]

        self.client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
        response = self.client.get("/api/admin/orders/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_non_admin_cannot_view_admin_orders(self):
        response = self.client.post("/api/auth/login/", {"username": "regular", "password": "regularpass123"})
        token = response.data["token"]

        self.client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
        response = self.client.get("/api/admin/orders/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_login_returns_is_staff_for_admin(self):
        response = self.client.post("/api/auth/login/", {"username": "admin", "password": "adminpass123"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["user"]["is_staff"])

    def test_login_returns_is_staff_false_for_regular_user(self):
        response = self.client.post("/api/auth/login/", {"username": "regular", "password": "regularpass123"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data["user"]["is_staff"])

    def test_register_returns_is_staff_false(self):
        response = self.client.post(
            "/api/auth/register/", {"username": "newuser", "email": "new@example.com", "password": "newpass123"}
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertFalse(response.data["user"]["is_staff"])
