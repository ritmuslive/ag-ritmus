"use server";

import { dodoPayments } from "@/lib/dodopayments";
import { db } from "@/db";
import { product } from "@/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import type {
  Product as DodoProduct,
  ProductListResponse,
} from "dodopayments/resources/products/products";
import type { TimeInterval } from "dodopayments/resources/subscriptions";

// Types
export type ProductType = "one_time" | "subscription" | "usage_based";
export type ProductStatus = "active" | "archived";

export interface LocalProduct {
  id: string;
  dodoProductId: string;
  name: string;
  description: string | null;
  image: string | null;
  type: ProductType;
  status: ProductStatus;
  price: number;
  currency: string;
  discount: number;
  taxInclusive: boolean;
  paymentFrequencyCount: number | null;
  paymentFrequencyInterval: string | null;
  subscriptionPeriodCount: number | null;
  subscriptionPeriodInterval: string | null;
  trialPeriodDays: number;
  fixedPrice: number | null;
  licenseKeyEnabled: boolean;
  licenseKeyActivationsLimit: number | null;
  metadata: string | null;
  createdAt: Date;
  updatedAt: Date;
  dodoCreatedAt: Date | null;
  dodoUpdatedAt: Date | null;
  lastSyncedAt: Date | null;
}

/**
 * Determine product type from DodoPayments price object
 */
function getProductType(
  priceDetail: DodoProduct["price"] | null | undefined,
): ProductType {
  if (!priceDetail) return "one_time";

  switch (priceDetail.type) {
    case "recurring_price":
      return "subscription";
    case "usage_based_price":
      return "usage_based";
    case "one_time_price":
    default:
      return "one_time";
  }
}

/**
 * Extract price value from DodoPayments price object
 */
function extractPriceValue(
  priceDetail: DodoProduct["price"] | null | undefined,
): number {
  if (!priceDetail) return 0;

  if (priceDetail.type === "usage_based_price") {
    return priceDetail.fixed_price || 0;
  }

  return priceDetail.price || 0;
}

/**
 * Convert DodoPayments product to local product format
 */
function dodoProductToLocal(
  dodoProduct: DodoProduct | ProductListResponse,
): Omit<typeof product.$inferInsert, "id"> {
  const priceDetail =
    "price" in dodoProduct && typeof dodoProduct.price === "object"
      ? (dodoProduct.price as DodoProduct["price"])
      : "price_detail" in dodoProduct
        ? dodoProduct.price_detail
        : null;

  const productType = getProductType(priceDetail);
  const price = extractPriceValue(priceDetail);

  let paymentFrequencyCount: number | null = null;
  let paymentFrequencyInterval: string | null = null;
  let subscriptionPeriodCount: number | null = null;
  let subscriptionPeriodInterval: string | null = null;
  let trialPeriodDays = 0;
  let fixedPrice: number | null = null;
  let discount = 0;
  let taxInclusive = false;
  let currency = "USD";

  if (priceDetail) {
    currency = priceDetail.currency || "USD";
    discount = priceDetail.discount || 0;
    taxInclusive = priceDetail.tax_inclusive || false;

    if (priceDetail.type === "recurring_price") {
      paymentFrequencyCount = priceDetail.payment_frequency_count;
      paymentFrequencyInterval = priceDetail.payment_frequency_interval;
      subscriptionPeriodCount = priceDetail.subscription_period_count;
      subscriptionPeriodInterval = priceDetail.subscription_period_interval;
      trialPeriodDays = priceDetail.trial_period_days || 0;
    } else if (priceDetail.type === "usage_based_price") {
      fixedPrice = priceDetail.fixed_price;
      paymentFrequencyCount = priceDetail.payment_frequency_count;
      paymentFrequencyInterval = priceDetail.payment_frequency_interval;
      subscriptionPeriodCount = priceDetail.subscription_period_count;
      subscriptionPeriodInterval = priceDetail.subscription_period_interval;
    }
  }

  return {
    dodoProductId: dodoProduct.product_id,
    name: dodoProduct.name || "Untitled Product",
    description: dodoProduct.description || null,
    image: dodoProduct.image || null,
    type: productType,
    status: "active",
    price,
    currency: currency as typeof product.$inferInsert.currency,
    discount,
    taxInclusive,
    paymentFrequencyCount,
    paymentFrequencyInterval,
    subscriptionPeriodCount,
    subscriptionPeriodInterval,
    trialPeriodDays,
    fixedPrice,
    licenseKeyEnabled:
      "license_key_enabled" in dodoProduct
        ? dodoProduct.license_key_enabled
        : false,
    licenseKeyActivationsLimit:
      "license_key_activations_limit" in dodoProduct
        ? dodoProduct.license_key_activations_limit || null
        : null,
    metadata: dodoProduct.metadata
      ? JSON.stringify(dodoProduct.metadata)
      : null,
    dodoCreatedAt: new Date(dodoProduct.created_at),
    dodoUpdatedAt: new Date(dodoProduct.updated_at),
    lastSyncedAt: new Date(),
  };
}

