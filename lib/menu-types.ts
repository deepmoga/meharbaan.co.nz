export type SizeOption = {
  name: string;
  extra: number;
};

export type MenuCategory = {
  id: string;
  name: string;
  sortOrder: number;
};

export type MenuProduct = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  sizeOptions: SizeOption[];
  spiceOptions: string[];
  active: boolean;
};

export type MenuStore = {
  categories: MenuCategory[];
  products: MenuProduct[];
  suburbs: string[];
  timeSlots: Record<string, string[]>;
  orderOptions: {
    delivery: boolean;
    pickup: boolean;
    open?: boolean;
  };
};

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: SizeOption;
  spice?: string;
};

export type CheckoutDetails = {
  mode: "delivery" | "pickup";
  suburb?: string;
  time?: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  zipcode: string;
  notes?: string;
};

export type RestaurantSettings = {
  siteName: string;
  phone: string;
  mobile: string;
  email: string;
  address: string;
  facebook: string;
  instagram: string;
  delivery: boolean;
  pickup: boolean;
  suburbs: string[];
  timeSlots: string[];
};

export type AdminOrder = {
  id: string;
  status: string;
  createdAt: string;
  details: CheckoutDetails;
  items: CartItem[];
  total: number;
};
