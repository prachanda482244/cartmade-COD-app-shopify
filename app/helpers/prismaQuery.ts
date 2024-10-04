import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAccessToken = async (shop: string): Promise<string | null> => {
  try {
    const shopData = await prisma.session.findFirst({
      where: {
        shop: shop,
      },
    });

    if (shopData) {
      return shopData.accessToken;
    } else {
      console.error(`No access token found for shop: ${shop}`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching access token:", error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
};
