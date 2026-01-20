export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  image: string;
  description: string;
  sizes: number[];
  category: string;
  colors: string[];
  gallery: string[]; // New field for multiple product images
  description_ka?: string;
  description_ru?: string;
}

export interface CartItem extends Product {
  selectedSize: number;
  quantity: number;
}

export interface Brand {
  name: string;
  logo: string; // URL or Lucide Icon Name
}