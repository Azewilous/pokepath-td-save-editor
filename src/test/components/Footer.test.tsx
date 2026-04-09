import { describe, it, expect } from "vitest";
import { render, screen } from "@solidjs/testing-library";
import { Footer } from "~/components/layout/Footer";

describe("Footer", () => {
  it("renders the support message", () => {
    render(() => <Footer />);
    expect(screen.getByText(/support the original creator/i)).toBeInTheDocument();
  });

  it("renders the pokepath.gg link", () => {
    render(() => <Footer />);
    const link = screen.getByRole("link", { name: /pokepath\.gg/i });
    expect(link).toHaveAttribute("href", "https://pokepath.gg/");
  });

  it("renders the Azewilous GitHub link", () => {
    render(() => <Footer />);
    const link = screen.getByRole("link", { name: /azewilous/i });
    expect(link).toHaveAttribute("href", "https://github.com/Azewilous");
  });
});
