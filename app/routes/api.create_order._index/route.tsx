import { cors } from "remix-utils/cors";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { authenticate } from "app/shopify.server";
import { getProductById } from "app/helpers/graphiQL";
import { getAccessToken } from "app/helpers/prismaQuery";

interface FormData {
  productId: string;
  variantId?: string;
  firstname: string;
  lastname: string;
  shop: string;
  email: string;
  address1: string;
  address2: string;
  province: string;
  city: string;
  zipcode: string;
}
export async function action({ request }: ActionFunctionArgs) {
  const accessToken = await getAccessToken("prachanda-test.myshopify.com");
  if (!accessToken) return;
  if (request.method === "POST") {
    const contentType = request.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      const formData: FormData = await request.json();
      const productId = formData.productId;
      const variantId = formData?.variantId;
      const shopData = formData.shop;
      const shop = shopData + ".my-shopify.com";

      console.log(formData, "Formdata");
      //   console.log(accessToken, "Accesstoken");
      const products = await getProductById({ productId, shop, accessToken });
      console.log(products);

      //   Creating a order
      //   const response = await admin.graphql(
      //     `#graphql
      //     mutation OrderCreate($order: OrderCreateOrderInput!, $options: OrderCreateOptionsInput) {
      //       orderCreate(order: $order, options: $options) {
      //         userErrors {
      //           field
      //           message
      //         }
      //         order {
      //           id
      //           totalTaxSet {
      //             shopMoney {
      //               amount
      //               currencyCode
      //             }
      //           }
      //           lineItems(first: 5) {
      //             nodes {
      //               variant {
      //                 id
      //               }
      //               id
      //               title
      //               quantity
      //               taxLines {
      //                 title
      //                 rate
      //                 priceSet {
      //                   shopMoney {
      //                     amount
      //                     currencyCode
      //                   }
      //                 }
      //               }
      //             }
      //           }
      //         }
      //       }
      //     }`,
      //     {
      //       variables: {
      //         order: {
      //           currency: "EUR",
      //           lineItems: [
      //             {
      //               title: "Big Brown Bear Boots",
      //               priceSet: {
      //                 shopMoney: {
      //                   amount: 74.99,
      //                   currencyCode: "EUR",
      //                 },
      //               },
      //               quantity: 3,
      //               taxLines: [
      //                 {
      //                   priceSet: {
      //                     shopMoney: {
      //                       amount: 10.2,
      //                       currencyCode: "EUR",
      //                     },
      //                   },
      //                   rate: 0.06,
      //                   title: "State tax",
      //                 },
      //               ],
      //             },
      //           ],
      //           transactions: [
      //             {
      //               kind: "SALE",
      //               status: "SUCCESS",
      //               amountSet: {
      //                 shopMoney: {
      //                   amount: 238.47,
      //                   currencyCode: "EUR",
      //                 },
      //               },
      //             },
      //           ],
      //         },
      //       },
      //     },
      //   );

      const response = json({
        statusCode: 200,
        data: "",
        message: "Order created successfully",
      });
      return await cors(request, response);
    } else {
      return new Response("Unsupported Content-Type", { status: 415 });
    }
  }
  if (request.method === "PUT") {
    return json({ status: 200, method: "PUT" });
  } else {
    return new Response("Method Not allowed", { status: 401 });
  }
}
