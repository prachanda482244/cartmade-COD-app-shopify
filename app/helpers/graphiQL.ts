import axios from "axios";

interface Variant {
  id: string;
}

interface Product {
  id: string;
  title: string;
  variants: Variant[];
  priceRangeV2: {
    maxVariantPrice: {
      amount: string;
    };
  };
}
interface ProductProp {
  productId: string;
  accessToken: string;
  shop: string;
}

export const getProductById = async ({
  productId,
  accessToken,
  shop,
}: ProductProp): Promise<Product | null> => {
  const SHOPIFY_API_URL = `https://${shop}/admin/api/2024-10/graphql.json`;
  const query = `
 query {
    product(id: "gid://shopify/Product/7947110187180") {
      id
      title
      priceRangeV2 {
        maxVariantPrice {
          amount
        }
      }
    }
  }`;
  try {
    const { data } = await axios.post(
      `https://${shop}/admin/api/2024-10/graphql.json`,
      query,
      {
        headers: {
          "Content-Type": "application/graphql",
          "X-shopify-access-token": accessToken,
        },
      },
    );

    console.log(data, "data");

    if (data.data && data.data.product) {
      const product: Product = {
        id: data.data.product.id,
        title: data.data.product.title,
        variants: data.data.product.variants.edges.map(
          (edge: any) => edge.node,
        ),
        priceRangeV2: data.data.product.priceRangeV2,
      };
      return product;
    } else {
      // console.error("Product not found or an error occurred:", data);
      return null;
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};
