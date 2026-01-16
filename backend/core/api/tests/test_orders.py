from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from ..models import Order, Product


class OrderTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="testuser", password="testpass123")
        self.other_user = User.objects.create_user(username="otheruser", password="testpass123")
        self.product = Product.objects.create(
            name="Test Product", description="A test product", price="29.99", imageUrl="/test.jpg"
        )
        # Login and get token
        response = self.client.post("/api/auth/login/", {"username": "testuser", "password": "testpass123"})
        self.token = response.data["token"]

    def test_create_order_authenticated(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token}")
        response = self.client.post("/api/orders/", {"product_id": self.product.id, "card_number": "1234567890123456"})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["status"], "paid")
        self.assertEqual(response.data["card_last_four"], "3456")

    def test_create_order_unauthenticated_fails(self):
        response = self.client.post("/api/orders/", {"product_id": self.product.id, "card_number": "1234567890123456"})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_order_invalid_card_fails(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token}")
        response = self.client.post(
            "/api/orders/",
            {
                "product_id": self.product.id,
                "card_number": "123",  # Too short
            },
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_order_declined_card(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token}")
        response = self.client.post(
            "/api/orders/",
            {
                "product_id": self.product.id,
                "card_number": "0000123456789012",  # Starts with 0000
            },
        )
        self.assertEqual(response.status_code, status.HTTP_402_PAYMENT_REQUIRED)
        self.assertIn("error", response.data)

    def test_list_orders_returns_only_user_orders(self):
        # Create order for current user
        Order.objects.create(user=self.user, product=self.product, card_last_four="1234", status="paid")
        # Create order for other user
        Order.objects.create(user=self.other_user, product=self.product, card_last_four="5678", status="paid")

        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token}")
        response = self.client.get("/api/orders/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  # Only user's own order
