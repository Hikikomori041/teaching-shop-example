from django.core.management.base import BaseCommand

from api.models import Product


class Command(BaseCommand):
    help = "Seed the database with sample products"

    def handle(self, *_args, **_options):
        products = [
            {
                "name": "Bavoir Étoiles",
                "description": "Bavoir en coton bio avec motif étoiles",
                "price": 12.99,
                "imageUrl": "/bavoir1.jpg",
            },
            {
                "name": "Bavoir Arc-en-ciel",
                "description": "Bavoir coloré aux couleurs de l'arc-en-ciel",
                "price": 14.99,
                "imageUrl": "/bavoir2.jpg",
            },
            {
                "name": "Bavoir Nuages",
                "description": "Bavoir doux avec motif nuages",
                "price": 11.99,
                "imageUrl": "/bavoir3.jpg",
            },
            {
                "name": "Couverture Laine",
                "description": "Couverture douce en laine mérinos",
                "price": 45.99,
                "imageUrl": "/couverture1.jpg",
            },
            {
                "name": "Couverture Polaire",
                "description": "Couverture polaire ultra-douce",
                "price": 39.99,
                "imageUrl": "/couverture2.jpg",
            },
            {
                "name": "Couverture Coton",
                "description": "Couverture légère en coton bio",
                "price": 34.99,
                "imageUrl": "/couverture3.jpg",
            },
            {
                "name": "Couverture Velours",
                "description": "Couverture velours tout confort",
                "price": 49.99,
                "imageUrl": "/couverture4.jpg",
            },
            {
                "name": "Doudou Lapin",
                "description": "Doudou lapin en coton bio",
                "price": 24.99,
                "imageUrl": "/doudou1.jpeg",
            },
            {
                "name": "Doudou Ours",
                "description": "Doudou ours tout doux",
                "price": 26.99,
                "imageUrl": "/doudou2.jpeg",
            },
            {
                "name": "Sac à dos Aventurier",
                "description": "Petit sac à dos pour les sorties",
                "price": 29.99,
                "imageUrl": "/sacados11.jpg",
            },
            {
                "name": "Sac à dos École",
                "description": "Sac à dos idéal pour la maternelle",
                "price": 32.99,
                "imageUrl": "/sacados12.jpg",
            },
            {
                "name": "Sac à dos Sport",
                "description": "Sac à dos léger et pratique",
                "price": 27.99,
                "imageUrl": "/sacados13.jpg",
            },
        ]

        created_count = 0
        for product_data in products:
            product, created = Product.objects.get_or_create(name=product_data["name"], defaults=product_data)
            if created:
                created_count += 1
                self.stdout.write(f"  Created: {product.name}")
            else:
                self.stdout.write(f"  Skipped (exists): {product.name}")

        self.stdout.write(self.style.SUCCESS(f"\nDone! Created {created_count} products."))
