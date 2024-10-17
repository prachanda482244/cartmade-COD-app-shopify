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
  LegacyCard,
  RangeSlider,
} from "@shopify/polaris";
import { iconItems } from "app/constants/constant";
import { IconItems } from "app/constants/types";
import { SaveBar, useAppBridge } from "@shopify/app-bridge-react";

const BuyButton = () => {
  const shopify = useAppBridge();

  const handleSave = () => {
    console.log("Saving");
    shopify.saveBar.hide("my-save-bar");
  };

  const handleDiscard = () => {
    console.log("Discarding");
    shopify.saveBar.hide("my-save-bar");
  };
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
            <FormLayout>
              <TextField
                autoComplete="true"
                label="Button text"
                value={buttonText}
                onChange={handleButtonTextChange}
              />
              <TextField
                autoComplete="true"
                label="Button subtitle"
                value={subtitle}
                onChange={handleSubtitleChange}
                placeholder="Optional"
              />

              <div style={{ marginBottom: "10px" }}>
                <p>Select an icon:</p>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
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
              </div>

              <Checkbox
                label="Enable sticky button on mobile"
                checked={sticky}
                onChange={handleStickyChange}
              />

              <FormLayout.Group>
                <div>
                  <p>Background color</p>
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
                    max={30}
                    onChange={handleFontSizeChange}
                    output
                  />
                  <RangeSlider
                    label="Border radius"
                    value={borderRadius}
                    min={1}
                    max={15}
                    onChange={handleBorderRadiusChange}
                    output
                  />
                  <RangeSlider
                    label="Border width"
                    min={0}
                    max={15}
                    value={borderWidth}
                    onChange={handleBorderWidthChange}
                    output
                  />

                  <div>
                    <p>Border color</p>

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

                  <RangeSlider
                    label="Shadow"
                    min={1}
                    max={7}
                    value={shadow}
                    onChange={handleShadowChange}
                    output
                  />
                </div>
              </FormLayout.Group>
            </FormLayout>
          </Card>
        </Layout.Section>

        <Layout.Section variant="oneHalf">
          <div
            style={{
              marginBottom: "15px",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            Live preview:
          </div>
          <Card>
            <div
              style={{
                borderWidth,
                borderColor: borderHexColor,
                borderRadius,
                background: borderHexColor,
                boxShadow: `0 4 ${shadow}px black)`,
              }}
            >
              <button
                className="overflow-hidden Polaris-Button Polaris-Button--pressable Polaris-Button--variantPrimary Polaris-Button--sizeMedium Polaris-Button--textAlignCenter Polaris-Button--fullWidth Polaris-Button--iconWithText  "
                type="button"
                style={{
                  backgroundColor: bgHexColor,
                  color: textHexColor,
                  fontWeight: 400,
                  borderRadius,
                  borderWidth,
                  borderColor: borderHexColor,
                  boxShadow: `0 4 ${shadow}px black)`,
                }}
              >
                <span className="Polaris-Button__Icon text-black">
                  <span
                    className="Polaris-Icon "
                    // style={{ color: textHexColor }}
                  >
                    {icon}
                  </span>
                </span>
                <span
                  style={{ fontSize }}
                  className="Polaris-Text--root Polaris-Text--bodySm Polaris-Text--medium flex flex-col"
                >
                  {buttonText}
                  {subtitle && <p className="text-center">{subtitle}</p>}
                </span>
              </button>
            </div>
          </Card>

          <div className="flex items-center justify-end ">
            <button className="bg-black py-1 px-3 text-white mt-2 rounded-md font-semibold">
              Save Changes
            </button>
          </div>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default BuyButton;
