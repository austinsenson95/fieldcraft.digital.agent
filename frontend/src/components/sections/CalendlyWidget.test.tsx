// @vitest-environment jsdom
import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CalendlyWidget from "./CalendlyWidget";
import linksData from "@/content/links.json";

const CALENDLY_SCRIPT_SRC = "https://assets.calendly.com/assets/external/widget.js";

class IntersectionObserverMock {
  static instances: IntersectionObserverMock[] = [];

  private callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    IntersectionObserverMock.instances.push(this);
  }

  observe() {}
  unobserve() {}
  disconnect() {}

  trigger(isIntersecting = true) {
    this.callback(
      [{ isIntersecting } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver
    );
  }
}

describe("CalendlyWidget", () => {
  beforeEach(() => {
    IntersectionObserverMock.instances = [];
    vi.stubGlobal(
      "IntersectionObserver",
      IntersectionObserverMock as unknown as typeof IntersectionObserver
    );
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    delete process.env.NEXT_PUBLIC_CALENDLY_URL;
    document.querySelectorAll(`script[src="${CALENDLY_SCRIPT_SRC}"]`).forEach((s) => s.remove());
  });

  it("renders the inline widget with the links.json data-url", () => {
    const { container } = render(<CalendlyWidget />);
    const widget = container.querySelector(".calendly-inline-widget");
    expect(widget).toBeInTheDocument();
    expect(widget).toHaveAttribute("data-url", linksData.calendly.url);
  });

  it("shows the placeholder note while the URL is unconfigured", () => {
    render(<CalendlyWidget />);
    expect(
      screen.getByText("Booking calendar activates once the Calendly URL is configured.")
    ).toBeInTheDocument();
  });

  it("uses NEXT_PUBLIC_CALENDLY_URL when set and hides the note", () => {
    process.env.NEXT_PUBLIC_CALENDLY_URL = "https://calendly.com/example/live";
    const { container } = render(<CalendlyWidget />);
    const widget = container.querySelector(".calendly-inline-widget");
    expect(widget).toHaveAttribute("data-url", "https://calendly.com/example/live");
    expect(
      screen.queryByText("Booking calendar activates once the Calendly URL is configured.")
    ).not.toBeInTheDocument();
  });

  it("only injects the Calendly script after scrolling into view", () => {
    process.env.NEXT_PUBLIC_CALENDLY_URL = "https://calendly.com/example/live";
    render(<CalendlyWidget />);

    expect(document.querySelector(`script[src="${CALENDLY_SCRIPT_SRC}"]`)).toBeNull();

    const observer = IntersectionObserverMock.instances[0];
    expect(observer).toBeDefined();
    act(() => observer.trigger(true));

    expect(document.querySelector(`script[src="${CALENDLY_SCRIPT_SRC}"]`)).not.toBeNull();
  });

  it("never injects the script while the URL is still the placeholder", () => {
    render(<CalendlyWidget />);
    act(() => IntersectionObserverMock.instances[0]?.trigger(true));
    expect(document.querySelector(`script[src="${CALENDLY_SCRIPT_SRC}"]`)).toBeNull();
  });
});
