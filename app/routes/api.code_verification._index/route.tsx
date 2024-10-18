import { ActionFunctionArgs, json } from "@remix-run/node";
import { ActionFunction } from "@remix-run/node";
import { sendRequest } from "app/helpers/sendRequest";
import https from "https";
import { cors } from "remix-utils/cors";

interface RequestBody {
  code: string;
  pinId: string;
}

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  try {
    const { code, pinId }: RequestBody = await request.json();

    if (!code) {
      return await cors(
        request,
        json({ message: "Code is required" }, { status: 400 }),
        {
          origin: "*",
          methods: ["POST"],
          allowedHeaders: ["Content-Type", "Authorization"],
        },
      );
    }

    const token =
      "c6c50425061ae26e55dc875614035679-fd8353a7-58d2-494a-a039-1d32cf8c9dcc";

    const codeMessageOptions: https.RequestOptions = {
      method: "POST",
      hostname: "m33n99.api.infobip.com",
      path: `/2fa/2/pin/${pinId}/verify`,
      headers: {
        Authorization: `App ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    const codeMessageData = JSON.stringify({
      pin: code,
    });

    const sendCodeResponse: any = await sendRequest(
      codeMessageOptions,
      codeMessageData,
    );
    console.log(sendCodeResponse, "sendCodeResponse");
    return await cors(
      request,
      json({ statusCode: 200, message: "Success", data: sendCodeResponse }),
      {
        origin: "*",
        methods: ["POST"],
        allowedHeaders: ["Content-Type", "Authorization"],
      },
    );
  } catch (error: any) {
    return await cors(
      request,
      json(
        { message: "An error occurred", error: error.message },
        { status: 500 },
      ),
      {
        origin: "*",
        methods: ["POST"],
        allowedHeaders: ["Content-Type", "Authorization"],
      },
    );
  }
};

export const loader = () => {
  throw new Response("Not Found", { status: 404 });
};
