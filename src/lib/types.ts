export interface Customer {
  id: string;
  full_name: string; 
  email?: string;
  phone?: string;
  billing_address: string;
  shipping_same_as_billing: boolean;
  shipping_address?: string;
  created_at: string;
}
