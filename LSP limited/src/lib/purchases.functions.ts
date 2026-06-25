import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { PRODUCTS } from "@/data/products";

export type CreatePurchaseInput = {
  productId: string;
  planLabel: string;
  contactEmail: string;
  contactPhone: string;
  notes?: string;
};

function validateInput(data: unknown): CreatePurchaseInput {
  const d = data as Record<string, unknown>;
  const productId = typeof d?.productId === "string" ? d.productId.trim() : "";
  const planLabel = typeof d?.planLabel === "string" ? d.planLabel.trim() : "";
  const contactEmail = typeof d?.contactEmail === "string" ? d.contactEmail.trim() : "";
  const contactPhone = typeof d?.contactPhone === "string" ? d.contactPhone.trim() : "";
  const notes = typeof d?.notes === "string" ? d.notes.slice(0, 1000) : "";
  if (!productId || !planLabel) throw new Error("Invalid request");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contactEmail) || contactEmail.length > 255) {
    throw new Error("Invalid email");
  }
  if (contactPhone.length < 5 || contactPhone.length > 32) throw new Error("Invalid phone");
  return { productId, planLabel, contactEmail, contactPhone, notes };
}

export const createPurchase = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(validateInput)
  .handler(async ({ data, context }) => {
    const product = PRODUCTS.find((p) => p.id === data.productId);
    if (!product) throw new Error("Unknown product");
    const plan = product.plans.find((pl) => pl.label === data.planLabel);
    if (!plan) throw new Error("Unknown plan");
    if (!(plan.price > 0)) throw new Error("Invalid plan price");

    const { error } = await context.supabase.from("purchases").insert({
      user_id: context.userId,
      product_id: product.id,
      product_name: product.name,
      plan_label: plan.label,
      price: plan.price,
      status: "pending",
      contact_email: data.contactEmail,
      contact_phone: data.contactPhone,
      notes: data.notes ?? "",
    });
    if (error) {
      console.error("createPurchase insert failed:", error);
      throw new Error("Could not save purchase");
    }
    return {
      ok: true,
      product: { id: product.id, name: product.name, category: product.category },
      plan: { label: plan.label, price: plan.price },
    };
  });