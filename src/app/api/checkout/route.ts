// api/checkout/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

const isStripeEnabled = process.env.NEXT_PUBLIC_ENABLE_STRIPE === "true";

let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16" as Stripe.LatestApiVersion,
  });
}

// Create checkout session (POST)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, scheduled, name, email } = body;

    if (!amount || amount <= 0) {
      throw new Error("Invalid amount");
    }

    // Direct Cash on Delivery / Counter Order (when Stripe is disabled)
    if (!isStripeEnabled || !stripe) {
      const customerEmail = email || "customer@bluemoonrestaurants.com";
      const customerName = name || "Valued Customer";
      const baseUrl = (process.env.NEXT_PUBLIC_DOMAIN || "https://bluemoonrestaurants.com").replace(/\/+$/, "");
      let directUrl = `${baseUrl}/success?session_id=cod_${Date.now()}&email=${encodeURIComponent(customerEmail)}&name=${encodeURIComponent(customerName)}`;
      if (scheduled) {
        directUrl += "&scheduled=true";
      }
      return NextResponse.json({ url: directUrl, disabled: true });
    }

    // Stripe Flow (Active when NEXT_PUBLIC_ENABLE_STRIPE=true)
    const baseUrl = (process.env.NEXT_PUBLIC_DOMAIN || "https://bluemoonrestaurants.com").replace(/\/+$/, "");
    let successUrl = `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`;
    if (scheduled) {
      successUrl += "&scheduled=true";
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "aud", // Australian Dollars
            product_data: { name: "Restaurant Bill" },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: `${baseUrl}/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("❌ Checkout Error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// Fetch session details by session_id (GET)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const session_id = searchParams.get("session_id");

  if (!session_id) {
    return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
  }

  // Handle direct / Cash on Delivery / Pay at Counter sessions
  if (session_id.startsWith("cod_") || !isStripeEnabled || !stripe) {
    const email = searchParams.get("email") || "customer@bluemoonrestaurants.com";
    const name = searchParams.get("name") || "Valued Customer";
    return NextResponse.json({
      email,
      name,
      payment_method: "Cash on Delivery / Pay at Restaurant",
    });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    return NextResponse.json({
      email: session.customer_details?.email || "",
      name: session.customer_details?.name || "",
      payment_method: "Credit Card (Stripe)",
    });
  } catch (error) {
    console.error("❌ Error fetching session details:", error);
    return NextResponse.json({ error: "Failed to fetch session details" }, { status: 500 });
  }
}
