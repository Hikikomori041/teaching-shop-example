import random
from datetime import timedelta

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from django.utils import timezone

from api.models import Order, Product


class Command(BaseCommand):
    help = "Seed the database with sample orders for testing"

    def add_arguments(self, parser):
        parser.add_argument(
            "--days",
            type=int,
            default=14,
            help="Number of days to generate orders for (default: 14)",
        )
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Clear existing orders before seeding",
        )

    def handle(self, *_args, **options):
        days = options["days"]
        clear = options["clear"]

        if clear:
            deleted_count, _ = Order.objects.all().delete()
            self.stdout.write(f"Cleared {deleted_count} existing orders")

        # Ensure we have test users
        test_users = []
        for i in range(1, 4):
            user, created = User.objects.get_or_create(
                username=f"testuser{i}",
                defaults={
                    "email": f"testuser{i}@example.com",
                    "is_active": True,
                },
            )
            if created:
                user.set_password("testpass123")
                user.save()
                self.stdout.write(f"  Created user: {user.username}")
            test_users.append(user)

        # Get all products
        products = list(Product.objects.all())
        if not products:
            self.stdout.write(self.style.ERROR("No products found. Run seed_products first."))
            return

        # Generate orders for the past N days
        now = timezone.now()
        created_count = 0

        for days_ago in range(days, -1, -1):
            # Random number of orders per day (1-5)
            orders_today = random.randint(1, 5)

            for _ in range(orders_today):
                user = random.choice(test_users)
                product = random.choice(products)

                # 80% paid, 20% failed
                status = "paid" if random.random() < 0.8 else "failed"

                # Random card last four digits
                card_last_four = f"{random.randint(1000, 9999)}"

                # Create the order
                order = Order.objects.create(
                    user=user,
                    product=product,
                    card_last_four=card_last_four,
                    status=status,
                )

                # Override created_at (auto_now_add bypass)
                order_date = now - timedelta(
                    days=days_ago,
                    hours=random.randint(8, 20),
                    minutes=random.randint(0, 59),
                )
                Order.objects.filter(pk=order.pk).update(created_at=order_date)

                created_count += 1

        self.stdout.write(self.style.SUCCESS(f"\nDone! Created {created_count} orders over {days + 1} days."))
