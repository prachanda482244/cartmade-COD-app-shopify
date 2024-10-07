import axios from "axios";

interface Product {
  id: string;
  title: string;
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
  apiVersion: string;
}

export const getProductById = async ({
  productId,
  accessToken,
  shop,
  apiVersion,
}: ProductProp): Promise<Product | null> => {
  const SHOPIFY_API_URL = `https://${shop}/admin/api/${apiVersion}/graphql.json`;

  const query = `
  query {
      product(id: "gid://shopify/Product/${productId}") {
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
      SHOPIFY_API_URL,
      { query },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": accessToken,
        },
      },
    );

    if (data.data && data.data.product) {
      const product: Product = {
        id: data.data.product.id,
        title: data.data.product.title,
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
