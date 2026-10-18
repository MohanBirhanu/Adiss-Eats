import { Dish } from "@/src/types/dish";
import { Order, OrderStatus } from "@/src/types/order";

const DISHES_STORAGE_KEY = "addis_eats_dishes_v1";
const ORDERS_STORAGE_KEY = "addis_eats_orders_v1";

// Initial sample orders so order history and admin dashboard have rich live data immediately
const INITIAL_SAMPLE_ORDERS: Order[] = [
  {
    id: "AE-10291",
    customer: {
      name: "Yonas Mulugeta",
      phone: "0911456789",
      area: "Bole",
      addressNotes: "Near Edna Mall, Sunshine Apt 402",
      lat: 9.0012,
      lng: 38.7845,
    },
    items: [
      {
        dishId: 1,
        name: "Doro Wot",
        price: 450,
        quantity: 2,
        image:
          "https://i.pinimg.com/1200x/28/ed/65/28ed659fd2e0fb1048d83e2084de4641.jpg",
      },
      {
        dishId: 13,
        name: "Ethiopian Yirgacheffe Spiced Cold Brew",
        price: 140,
        quantity: 2,
        image:
          "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80",
      },
    ],
    subtotal: 1180,
    deliveryFee: 80,
    total: 1260,
    status: "delivered",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    estimatedDeliveryTime: "20–30 minutes",
    paymentMethod: "Cash on Delivery (Telebirr)",
  },
  {
    id: "AE-10292",
    customer: {
      name: "Selamawit Kebede",
      phone: "0922890123",
      area: "Kazanchis",
      addressNotes: "Behind UNECA building, Gate 3",
      lat: 9.0185,
      lng: 38.7712,
    },
    items: [
      {
        dishId: 2,
        name: "Special Kitfo",
        price: 520,
        quantity: 1,
        image:
          "https://i.pinimg.com/1200x/2d/cb/4d/2dcb4d30906d77d91ed617ff9d6da93f.jpg",
      },
      {
        dishId: 7,
        name: "Addis Fire Pizza",
        price: 540,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
      },
      {
        dishId: 14,
        name: "Fresh Layered Avocado & Mango Spris",
        price: 160,
        quantity: 2,
        image:
          "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80",
      },
    ],
    subtotal: 1380,
    deliveryFee: 100,
    total: 1480,
    status: "delivering",
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    estimatedDeliveryTime: "25–35 minutes",
    paymentMethod: "Telebirr",
  },
  {
    id: "AE-10293",
    customer: {
      name: "Nahom Birhanu",
      phone: "0933123456",
      area: "Piassa",
      addressNotes: "Near Taitu Hotel, Churchill Rd",
      lat: 9.0345,
      lng: 38.7523,
    },
    items: [
      {
        dishId: 3,
        name: "Siga Tibs (Sizzling)",
        price: 420,
        quantity: 2,
        image:
          "https://i.pinimg.com/1200x/b1/07/4b/b1074b1c80186762da943d290f8cc59c.jpg",
      },
      {
        dishId: 10,
        name: "Gourmet Chicken Burger",
        price: 380,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
      },
    ],
    subtotal: 1220,
    deliveryFee: 120,
    total: 1340,
    status: "preparing",
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    estimatedDeliveryTime: "30–40 minutes",
    paymentMethod: "CBE Birr",
  },
];

/**
 * Fetch all dishes. Reads from local storage if populated, or falls back to /menu-data.json seed.
 */
export async function getDishes(): Promise<Dish[]> {
  if (typeof window !== "undefined") {
    const cached = localStorage.getItem(DISHES_STORAGE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error("Error parsing cached dishes", e);
      }
    }
  }

  // Load from seed JSON
  try {
    const res = await fetch("/menu-data.json");
    if (!res.ok) {
      throw new Error(`Failed to load menu data: ${res.statusText}`);
    }
    const seedDishes: Dish[] = await res.json();
    if (typeof window !== "undefined") {
      localStorage.setItem(DISHES_STORAGE_KEY, JSON.stringify(seedDishes));
    }
    return seedDishes;
  } catch (error) {
    console.error("Error loading seed dishes", error);
    return [];
  }
}

/**
 * Fetch a single dish by numeric ID.
 */
export async function getDishById(id: number | string): Promise<Dish | null> {
  const dishes = await getDishes();
  const numericId = typeof id === "string" ? parseInt(id, 10) : id;
  return dishes.find((d) => d.id === numericId) || null;
}

/**
 * Create a new dish (Admin CRUD)
 */
export async function createDish(dishData: Omit<Dish, "id">): Promise<Dish> {
  const dishes = await getDishes();
  const maxId = dishes.reduce((max, d) => Math.max(max, d.id), 0);
  const newDish: Dish = {
    ...dishData,
    id: maxId + 1,
  };
  const updated = [newDish, ...dishes];
  if (typeof window !== "undefined") {
    localStorage.setItem(DISHES_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("addis_dishes_updated"));
  }
  return newDish;
}

/**
 * Update existing dish (Admin CRUD)
 */
export async function updateDish(dish: Dish): Promise<Dish> {
  const dishes = await getDishes();
  const updated = dishes.map((d) => (d.id === dish.id ? dish : d));
  if (typeof window !== "undefined") {
    localStorage.setItem(DISHES_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("addis_dishes_updated"));
  }
  return dish;
}

/**
 * Delete a dish (Admin CRUD)
 */
export async function deleteDish(id: number): Promise<boolean> {
  const dishes = await getDishes();
  const updated = dishes.filter((d) => d.id !== id);
  if (typeof window !== "undefined") {
    localStorage.setItem(DISHES_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("addis_dishes_updated"));
  }
  return true;
}

/**
 * Fetch all orders
 */
export async function getOrders(): Promise<Order[]> {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {
        console.error("Error parsing orders", e);
      }
    }
    // Seed initial orders if none exist
    localStorage.setItem(
      ORDERS_STORAGE_KEY,
      JSON.stringify(INITIAL_SAMPLE_ORDERS)
    );
    return INITIAL_SAMPLE_ORDERS;
  }
  return INITIAL_SAMPLE_ORDERS;
}

/**
 * Create a new order
 */
export async function createOrder(order: Order): Promise<Order> {
  const currentOrders = await getOrders();
  const updated = [order, ...currentOrders];
  if (typeof window !== "undefined") {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("addis_orders_updated"));
  }
  return order;
}

/**
 * Update status of an order (Admin)
 */
export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<Order | null> {
  const currentOrders = await getOrders();
  let updatedOrder: Order | null = null;
  const updated = currentOrders.map((o) => {
    if (o.id === id) {
      updatedOrder = { ...o, status };
      return updatedOrder;
    }
    return o;
  });

  if (typeof window !== "undefined" && updatedOrder) {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("addis_orders_updated"));
  }
  return updatedOrder;
}

/**
 * Delete an order (Admin)
 */
export async function deleteOrder(id: string): Promise<boolean> {
  const currentOrders = await getOrders();
  const updated = currentOrders.filter((o) => o.id !== id);
  if (typeof window !== "undefined") {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("addis_orders_updated"));
  }
  return true;
}
