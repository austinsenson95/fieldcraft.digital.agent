import { describe, expect, it } from "vitest";
import { AnalyticsEvents, trackEvent } from "./analytics";

describe("AnalyticsEvents", () => {
  it("contains the 5 canonical event names", () => {
    expect(Object.values(AnalyticsEvents)).toEqual(
      expect.arrayContaining([
        "brief_page_view",
        "pricing_page_view",
        "playbook_download_click",
        "book_call_click",
        "product_purchase_click",
      ])
    );
  });
});

describe("trackEvent", () => {
  it("no-ops without window (server-side)", () => {
    expect(typeof window).toBe("undefined");
    expect(() => trackEvent(AnalyticsEvents.bookCallClick, { product: "x" })).not.toThrow();
  });
});
