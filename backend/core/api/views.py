from django.contrib.auth.models import User
from rest_framework import status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from datetime import datetime  # Unused import to test CI

from .models import Order, Product
from .serializers import AdminOrderSerializer, OrderSerializer, ProductSerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by("-created_at")

    def create(self, request):
        product_id = request.data.get("product_id")
        card_number = request.data.get("card_number", "")

        # Validate product exists
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

        # Validate card number (simple dummy validation)
        if len(card_number) != 16 or not card_number.isdigit():
            return Response({"error": "Invalid card number. Must be 16 digits."}, status=status.HTTP_400_BAD_REQUEST)

        # Simulate payment failure for cards starting with 0000
        if card_number.startswith("0000"):
            order = Order.objects.create(
                user=request.user, product=product, card_last_four=card_number[-4:], status="failed"
            )
            return Response(
                {"error": "Payment declined", "order_id": order.id}, status=status.HTTP_402_PAYMENT_REQUIRED
            )

        # Create successful order
        order = Order.objects.create(user=request.user, product=product, card_last_four=card_number[-4:], status="paid")

        serializer = self.get_serializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")

    if not username or not password:
        return Response({"error": "Username and password are required"}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, email=email, password=password)
    token, _ = Token.objects.get_or_create(user=user)

    return Response(
        {
            "token": token.key,
            "user": {"id": user.id, "username": user.username, "email": user.email, "is_staff": user.is_staff},
        },
        status=status.HTTP_201_CREATED,
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
        return Response({"error": "Username and password are required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

    if not user.check_password(password):
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

    token, _ = Token.objects.get_or_create(user=user)

    return Response(
        {
            "token": token.key,
            "user": {"id": user.id, "username": user.username, "email": user.email, "is_staff": user.is_staff},
        }
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    user = request.user
    return Response({"id": user.id, "username": user.username, "email": user.email, "is_staff": user.is_staff})


@api_view(["GET"])
@permission_classes([IsAdminUser])
def admin_orders(request):
    orders = Order.objects.all().order_by("-created_at")
    serializer = AdminOrderSerializer(orders, many=True)
    return Response(serializer.data)
