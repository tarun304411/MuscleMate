from decimal import Decimal
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Order, OrderItem
from .serializers import OrderSerializer


class PlaceOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        items = request.data.get("items", [])  # [{product, price, quantity}]
        if not items:
            return Response({"detail": "No items"}, status=status.HTTP_400_BAD_REQUEST)

        # Simple repeat-customer discount: if user has a previous order, 10% off
        is_repeat = Order.objects.filter(user=request.user).exists()
        subtotal = sum(Decimal(str(it.get("price", 0))) * int(it.get("quantity", 1)) for it in items)
        discount = (subtotal * Decimal("0.10")) if is_repeat else Decimal("0")
        total = subtotal - discount

        order = Order.objects.create(user=request.user, total_amount=total, discount_amount=discount)
        for it in items:
            OrderItem.objects.create(
                order=order,
                product_id=it["product"],
                price=Decimal(str(it["price"])),
                quantity=int(it.get("quantity", 1)),
            )
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class MyOrdersView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        qs = Order.objects.filter(user=request.user).order_by('-created_at')
        data = OrderSerializer(qs, many=True).data
        return Response({"count": len(data), "orders": data})


