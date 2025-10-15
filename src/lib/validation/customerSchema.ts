
import { z } from "zod";
import { customerRepository } from "../../services";


export const customerSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.email({error:"Invalid email"}).optional().or(z.literal("")),
  phone: z.string().regex(/(\+)?(91)?( )?[789]\d{9}/g, "Invalid phone format").optional().or(z.literal("")),
  billingAddress: z.string().min(10, "Address too short"),
  shippingSameAsBilling: z.boolean(),
  shippingAddress: z.string().optional().or(z.literal("")),
})
.refine((data) => data.email || data.phone, {
  message: "Either email or phone is required",
  path: ["email"],
})
.refine((data) => {
  if (!data.shippingSameAsBilling && !data.shippingAddress?.trim()) {
    return false;
  }
  return true;
}, {
  message: "Shipping address required when different from billing",
  path: ["shippingAddress"],
});

// Separate async validation function to pass from component
export const createEmailUniqueValidator = (isEditing: boolean, initialEmail?: string) => {
  return async (email: string | undefined) => {
    if (!email) return true;
    if (isEditing && initialEmail === email) return true;
    
    const exists = await customerRepository.emailExists(email);
    return !exists;
  };
};

export type CustomerFormData = z.infer<typeof customerSchema>;
