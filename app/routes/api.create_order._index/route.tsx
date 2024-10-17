import { cors } from "remix-utils/cors";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { getAccessToken } from "app/helpers/prismaQuery";
import axios from "axios";

interface FormData {
  productId: string;
  variantId?: string;
  quantity: number;
  firstName: string;
  lastName: string;
  shop: string;
  email: string;
  address1: string;
  address2: string;
  province: string;
  city: string;
  zipcode: string;
}

export async function action({ request }: ActionFunctionArgs) {
  if (request.method === "POST") {
    const contentType = request.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      const formData: FormData = await request.json();
      const productId = formData.productId;
      const variantId = formData?.variantId;
      const shop = formData.shop + ".myshopify.com";
      const quantity = +formData.quantity;

      const accessToken = await getAccessToken(shop);
      if (!accessToken) return;
      const shippingAddress = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        address1: formData.address1,
        address2: formData.address2,
        city: formData.city,
        province: formData.province,
        zip: formData.zipcode,
        country: "United ",
        phone: "1234567890",
      };

      const orderData = {
        order: {
          line_items: [
            {
              variant_id: variantId,
              quantity,
            },
          ],
          customer: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
          },
          shipping_address: shippingAddress,
          billing_address: shippingAddress,
          email: formData.email,
          financial_status: "pending",
          send_receipt: true,
          send_notification_email: true,
        },
      };

      const createOrder = await axios.post(
        `https://${shop}/admin/api/2024-10/orders.json`,
        orderData,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": accessToken,
          },
        },
      );

      if (!createOrder) {
        return new Response("Failed to create order", { status: 400 });
      }

      const response = json({
        statusCode: 200,
        data: createOrder.data,
        message: "Order created successfully",
      });
      return await cors(request, response);
    } else {
      return new Response("Unsupported Content-Type", { status: 415 });
    }
  }
  if (request.method === "PUT") {
    const orderId = 6248464187564;
    // const { data } = await axios.put(
    //   `https://prachanda-test.myshopify.com/admin/api/2024-10/orders/${orderId}/cancel.json`,
    //   {},
    //   {
    //     headers: {
    //       "Content-Type": "application/json",
    //       "X-Shopify-Access-Token": "your_access_token",
    //     },
    //   },
    // );
    // if (!data) {
    //   return new Response("Failed to cancel order", { status: 400 });
    // }
    return json({ status: 200, method: "PUT" });
  } else {
    return new Response("Method Not allowed", { status: 401 });
  }
}
