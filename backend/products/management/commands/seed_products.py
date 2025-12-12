from django.core.management.base import BaseCommand
from products.models import Category, Product


class Command(BaseCommand):
    help = "Seed sample categories and products for MuscleMate"

    def handle(self, *args, **options):
        categories = [
            ("Protein & Supplements", "protein-supplements"),
            ("Accessories", "accessories"),
        ]

        created_categories = []
        for name, slug in categories:
            category, _ = Category.objects.get_or_create(name=name, slug=slug)
            created_categories.append(category)

        products = [
            {
                "name": "Whey Protein 1kg",
                "slug": "whey-protein-1kg",
                "price": 2499.00,
                "stock": 50,
                "category": created_categories[0],
                "description": "High quality whey protein for muscle recovery.",
            },
            {
                "name": "Lifting Straps",
                "slug": "lifting-straps",
                "price": 399.00,
                "stock": 80,
                "category": created_categories[2],
                "description": "Padded straps for heavy pulls and deadlifts.",
            },
        ]

        for data in products:
            Product.objects.get_or_create(slug=data["slug"], defaults=data)

        self.stdout.write(self.style.SUCCESS("Seeded categories and products."))


