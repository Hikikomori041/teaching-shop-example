"""
URL configuration for api project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
"""

from django.contrib import admin
from django.urls import include, path
from rest_framework import routers

from .views import OrderViewSet, ProductViewSet, admin_orders, login, me, register

router = routers.DefaultRouter()
router.register(r"products", ProductViewSet)
router.register(r"orders", OrderViewSet, basename="order")


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
    path("api/auth/register/", register, name="register"),
    path("api/auth/login/", login, name="login"),
    path("api/auth/me/", me, name="me"),
    path("api/admin/orders/", admin_orders, name="admin-orders"),
]