/**
 * Fetch all products from local database
 */
export async function getProducts(): Promise<LocalProduct[]> {
  try {
    const products = await db.select().from(product).orderBy(product.createdAt);
    return products as LocalProduct[];
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
}

/**
 * Fetch a single product by ID
 */
export async function getProduct(id: string): Promise<LocalProduct | null> {
  try {
    const [result] = await db.select().from(product).where(eq(product.id, id));
    return (result as LocalProduct) || null;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw new Error("Failed to fetch product");
  }
}

/**
 * Sync all products from DodoPayments to local database
 */
export async function syncProductsFromDodo(): Promise<{
  synced: number;
  created: number;
  updated: number;
}> {
  try {
    let synced = 0;
    let created = 0;
    let updated = 0;

    // Fetch all products from DodoPayments (including archived)
    const activeProducts = await dodoPayments.products.list({
      archived: false,
    });
    const archivedProducts = await dodoPayments.products.list({
      archived: true,
    });

    // Process active products
    for await (const dodoProduct of activeProducts) {
      const localData = dodoProductToLocal(dodoProduct);
      localData.status = "active";

      // Check if product exists locally
      const [existing] = await db
        .select()
        .from(product)
        .where(eq(product.dodoProductId, dodoProduct.product_id));

      if (existing) {
        // Update existing product
        await db
          .update(product)
          .set({
            ...localData,
            updatedAt: new Date(),
          })
          .where(eq(product.dodoProductId, dodoProduct.product_id));
        updated++;
      } else {
        // Create new product
        await db.insert(product).values({
          id: nanoid(),
          ...localData,
        });
        created++;
      }
      synced++;
    }

    // Process archived products
    for await (const dodoProduct of archivedProducts) {
      const localData = dodoProductToLocal(dodoProduct);
      localData.status = "archived";

      const [existing] = await db
        .select()
        .from(product)
        .where(eq(product.dodoProductId, dodoProduct.product_id));

      if (existing) {
        await db
          .update(product)
          .set({
            ...localData,
            updatedAt: new Date(),
          })
          .where(eq(product.dodoProductId, dodoProduct.product_id));
        updated++;
      } else {
        await db.insert(product).values({
          id: nanoid(),
          ...localData,
        });
        created++;
      }
      synced++;
    }

    return { synced, created, updated };
  } catch (error) {
    console.error("Error syncing products from DodoPayments:", error);
    throw new Error("Failed to sync products");
  }
}

// Helper to convert lowercase interval to TimeInterval
function toTimeInterval(interval: string): TimeInterval {
  const map: Record<string, TimeInterval> = {
    day: "Day",
    week: "Week",
    month: "Month",
    year: "Year",
  };
  return map[interval] || "Month";
}

/**
 * Create a new product in DodoPayments and sync to local database
 */
export async function createProduct(data: {
  name: string;
  description?: string;
  price: number;
  currency?: string;
  type: ProductType;
  // Subscription fields
  paymentFrequencyCount?: number;
  paymentFrequencyInterval?: "day" | "week" | "month" | "year";
  subscriptionPeriodCount?: number;
  subscriptionPeriodInterval?: "day" | "week" | "month" | "year";
  trialPeriodDays?: number;
}): Promise<LocalProduct> {
  try {
    // Build price object based on type
    let priceConfig: DodoProduct["price"];

    if (data.type === "subscription") {
      priceConfig = {
        type: "recurring_price",
        currency: (data.currency || "USD") as "USD",
        price: data.price,
        discount: 0,
        purchasing_power_parity: false,
        payment_frequency_count: data.paymentFrequencyCount || 1,
        payment_frequency_interval: toTimeInterval(
          data.paymentFrequencyInterval || "month",
        ),
        subscription_period_count: data.subscriptionPeriodCount || 1,
        subscription_period_interval: toTimeInterval(
          data.subscriptionPeriodInterval || "month",
        ),
        trial_period_days: data.trialPeriodDays || 0,
      };
    } else if (data.type === "usage_based") {
      priceConfig = {
        type: "usage_based_price",
        currency: (data.currency || "USD") as "USD",
        fixed_price: data.price,
        discount: 0,
        purchasing_power_parity: false,
        payment_frequency_count: data.paymentFrequencyCount || 1,
        payment_frequency_interval: toTimeInterval(
          data.paymentFrequencyInterval || "month",
        ),
        subscription_period_count: data.subscriptionPeriodCount || 1,
        subscription_period_interval: toTimeInterval(
          data.subscriptionPeriodInterval || "month",
        ),
      };
    } else {
      priceConfig = {
        type: "one_time_price",
        currency: (data.currency || "USD") as "USD",
        price: data.price,
        discount: 0,
        purchasing_power_parity: false,
      };
    }

    // Create product in DodoPayments
    const dodoProduct = await dodoPayments.products.create({
      name: data.name,
      description: data.description,
      price: priceConfig,
      tax_category: "digital_products",
    });

    // Create in local database
    const localData = dodoProductToLocal(dodoProduct);
    const newProductId = nanoid();

    await db.insert(product).values({
      id: newProductId,
      ...localData,
    });

    // Fetch and return the created product
    const [created] = await db
      .select()
      .from(product)
      .where(eq(product.id, newProductId));
    return created as LocalProduct;
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Failed to create product");
  }
}

/**
 * Update a product in DodoPayments and sync to local database
 */
export async function updateProduct(
  id: string,
  data: {
    name?: string;
    description?: string;
    price?: number;
  },
): Promise<LocalProduct> {
  try {
    // Get existing product
    const [existing] = await db
      .select()
      .from(product)
      .where(eq(product.id, id));
    if (!existing) {
      throw new Error("Product not found");
    }

    // Update in DodoPayments
    await dodoPayments.products.update(existing.dodoProductId, {
      name: data.name,
      description: data.description,
    });

    // Update locally
    await db
      .update(product)
      .set({
        name: data.name || existing.name,
        description:
          data.description !== undefined
            ? data.description
            : existing.description,
        updatedAt: new Date(),
        lastSyncedAt: new Date(),
      })
      .where(eq(product.id, id));

    const [updated] = await db.select().from(product).where(eq(product.id, id));
    return updated as LocalProduct;
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Failed to update product");
  }
}

/**
 * Archive a product in DodoPayments and update local database
 */
export async function archiveProduct(id: string): Promise<void> {
  try {
    const [existing] = await db
      .select()
      .from(product)
      .where(eq(product.id, id));
    if (!existing) {
      throw new Error("Product not found");
    }

    // Archive in DodoPayments
    await dodoPayments.products.archive(existing.dodoProductId);

    // Update locally
    await db
      .update(product)
      .set({
        status: "archived",
        updatedAt: new Date(),
        lastSyncedAt: new Date(),
      })
      .where(eq(product.id, id));
  } catch (error) {
    console.error("Error archiving product:", error);
    throw new Error("Failed to archive product");
  }
}

/**
 * Unarchive a product in DodoPayments and update local database
 */
export async function unarchiveProduct(id: string): Promise<void> {
  try {
    const [existing] = await db
      .select()
      .from(product)
      .where(eq(product.id, id));
    if (!existing) {
      throw new Error("Product not found");
    }

    // Unarchive in DodoPayments
    await dodoPayments.products.unarchive(existing.dodoProductId);

    // Update locally
    await db
      .update(product)
      .set({
        status: "active",
        updatedAt: new Date(),
        lastSyncedAt: new Date(),
      })
      .where(eq(product.id, id));
  } catch (error) {
    console.error("Error unarchiving product:", error);
    throw new Error("Failed to unarchive product");
  }
}
