// services/LocalForageCustomerRepository.ts
import localforage from "localforage";
import { ICustomerRepository } from "./ICustomerRepository";
import { Customer } from "../lib/types";

localforage.config({
  name: "rubicoCustomerDB",
  storeName: "customers",
});

const KEY_INDEX = "customers_index";

export class LocalForageCustomerRepository implements ICustomerRepository {
  private async ensureIndex(): Promise<string[]> {
    return (await localforage.getItem<string[]>(KEY_INDEX)) ?? [];
  }

  private async saveIndex(keys: string[]): Promise<void> {
    await localforage.setItem(KEY_INDEX, keys);
  }

  async create(data: Omit<Customer, "id" | "created_at">): Promise<Customer> {
    const id = crypto.randomUUID();
    const customer: Customer = {
      id,
      created_at: new Date().toISOString(),
      ...data,
    };

    await localforage.setItem(id, customer);
    const idx = await this.ensureIndex();
    idx.unshift(id);
    await this.saveIndex(idx);
    return customer;
  }

  async update(id: string, data: Partial<Customer>): Promise<Customer> {
    const existing = await localforage.getItem<Customer>(id);
    if (!existing) throw new Error("Customer not found");
    const updated = { ...existing, ...data };
    await localforage.setItem(id, updated);
    return updated;
  }

  async getAll(): Promise<Customer[]> {
    const idx = await this.ensureIndex();
    const rows = await Promise.all(
      idx.map((k) => localforage.getItem<Customer>(k))
    );
    return rows.filter(Boolean) as Customer[];
  }

  async delete(id: string): Promise<void> {
    await localforage.removeItem(id);
    const idx = await this.ensureIndex();
    await this.saveIndex(idx.filter((k) => k !== id));
  }

  async emailExists(email: string): Promise<boolean> {
    if (!email) return false;
    const all = await this.getAll();
    return all.some((c) => c.email?.toLowerCase() === email.toLowerCase());
  }
}

export const customerRepository = new LocalForageCustomerRepository();