export type OrderStatus = 'pending' | 'preparing' | 'delivering' | 'delivered';

export interface OrderItem {
  dishId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  area: string;
  addressNotes?: string;
  lat?: number;
  lng?: number;
}

export interface Order {
  id: string;
  customer: CustomerDetails;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  estimatedDeliveryTime: string;
  paymentMethod?: string;
}

export interface CartItem {
  dish: {
    id: number;
    name: string;
    price: number;
    image: string;
    category: string;
  };
  quantity: number;
}
