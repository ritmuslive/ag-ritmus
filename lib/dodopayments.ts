import DodoPayments from "dodopayments";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

// Initialize DodoPayments client
export const dodoPayments = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
  environment:
    (process.env.DODO_PAYMENTS_ENVIRONMENT as "test_mode" | "live_mode") ||
    "test_mode",
});

/**
 * Look up a customer by email in DodoPayments
 * Returns the customer_id if found, null otherwise
 */
export async function findCustomerByEmail(
  email: string,
): Promise<string | null> {
  try {
    // Use the email filter to search for the customer
    const customers = await dodoPayments.customers.list({ email });

    // The list method returns an async iterable, get the first result
    for await (const customer of customers) {
      if (customer.email === email) {
        return customer.customer_id;
      }
    }

    return null;
  } catch (error) {
    console.error("Error finding customer by email:", error);
    return null;
  }
}

/**
 * Create a new customer in DodoPayments
 * Returns the customer_id if successful, null otherwise
 */
export async function createCustomer(
  email: string,
  name: string,
): Promise<string | null> {
  try {
    const customer = await dodoPayments.customers.create({
      email,
      name,
    });

    return customer.customer_id;
  } catch (error) {
    console.error("Error creating customer:", error);
    return null;
  }
}

/**
 * Get or create a customer in DodoPayments
 * First checks if a customer with the email exists, if not creates one
 * Returns the customer_id
 */
export async function getOrCreateCustomer(
  email: string,
  name: string,
): Promise<string | null> {
  // First, try to find an existing customer
  let customerId = await findCustomerByEmail(email);

  // If not found, create a new customer
  if (!customerId) {
    customerId = await createCustomer(email, name);
  }

  return customerId;
}

/**
 * Sync a user's customer ID with DodoPayments
 * This should be called after a user is created or logs in
 */
export async function syncUserWithDodoPayments(
  userId: string,
  email: string,
  name: string,
): Promise<string | null> {
  try {
    // Get or create the customer in DodoPayments
    const customerId = await getOrCreateCustomer(email, name);

    if (customerId) {
      // Update the user in the database with the customer ID
      await db.update(user).set({ customerId }).where(eq(user.id, userId));
      console.log(
        `Synced user ${userId} with DodoPayments customer ${customerId}`,
      );
    }

    return customerId;
  } catch (error) {
    console.error("Error syncing user with DodoPayments:", error);
    return null;
  }
}
