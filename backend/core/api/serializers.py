from rest_framework import serializers

from .models import Order, Product


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"


class OrderSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    product_price = serializers.DecimalField(source="product.price", max_digits=10, decimal_places=2, read_only=True)
    product_image = serializers.CharField(source="product.imageUrl", read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "product",
            "product_name",
            "product_price",
            "product_image",
            "card_last_four",
            "status",
            "created_at",
        ]
        read_only_fields = ["id", "card_last_four", "status", "created_at"]


class AdminOrderSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    product_price = serializers.DecimalField(source="product.price", max_digits=10, decimal_places=2, read_only=True)
    product_image = serializers.CharField(source="product.imageUrl", read_only=True)
    username = serializers.CharField(source="user.username", read_only=True)
    user_email = serializers.CharField(source="user.email", read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "user",
            "username",
            "user_email",
            "product",
            "product_name",
            "product_price",
            "product_image",
            "card_last_four",
            "status",
            "created_at",
        ]
        read_only_fields = ["id", "user", "card_last_four", "status", "created_at"]
