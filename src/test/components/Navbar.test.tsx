import { describe, it, expect } from "vitest";
import { render, screen } from "@solidjs/testing-library";
import { Navbar } from "~/components/layout/Navbar";
import { SUPPORTED_VERSIONS } from "~/types/versions";

describe("Navbar", () => {
  it("renders the brand name", () => {
    render(() => <Navbar />);
    expect(screen.getByText(/Pokepath TD Editor/i)).toBeInTheDocument();
  });

  it("renders the version dropdown", () => {
    render(() => <Navbar />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("version dropdown contains all supported versions", () => {
    render(() => <Navbar />);
    for (const v of SUPPORTED_VERSIONS) {
      expect(screen.getByRole("option", { name: `v${v}` })).toBeInTheDocument();
    }
  });
});
