import { Customer } from "../lib/types";

export interface ICustomerRepository {
  create(data: Omit<Customer, "id" | "created_at">): Promise<Customer>;
  update(id: string, data: Partial<Customer>): Promise<Customer>;
  getAll(): Promise<Customer[]>;
  delete(id: string): Promise<void>;
  emailExists(email: string): Promise<boolean>;
  phoneExists(phone: string): Promise<boolean>;
}