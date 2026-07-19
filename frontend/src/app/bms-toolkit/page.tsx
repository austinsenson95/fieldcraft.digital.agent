import type { Metadata } from "next";
import BmsToolkitContent from "./BmsToolkitContent";

export const metadata: Metadata = {
  title: "BMS Diagnostic Toolkit — Free Download — Fieldcraft Digital",
  description:
    "Two free BMS firmware diagnostic guides for the NXP S32K144 and STM32L476. Flash, RAM, RTOS profiling, UDS DTCs, EOL tests, and MISRA-C checklists.",
  openGraph: {
    title: "BMS Diagnostic Toolkit — Free Download — Fieldcraft Digital",
    description:
      "Two free BMS firmware diagnostic guides for the NXP S32K144 and STM32L476.",
    url: "https://fieldcraft.digital/bms-toolkit",
    siteName: "Fieldcraft Digital",
    locale: "en_US",
    type: "website",
    images: ["/og/og-default.svg"],
  },
};

export default function BmsToolkitPage() {
  return <BmsToolkitContent />;
}
