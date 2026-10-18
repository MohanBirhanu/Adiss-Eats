import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { CartItem } from "@/src/types/order";
import { Dish } from "@/src/types/dish";
import { calculateDeliveryFee } from "@/src/lib/delivery";

interface CartContextType {
  items: CartItem[];
  addToCart: (dish: Dish, quantity?: number) => void;
  updateQuantity: (dishId: number, delta: number) => void;
  removeFromCart: (dishId: number) => void;
  clearCart: () => void;
  reorderItems: (
    items: {
      dishId: number;
      name: string;
      price: number;
      quantity: number;
      image: string;
    }[]
  ) => void;
  totalItemCount: number;
  subtotal: number;
  deliveryArea: string;
  setDeliveryArea: (area: string) => void;
  deliveryFee: number;
  total: number;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: () => {},
  updateQuantity: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  reorderItems: () => {},
  totalItemCount: 0,
  subtotal: 0,
  deliveryArea: "Bole",
  setDeliveryArea: () => {},
  deliveryFee: 80,
  total: 80,
});

const CART_STORAGE_KEY = "addis_eats_cart_v1";
const CART_AREA_KEY = "addis_eats_delivery_area_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    // Default initial sample cart item for preview experience
    return [
      {
        dish: {
          id: 1,
          name: "Doro Wot",
          price: 450,
          image:
            "https://i.pinimg.com/1200x/28/ed/65/28ed659fd2e0fb1048d83e2084de4641.jpg",
          category: "Ethiopian",
        },
        quantity: 2,
      },
    ];
  });

  const [deliveryArea, setDeliveryAreaState] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(CART_AREA_KEY) || "Bole";
    }
    return "Bole";
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const setDeliveryArea = (area: string) => {
    setDeliveryAreaState(area);
    localStorage.setItem(CART_AREA_KEY, area);
  };

  const addToCart = (dish: Dish, quantity: number = 1) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.dish.id === dish.id);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      }
      return [
        ...prev,
        {
          dish: {
            id: dish.id,
            name: dish.name,
            price: dish.price,
            image: dish.image,
            category: dish.category,
          },
          quantity,
        },
      ];
    });
  };

  const updateQuantity = (dishId: number, delta: number) => {
    setItems((prev) => {
      return prev
        .map((item) => {
          if (item.dish.id === dishId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (dishId: number) => {
    setItems((prev) => prev.filter((i) => i.dish.id !== dishId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const reorderItems = (
    orderItems: {
      dishId: number;
      name: string;
      price: number;
      quantity: number;
      image: string;
    }[]
  ) => {
    setItems((prev) => {
      const next = [...prev];
      orderItems.forEach((orderItem) => {
        const existingIdx = next.findIndex(
          (item) => item.dish.id === orderItem.dishId
        );
        if (existingIdx > -1) {
          next[existingIdx] = {
            ...next[existingIdx],
            quantity: next[existingIdx].quantity + orderItem.quantity,
          };
        } else {
          next.push({
            dish: {
              id: orderItem.dishId,
              name: orderItem.name,
              price: orderItem.price,
              image: orderItem.image,
              category: "Ethiopian",
            },
            quantity: orderItem.quantity,
          });
        }
      });
      return next;
    });
  };

  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.dish.price * item.quantity,
    0
  );
  const deliveryFee = items.length > 0 ? calculateDeliveryFee(deliveryArea) : 0;
  const total = subtotal + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        reorderItems,
        totalItemCount,
        subtotal,
        deliveryArea,
        setDeliveryArea,
        deliveryFee,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
