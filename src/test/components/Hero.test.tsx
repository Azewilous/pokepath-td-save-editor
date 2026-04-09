import { describe, it, expect } from "vitest";
import { render, screen } from "@solidjs/testing-library";
import { Hero } from "~/components/layout/Hero";

describe("Hero", () => {
  it("renders the editor title", () => {
    render(() => <Hero />);
    expect(screen.getByText(/save editor/i)).toBeInTheDocument();
  });

  it("renders the subtitle", () => {
    render(() => <Hero />);
    expect(screen.getByText(/decrypt/i)).toBeInTheDocument();
  });

  it("renders the pokeball element", () => {
    render(() => <Hero />);
    expect(document.querySelector(".pokeball-hero")).toBeInTheDocument();
  });
});
