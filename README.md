# Addis Eats — Ethiopian Food Ordering Platform

**Addis Eats** is a food ordering and delivery web application built with **Next.js App Router conventions**, **TypeScript**, **Tailwind CSS**, and **Interactive Map Integration** for Addis Ababa, Ethiopia.

It provides a seamless customer ordering experience for authentic Ethiopian dishes (Doro Wot, Special Kitfo, Sizzling Tibs, Shiro Tegabino, Beyaynetu feast) as well as artisan pizzas, burgers, and specialty drinks. It features an interactive city map with dynamic delivery fee calculations, live courier simulation tracking, instant dish search, category URL synchronization, cart persistence, customer authentication, and an administrative control portal.

---

## 🌟 Key Features

### 🍲 Customer Experience
- **Interactive Addis Ababa Delivery Map**:
  - Interactive Leaflet map with Addis Ababa delivery zones: **Bole, Kazanchis, Piassa, CMC, Sarbet, Mexico, Gerji**.
  - Draggable customer dropoff pin dynamically updates closest neighborhood, coordinates, delivery fee, and estimated arrival time.
  - Displays Addis Eats kitchen branches (Bole Flagship, Kazanchis Hub, Piassa Heritage).
- **Live Courier Tracking Simulation**:
  - Confirmed orders feature animated courier route simulation with live ETA countdown, driver contact card, and progress milestones (Confirmed → Preparing → On the Way → Delivered).
- **Menu & Live Instant Search**:
  - Real-time search across dish titles, ingredients, and categories without page refresh.
  - Category filtering (`Ethiopian`, `Pizza`, `Burgers`, `Drinks`, `All Dishes`) synchronized with the URL (`/menu?category=Ethiopian`) so links can be shared and survive refreshes.
- **Dynamic Dish Details (`/menu/[id]`)**:
  - High-resolution dish photography, ingredients breakdown, spice indicators (Berbere), prep time, customer rating, quantity selectors, and related dish recommendations.
- **Shopping Cart (`/cart`)**:
  - Quantity controls (`+` / `-`), individual item removal, clear cart, live ETB subtotal, delivery fee calculation, and persistent storage via `localStorage`.
  - Automatic live cart count badge in the global header.
- **Favorites (`/favorites`)**:
  - One-click heart bookmarking on any dish card and details page, persisted across browser refreshes with friendly empty states.
- **Protected Checkout (`/checkout`)**:
  - Customer authentication gate.
  - Comprehensive form validation for Customer Name and Ethiopian mobile numbers (`09XXXXXXXX` or `07XXXXXXXX`).
  - Delivery instructions, payment method selection (Telebirr, CBE Birr, Cash on Delivery).
  - Order confirmation screen with celebratory confetti animation and direct tracking access.
- **Order History & Reorder (`/orders`)**:
  - Detailed historical orders list with timestamp, order ID, items breakdown, status badge, map tracking modal, and instant **Reorder** button that restores past orders directly into the shopping cart.
- **Theme Customization**:
  - Light mode and Dark mode toggling with system preference detection and `localStorage` persistence.

---

### 🛡️ Admin Management Extension (`/admin`)
- **Admin Session Gate (`/admin/login`)**:
  - Demonstration login: **Username: `admin`**, **Password: `admin123`**.
  - Protected admin routes with automatic redirection for unauthenticated sessions via `sessionStorage`.
- **Operations Dashboard (`/admin`)**:
  - Live revenue analytics in ETB (`formatCurrency`), total orders count, average order value (AOV), top-selling dishes breakdown, and visual order pipeline progress bars.
- **Menu CRUD Management (`/admin/menu`)**:
  - View all dishes, live filter/search.
  - Add new dish form modal with validation.
  - Edit existing dish pricing, description, category, and image URL.
  - Delete dish with mandatory confirmation modal.
- **Order Fulfillment Pipeline (`/admin/orders`)**:
  - Real-time status transitions: `Pending` → `Preparing` → `Delivering` → `Delivered`.
  - Inspect order details, view destination coordinates, customer instructions, and delete records.

---

## 🛠️ Tech Stack

- **Framework**: Next.js App Router Architecture / React 19 / TypeScript
- **Styling**: Tailwind CSS
- **Mapping**: Leaflet + OpenStreetMap (Addis Ababa coordinates & delivery zones)
- **Icons**: Lucide React
- **Animations & Effects**: Canvas Confetti, CSS keyframes
- **State Management**: React Context API & `localStorage` / `sessionStorage`

---

## 🚀 Installation & Local Development

1. Clone or download the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

---

## 📁 Project Structure

