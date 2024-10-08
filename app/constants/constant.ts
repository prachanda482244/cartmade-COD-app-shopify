import { IconSource } from "@shopify/polaris";
import {
  XIcon,
  ClipboardIcon,
  CollectionIcon,
  CreditCardIcon,
  DeliveryIcon,
  ArrowRightIcon,
  CartIcon,
} from "@shopify/polaris-icons";
import { IconItems } from "./types";

export const iconItems: IconItems[] = [
  {
    label: "x",
    icon: XIcon,
    name: "XIcon",
  },
  {
    label: "clipboard",
    icon: ClipboardIcon,
    name: "ClipboardIcon",
  },
  {
    label: "collection",
    icon: CollectionIcon,
    name: "CollectionIcon",
  },
  {
    label: "bag",
    icon: DeliveryIcon,
    name: "DeliveryIcon",
  },
  {
    label: "card",
    icon: CreditCardIcon,
    name: "CreditCardIcon",
  },
  {
    label: "right",
    icon: ArrowRightIcon,
    name: "ArrowRightIcon",
  },
  {
    label: "cart",
    icon: CartIcon,
    name: "CartIcon",
  },
];
