import { useState } from "react";
import {
  Card,
  Layout,
  TextField,
  Checkbox,
  ColorPicker,
  Button,
  FormLayout,
  Popover,
  Page,
  hsbToHex,
  BlockStack,
  RangeSlider,
} from "@shopify/polaris";
import { Form, useActionData } from "@remix-run/react";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { authenticate } from "app/shopify.server";
import { iconItems } from "app/constants/constant";
import { IconItems } from "app/constants/types";

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method === "POST") {
    const { admin, session } = await authenticate.admin(request);
    const metafield = new admin.rest.resources.Metafield({ session });

    const formData = await request.formData();
    const buttonText = formData.get("buttonText");
    const subtitle = formData.get("subtitle");
    const icon = formData.get("icon");
    const sticky = formData.get("sticky") === "on" ? true : false;
    const fontSize = formData.get("fontSize");
    const borderRadius = formData.get("borderRadius");
    const borderWidth = formData.get("borderWidth");
    const shadow = formData.get("shadow");
    const borderColor = formData.get("borderColor");
    const backgroundColor = formData.get("backgroundColor");
    const textColor = formData.get("textColor");

    console.log({
      buttonText,
      subtitle,
      icon,
      sticky,
      fontSize,
      borderRadius,
      borderWidth,
      shadow,
      borderColor,
      backgroundColor,
      textColor,
    });

    return json({ success: true });
  }

  return json({ success: false });
};

