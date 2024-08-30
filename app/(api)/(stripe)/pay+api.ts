import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { paymment_method_id, payment_intent_id, customer_id } = body;

    if (!paymment_method_id || !payment_intent_id || !customer_id) {
      return new Response(
        JSON.stringify({ error: "Missing required payment information" }),
        {
          status: 400,
        },
      );
    }

    const paymentMethod = await stripe.paymentMethods.attach(
      paymment_method_id,
      {
        customer: customer_id,
      },
    );

    const result = await stripe.paymentIntents.confirm(payment_intent_id, {
      payment_method: paymentMethod.id,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Payment confirmed successfully",
        result: result,
      }),
    );
  } catch (e) {
    console.log(e);
    return new Response(
      JSON.stringify({
        error: e,
        status: 500,
      }),
    );
  }
}
