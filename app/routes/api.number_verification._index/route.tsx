import { ActionFunctionArgs, json } from "@remix-run/node";
import { ActionFunction } from "@remix-run/node";
import https from "https";
import { cors } from "remix-utils/cors";

interface RequestBody {
  contactNo: string;
}

// Utility function to handle HTTPS requests
const sendRequest = (options: https.RequestOptions, postData: string) => {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        resolve(JSON.parse(data));
      });

      res.on("error", (error) => {
        reject(error);
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
};

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  try {
    const { contactNo }: RequestBody = await request.json();

    if (!contactNo) {
      return await cors(
        request,
        json({ message: "Phone number is required" }, { status: 400 }),
        {
          origin: "*",
          methods: ["POST"],
          allowedHeaders: ["Content-Type", "Authorization"],
        },
      );
    }

    const token =
      "c6c50425061ae26e55dc875614035679-fd8353a7-58d2-494a-a039-1d32cf8c9dcc";

    // Step 1: Create application options
    const createAppOptions: https.RequestOptions = {
      method: "POST",
      hostname: "m33n99.api.infobip.com",
      path: "/2fa/2/applications",
      headers: {
        Authorization: `App ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    const createAppData = JSON.stringify({
      name: "CartMade COD Verification",
      enabled: true,
      configuration: {
        pinAttempts: 5,
        allowMultiplePinVerifications: true,
        pinTimeToLive: "10m",
        verifyPinLimit: "2/4s",
        sendPinPerApplicationLimit: "5000/12h",
        sendPinPerPhoneNumberLimit: "2/1d",
      },
      phoneNumber: `+977${contactNo}`,
    });

    const appResponse: any = await sendRequest(createAppOptions, createAppData);
    const applicationId = appResponse?.applicationId;

    if (!applicationId) {
      return json({ message: "Failed to create application" }, { status: 500 });
    }

    // Step 2: Send verification message options
    const sendMessageOptions: https.RequestOptions = {
      method: "POST",
      hostname: "api.infobip.com",
      path: `/2fa/2/applications/${applicationId}/messages`,
      headers: {
        Authorization: `App ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    const sendMessageData = JSON.stringify({
      pinType: "NUMERIC",
      messageText: "Your pin is {{pin}}",
      pinLength: 4,
      senderId: "ServiceSMS",
    });

    const sendMessageResponse: any = await sendRequest(
      sendMessageOptions,
      sendMessageData,
    );
    const messageId = sendMessageResponse?.messageId;

    if (!messageId) {
      return json(
        { message: "Failed to send verification message" },
        { status: 500 },
      );
    }

    // Step 3: Request passcode options
    const passCodeOptions: https.RequestOptions = {
      method: "POST",
      hostname: "api.infobip.com",
      path: "/2fa/2/pin",
      headers: {
        Authorization: `App ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    const passCodeData = JSON.stringify({
      applicationId: applicationId,
      messageId: messageId,
      from: "447491163443",
      to: `977${contactNo}`,
    });

    const mainResponse: any = await sendRequest(passCodeOptions, passCodeData);

    return await cors(
      request,
      json({ statusCode: 200, message: "Success", data: mainResponse }),
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
