"""
Unit Tests - Test individual components in isolation

These tests verify that:
1. The Product model works correctly
2. The Product API endpoint returns data properly
"""

from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status

from ..models import Product


class ProductModelTests(TestCase):
    """Test the Product model"""

    def test_product_str_returns_name(self):
        """The string representation of a Product should be its name"""
        product = Product.objects.create(
            name='Baby Romper',
            description='Soft cotton romper for newborns',
            price='19.99',
            imageUrl='/images/romper.jpg'
        )

        # Assert that converting the product to string gives us the product name
        # Hint: Use str(product) to get the string representation
        # Hint: Use self.assertEqual(actual, expected)
        self.assertEqual(str(product), 'Baby Romper')

    def test_product_has_correct_fields(self):
        """A Product should store all its fields correctly"""
        product = Product.objects.create(
            name='Baby Dress',
            description='Cute floral dress',
            price='29.99',
            imageUrl='/images/dress.jpg'
        )

        # Assert that each field has the correct value
        # Hint: Access fields like product.name, product.price, etc.
        # Hint: For price, compare as string since it's stored as Decimal
        self.assertEqual(product.name, 'Baby Dress')
        self.assertEqual(product.description, 'Cute floral dress')
        self.assertEqual(str(product.price), '29.99')
        self.assertEqual(product.imageUrl, '/images/dress.jpg')


class ProductAPITests(TestCase):
    """Test the Product API endpoints"""

    def setUp(self):
        """Set up test data before each test"""
        self.client = APIClient()

        # Create some test products
        Product.objects.create(
            name='Test Product 1',
            description='First test product',
            price='10.00',
            imageUrl='/test1.jpg'
        )
        Product.objects.create(
            name='Test Product 2',
            description='Second test product',
            price='20.00',
            imageUrl='/test2.jpg'
        )

    def test_list_products_returns_200(self):
        """GET /api/products/ should return HTTP 200"""
        response = self.client.get('/api/products/')

        # Assert the response status code is 200 OK
        # Hint: Use status.HTTP_200_OK constant
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_list_products_returns_all_products(self):
        """GET /api/products/ should return all products in the database"""
        response = self.client.get('/api/products/')

        # Assert that the response contains exactly 2 products
        # Hint: response.data is a list of products
        # Hint: Use len() to count items
        self.assertEqual(len(response.data), 2)

    def test_product_data_contains_required_fields(self):
        """Each product in the response should have name, price, and imageUrl"""
        response = self.client.get('/api/products/')
        product = response.data[0]  # Get the first product

        # Assert that the product has 'name', 'price', and 'imageUrl' keys
        # Hint: Use self.assertIn(key, dictionary) to check if a key exists
        self.assertIn('name', product)
        self.assertIn('price', product)
        self.assertIn('imageUrl', product)