```text
├── public/
│   └── menu-data.json                # Seed dishes data with Ethiopian items, prices, images
├── src/
│   ├── app/                          # Next.js App Router Structure
│   │   ├── layout.tsx                # Root layout with Header & Footer
│   │   ├── page.tsx                  # Home landing page with hero & today's specials
│   │   ├── not-found.tsx             # 404 page
│   │   ├── menu/
│   │   │   ├── page.tsx              # Menu page with search and category filters
│   │   │   └── [id]/
│   │   │       └── page.tsx          # Dynamic dish details page
│   │   ├── cart/
│   │   │   └── page.tsx              # Shopping cart and total fee calculator
│   │   ├── checkout/
│   │   │   └── page.tsx              # Checkout with auth check & interactive map
│   │   ├── favorites/
│   │   │   └── page.tsx              # Saved dishes
│   │   ├── orders/
│   │   │   └── page.tsx              # Order history & reordering
│   │   └── admin/
│   │       ├── layout.tsx            # Admin nested layout with sidebar & route protection
│   │       ├── login/page.tsx        # Admin demonstration login
│   │       ├── page.tsx              # Operations dashboard & analytics
│   │       ├── menu/page.tsx         # Menu CRUD management
│   │       └── orders/page.tsx       # Orders fulfillment pipeline
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx            # Global header with cart badge, theme & auth modal
│   │   │   └── Footer.tsx            # Information, hubs & contacts
│   │   ├── map/
│   │   │   ├── DeliveryMapPicker.tsx # Interactive Addis Ababa zone picker & draggable pin
│   │   │   └── DeliveryTrackerMap.tsx# Live courier route & simulation
│   │   └── ui/
│   │       ├── Button.tsx            # Reusable button with variants & loading state
│   │       ├── Input.tsx             # Accessible inputs with error states
│   │       ├── Modal.tsx             # Accessible dialogs with Escape/backdrop dismiss
│   │       ├── Spinner.tsx           # Loading spinners
│   │       └── EmptyState.tsx        # Reusable friendly empty state cards
│   ├── context/
│   │   └── ThemeContext.tsx          # Dark/light theme provider
│   ├── features/
│   │   ├── auth/
│   │   │   └── AuthContext.tsx       # Customer and admin authentication
│   │   ├── cart/
│   │   │   ├── CartContext.tsx       # Shopping cart store & calculations
│   │   │   └── components/
│   │   │       ├── CartItemRow.tsx
│   │   │       └── CartSummary.tsx
│   │   ├── favorites/
│   │   │   └── FavoritesContext.tsx  # Bookmarks store
│   │   └── menu/
│   │       └── components/
│   │           ├── DishCard.tsx
│   │           ├── DishList.tsx
│   │           ├── CategoryFilter.tsx
│   │           └── SearchBar.tsx
│   ├── lib/
│   │   ├── api.ts                    # API client with seed fallback & CRUD storage
│   │   ├── delivery.ts               # Addis Ababa zones, coordinates & fee calculator
│   │   ├── formatCurrency.ts         # Centralized ETB currency formatter
│   │   └── router.tsx                # Next.js App Router navigation hooks & Link
│   └── types/
│       ├── dish.ts
│       ├── order.ts
│       └── auth.ts
```

---

## 🗺️ Addis Ababa Delivery Zones & Fee Schedule

Delivery fees and arrival estimates are centralized in `src/lib/delivery.ts`:

| Zone | Center Area | Delivery Fee | Estimated Arrival |
|---|---|---|---|
| **Bole** | Medhanealem, Atlas, Rwanda, Edna Mall | ETB 80 | 20–30 min |
| **Kazanchis** | UNECA, Intercontinental, Bambis | ETB 100 | 25–35 min |
| **Piassa** | Arada, Churchill Ave, Taitu | ETB 120 | 30–40 min |
| **CMC** | CMC Michael, Ayat, Salite Mehret | ETB 150 | 35–45 min |
| **Sarbet** | African Union, Bisrate Gabriel, Old Airport | ETB 110 | 25–35 min |
| **Mexico** | Mexico Sq, Sengatera, Legehar | ETB 100 | 25–35 min |
| **Gerji** | Imperial, Sunshine, Jackros | ETB 130 | 30–40 min |
| **Other** | Greater Addis Ababa | ETB 200 | 45–60 min |

---

## 🔐 Educational Authentication Notice

For demonstration and course evaluation purposes:
- **Customer session**: Stored in `localStorage` under `addis_eats_customer_session`.
- **Admin session**: Protected with `sessionStorage` under `addis_eats_admin_session`.
- **Default Admin Credentials**:
  - **Username**: `admin`
  - **Password**: `admin123`
  - Unauthenticated access attempts to `/admin`, `/admin/menu`, or `/admin/orders` will automatically redirect to `/admin/login`.

---

## 🔮 Future Production Roadmap

- Backend database migration (PostgreSQL / Cloud SQL with Prisma/Drizzle).
- Official Telebirr and CBE Birr payment gateway webhooks.
- Multi-driver GPS WebSocket integration for production live telemetry.
- Push notifications for order status changes.