const BuyButton = () => {
  const actionData: any = useActionData();
  const [buttonText, setButtonText] = useState("Buy with Cash on Delivery");
  const [subtitle, setSubtitle] = useState("");
  const [icon, setIcon] = useState("");
  const [sticky, setSticky] = useState(false);

  const [fontSize, setFontSize] = useState<number>(15);
  const [borderRadius, setBorderRadius] = useState<number>(4);
  const [borderWidth, setBorderWidth] = useState<number>(0);
  const [shadow, setShadow] = useState<number>(0);
  const [borderColor, setBorderColor] = useState({
    hue: 150,
    saturation: 1,
    brightness: 1,
  });
  const [backgroundColor, setBackgroundColor] = useState({
    hue: 240,
    saturation: 1,
    brightness: 1,
  });
  const [textColor, setTextColor] = useState({
    hue: 0,
    brightness: 1,
    saturation: 0,
  });

  const handleButtonTextChange = (value: string) => setButtonText(value);
  const handleSubtitleChange = (value: string) => setSubtitle(value);
  const handleStickyChange = (value: boolean) => setSticky(value);
  const handleIconChange = (icon: string, value: string) => {
    value === "x" ? setIcon("") : setIcon(icon);
    setLabel(value);
  };

  const [label, setLabel] = useState("");
  const [bgPopoverActive, setBgPopoverActive] = useState(false);
  const [textPopoverActive, setTextPopoverActive] = useState(false);
  const [borderPopoverActive, setBorderPopoverActive] = useState(false);

  const toggleBgPopoverActive = () => setBgPopoverActive((active) => !active);
  const toggleTextPopoverActive = () =>
    setTextPopoverActive((active) => !active);
  const toggleBorderPopoverActive = () =>
    setBorderPopoverActive((active) => !active);

  const bgHexColor = hsbToHex(backgroundColor);
  const textHexColor = hsbToHex(textColor);
  const borderHexColor = hsbToHex(borderColor);

  const handleBgColorChange = (newColor: any) => setBackgroundColor(newColor);
  const handleTextColorChange = (newColor: any) => setTextColor(newColor);
  const handleBorderColorChange = (newColor: any) => setBorderColor(newColor);

  const handleFontSizeChange = (value: number) => setFontSize(value);
  const handleBorderRadiusChange = (value: number) => setBorderRadius(value);
  const handleBorderWidthChange = (value: number) => setBorderWidth(value);
  const handleShadowChange = (value: number) => setShadow(value);

  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack>
              <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>
                Button settings
              </h2>
              <p style={{ fontSize: "14px", color: "#5c5f62" }}>
                Customize the form Buy Now button
              </p>
              <Card>
                <p style={{ fontWeight: "bold" }}>
                  This is the button that your customers will click to open the
                  form on your product pages or the cart page
                </p>
                <p style={{ color: "#5c5f62", fontSize: "14px" }}>
                  Customize here the text and design of your button to fit with
                  your brand style. The button will use the same font of your
                  store when it will be generated on your store.
                </p>
              </Card>
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section variant={"oneHalf"}>
          <Card>
            <Form method="post">
              <FormLayout>
                <TextField
                  autoComplete="true"
                  label="Button text"
                  value={buttonText}
                  onChange={handleButtonTextChange}
                  name="buttonText"
                />
                <TextField
                  autoComplete="true"
                  label="Button subtitle"
                  value={subtitle}
                  onChange={handleSubtitleChange}
                  placeholder="Optional"
                  name="subtitle"
                />

                <div style={{ marginBottom: "10px" }}>
                  <p>Select an icon:</p>
                  <div
                    style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
                  >
                    {iconItems &&
                      iconItems.length &&
                      iconItems?.map(
                        ({ label: labelName, icon, name }: IconItems) => (
                          <Button
                            key={labelName}
                            icon={icon}
                            onClick={() => handleIconChange(icon, labelName)}
                            pressed={labelName === label}
                          />
                        ),
                      )}
                  </div>
                  <input type="hidden" name="icon" value={icon} />
                </div>

                <Checkbox
                  label="Enable sticky button on mobile"
                  checked={sticky}
                  onChange={handleStickyChange}
                  name="sticky"
                />

                <FormLayout.Group>
                  <div>
                    <p>Background color</p>
                    <input
                      type="hidden"
                      name="backgroundColor"
                      value={bgHexColor}
                    />
                    <div className="p-2 border border-black w-14 flex items-center justify-center">
                      <Popover
                        active={bgPopoverActive}
                        activator={
                          <div
                            onClick={toggleBgPopoverActive}
                            className="w-12 h-6 rounded-sm cursor-pointer border-1 border-[#ccc]"
                            style={{
                              backgroundColor: bgHexColor,
                            }}
                          />
                        }
                        onClose={toggleBgPopoverActive}
                        preferredAlignment="center"
                      >
                        <div style={{ padding: "1rem" }}>
                          <ColorPicker
                            onChange={handleBgColorChange}
                            color={backgroundColor}
                            allowAlpha={false}
                          />
                        </div>
                      </Popover>
                    </div>
                  </div>

                  <div>
                    <p>Text color</p>
                    <input
                      type="hidden"
                      name="textColor"
                      value={textHexColor}
                    />
                    <div className="p-2 border border-black w-14 flex items-center justify-center">
                      <Popover
                        active={textPopoverActive}
                        activator={
                          <div
                            onClick={toggleTextPopoverActive}
                            className="w-12 h-6 rounded-sm cursor-pointer border-1 border-[#ccc]"
                            style={{
                              backgroundColor: textHexColor,
                            }}
                          />
                        }
                        onClose={toggleTextPopoverActive}
                        preferredAlignment="center"
                      >
                        <div style={{ padding: "1rem" }}>
                          <ColorPicker
                            onChange={handleTextColorChange}
                            color={textColor}
                            allowAlpha={false}
                          />
                        </div>
                      </Popover>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <RangeSlider
                      label="Font size"
                      value={fontSize}
                      min={15}
                      max={40}
                      output
                      onChange={handleFontSizeChange}
                    />
                    <RangeSlider
                      label="Border radius"
                      value={borderRadius}
                      min={0}
                      max={50}
                      output
                      onChange={handleBorderRadiusChange}
                    />
                    <RangeSlider
                      label="Border width"
                      value={borderWidth}
                      min={0}
                      max={5}
                      output
                      onChange={handleBorderWidthChange}
                    />
                    <RangeSlider
                      label="Shadow"
                      value={shadow}
                      min={0}
                      max={30}
                      output
                      onChange={handleShadowChange}
                    />
                    <div>
                      <p>Border color</p>
                      <input
                        type="hidden"
                        name="borderColor"
                        value={borderHexColor}
                      />
                      <div className="p-2 border border-black w-14 flex items-center justify-center">
                        <Popover
                          active={borderPopoverActive}
                          activator={
                            <div
                              onClick={toggleBorderPopoverActive}
                              className="w-12 h-6 rounded-sm cursor-pointer border-1 border-[#ccc]"
                              style={{
                                backgroundColor: borderHexColor,
                              }}
                            />
                          }
                          onClose={toggleBorderPopoverActive}
                          preferredAlignment="center"
                        >
                          <div style={{ padding: "1rem" }}>
                            <ColorPicker
                              onChange={handleBorderColorChange}
                              color={borderColor}
                              allowAlpha={false}
                            />
                          </div>
                        </Popover>
                      </div>
                    </div>
                  </div>
                </FormLayout.Group>

                <Button submit variant="primary">
                  Save
                </Button>

                {actionData?.success && (
                  <p style={{ color: "green", marginTop: "10px" }}>
                    Form submitted successfully!
                  </p>
                )}
              </FormLayout>
            </Form>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default BuyButton;
