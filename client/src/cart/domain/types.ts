export type CartStatus = 'idle' | 'loading' | 'success' | 'error';

export type ProductId = string;

export type CartItemId = string;

export type ProductInfo = {
  id: ProductId;
  name: string;
  price: number;
  imageUrl: string;
};

export type CartItem = {
  id: CartItemId;
  productInfo: ProductInfo;
  quantity: number;
};

export type CartState = {
  status: CartStatus;
  items: CartItem[];
  selectedIds: CartItemId[];
  errorMessage: string;
};
