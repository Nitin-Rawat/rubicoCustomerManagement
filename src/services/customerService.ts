// // customerService.ts - CORRECTED VERSION
// import localforage from "localforage";
// import { Customer } from "../lib/types";


// localforage.config({
//   name: "rubicoCustomerDB",
//   storeName: "customers",
// });

// const KEY_INDEX = "customers_index";

// async function ensureIndex() {
//   return (await localforage.getItem<string[]>(KEY_INDEX)) ?? [];
// }

// async function saveIndex(keys: string[]) {
//   await localforage.setItem(KEY_INDEX, keys);
// }

// export const customerService = {
//   async create(customer: Omit<Customer, "id" | "created_at">) {
//     const id = crypto.randomUUID();
//     const item: Customer = { 
//       id, 
//       created_at: new Date().toISOString(), 
//       ...customer 
//     };

//     await localforage.setItem(id, item);
//     const idx = await ensureIndex();
//     idx.unshift(id);
//     await saveIndex(idx);
//     return item;
//   },

//   async update(id: string, patch: Partial<Omit<Customer, "id" | "created_at">>) {
//     const existing = await localforage.getItem<Customer>(id);
//     if (!existing) throw new Error("Customer not found");
//     const updated = { ...existing, ...patch };
//     await localforage.setItem(id, updated);
//     return updated;
//   },

//   async getAll() {
//     const idx = await ensureIndex();
//     const rows = await Promise.all(idx.map((k) => localforage.getItem<Customer>(k)));
//     return rows.filter(Boolean) as Customer[];
//   },

//   async getById(id: string) {
//     return localforage.getItem<Customer>(id);
//   },

//   async delete(id: string) {
//     await localforage.removeItem(id);
//     const idx = await ensureIndex();
//     await saveIndex(idx.filter((k) => k !== id));
//   },

//   async emailExists(email: string): Promise<boolean> {
//     if (!email) return false;
//     const all = await this.getAll();
//     return all.some((c) => c.email?.toLowerCase() === email.toLowerCase());
//   },
// };

