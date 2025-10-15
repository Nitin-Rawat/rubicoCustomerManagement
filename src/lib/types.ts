export interface Customer {
  id: string;
  fullName: string; 
  email?: string;
  phone?: string;
  billingAddress: string;
  shippingSameAsBilling: boolean;
  shippingAddress?: string;
  created_at: string;
}
