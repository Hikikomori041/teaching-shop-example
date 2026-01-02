# Subject 5: Basic Analytics

## Objective
Add basic analytics tracking to count product views, store them in the database, and display them on a dedicated `/analytics` page.

**Git skills practiced:** branching, committing, pushing, creating a Pull Request

---

## Setup

1. Clone the repository (if not already done)
2. Create your feature branch from `main` called `feature/analytics`
3. Start the development servers with `./start-dev.sh`

---

## Tasks

### Task 1: Backend - Create ProductView Model

**File to modify:** `backend/core/api/models.py`

Add a `ProductView` model to track views per product:

```diff
 class Product(models.Model):
     ...


+class ProductView(models.Model):
+    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='views')
+    viewed_at = models.DateTimeField(auto_now_add=True)
+
+    def __str__(self):
+        return f"View of {self.product.name} at {self.viewed_at}"
```

**Git:** Commit your changes

---

### Task 2: Backend - Register in Django Admin

**File to modify:** `backend/core/api/admin.py`

```diff
-from .models import Product
+from .models import Product, ProductView

 admin.site.register(Product)
+
+@admin.register(ProductView)
+class ProductViewAdmin(admin.ModelAdmin):
+    list_display = ('product', 'viewed_at')
+    list_filter = ('product',)
```

**Git:** Commit your changes

---

### Task 3: Backend - Create Migration

Run the migration command:

```bash
cd backend/core
uv run python manage.py makemigrations
uv run python manage.py migrate
```

**Git:** Commit the migration file

---

### Task 4: Backend - Add Analytics API Endpoints

**File to modify:** `backend/core/api/urls.py`

Add endpoints to record views and get analytics:

```diff
-from .models import Product
+from .models import Product, ProductView
+from rest_framework.decorators import api_view
+from rest_framework.response import Response
+from django.db.models import Count


 class ProductSerializer(serializers.ModelSerializer):
     ...


+@api_view(['POST'])
+def record_view(request, product_id):
+    try:
+        product = Product.objects.get(id=product_id)
+        ProductView.objects.create(product=product)
+        return Response({'status': 'recorded'})
+    except Product.DoesNotExist:
+        return Response({'error': 'Product not found'}, status=404)
+
+
+@api_view(['GET'])
+def get_analytics(request):
+    stats = Product.objects.annotate(
+        view_count=Count('views')
+    ).values('id', 'name', 'view_count')
+    return Response(list(stats))
+
+
 router = routers.DefaultRouter()
 router.register(r'products', ProductViewSet)


 urlpatterns = [
     path('admin/', admin.site.urls),
     path('api/', include(router.urls)),
+    path('api/products/<int:product_id>/view/', record_view),
+    path('api/analytics/', get_analytics),
 ]
```

**Git:** Commit your changes

---

### Task 5: Frontend - Create Analytics API Functions

**File to create:** `frontend/src/api/analytics.ts`

```tsx
export interface ProductAnalytics {
  id: number;
  name: string;
  view_count: number;
}

export async function fetchAnalytics(): Promise<ProductAnalytics[]> {
  const response = await fetch("http://localhost:8000/api/analytics/");
  return response.json();
}

export async function recordProductView(productId: number): Promise<void> {
  await fetch(`http://localhost:8000/api/products/${productId}/view/`, {
    method: "POST",
  });
}
```

**Git:** Commit your changes

---

### Task 6: Frontend - Create Analytics Page Component

**File to create:** `frontend/src/pages/AnalyticsPage.tsx`

```tsx
import { useState, useEffect } from 'react';
import type { ProductAnalytics } from '../api/analytics';
import { fetchAnalytics } from '../api/analytics';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<ProductAnalytics[]>([]);

  useEffect(() => {
    fetchAnalytics().then(setAnalytics);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Analytics</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Product Views</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Product</th>
              <th className="text-right py-2">Views</th>
            </tr>
          </thead>
          <tbody>
            {analytics.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="py-2">{item.name}</td>
                <td className="text-right py-2">{item.view_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

**Git:** Commit your changes

---

### Task 7: Frontend - Add Analytics Route

**File to modify:** `frontend/src/App.tsx`

Add a route for the analytics page:

```diff
 import { BrowserRouter, Routes, Route } from 'react-router-dom';
 import HomePage from './pages/HomePage';
+import AnalyticsPage from './pages/AnalyticsPage';

 export default function App() {
   return (
     <BrowserRouter>
       <Routes>
         <Route path="/" element={<HomePage />} />
+        <Route path="/analytics" element={<AnalyticsPage />} />
       </Routes>
     </BrowserRouter>
   );
 }
```

**Git:** Commit your changes

---

### Task 8: Frontend - Record Views on Product Click

**File to modify:** `frontend/src/pages/HomePage.tsx`

Add view tracking when users click on a product:

```diff
 import { useProducts } from '../contexts/ProductsContext';
+import { recordProductView } from '../api/analytics';
 import Spinner from "../Spinner";
```

Update the product card to be clickable:

```diff
           {products.map((product) => (
             <div
               key={product.id}
               className="bg-white rounded-lg shadow-md overflow-hidden"
+              onClick={() => recordProductView(product.id)}
+              style={{ cursor: 'pointer' }}
             >
```

**Git:** Commit your changes

---

## Push and Create Pull Request

1. Push your branch to the remote repository
2. Create a Pull Request on GitHub:
   - Base: `main`
   - Compare: your feature branch
   - Write a clear title and description
3. Request a review from a teammate

---

## Checklist

- [ ] Created feature branch from `main`
- [ ] Added `ProductView` model
- [ ] Registered ProductView in Django admin
- [ ] Created and applied migration
- [ ] Added API endpoints for recording views and getting analytics
- [ ] Created analytics API functions
- [ ] Created `AnalyticsPage` component
- [ ] Added analytics route to App.tsx
- [ ] Added view tracking on product click
- [ ] Made atomic commits with clear messages
- [ ] Pushed branch and created PR
