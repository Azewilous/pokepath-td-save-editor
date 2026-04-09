import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@solidjs/testing-library";
import IndexPage from "~/routes/index";
import { encodeSaveData, mockSaveData } from "~/test/fixtures";

// jsdom doesn't implement URL.createObjectURL
URL.createObjectURL = vi.fn(() => "blob:mock");
URL.revokeObjectURL = vi.fn();

describe("IndexPage", () => {
  it("renders the navbar, hero, and footer", () => {
    render(() => <IndexPage />);
    expect(screen.getByText(/Pokepath TD Editor/i)).toBeInTheDocument(); // navbar
    expect(screen.getByText(/Access · Decrypt/i)).toBeInTheDocument();   // hero subtitle
    expect(screen.getByText(/support the original creator/i)).toBeInTheDocument(); // footer
  });

  it("does not render SaveEditor before a save is parsed", () => {
    render(() => <IndexPage />);
    expect(document.querySelector(".save-editor")).not.toBeInTheDocument();
  });

  it("renders SaveEditor after valid base64 is parsed", () => {
    render(() => <IndexPage />);
    const b64 = encodeSaveData(mockSaveData);
    fireEvent.input(screen.getByPlaceholderText(/paste base64/i), {
      target: { value: b64 },
    });
    fireEvent.click(screen.getByRole("button", { name: /parse data/i }));
    expect(document.querySelector(".save-editor")).toBeInTheDocument();
  });

  it("triggers a download when Export Save is clicked after parsing", () => {
    render(() => <IndexPage />);
    const b64 = encodeSaveData(mockSaveData);
    fireEvent.input(screen.getByPlaceholderText(/paste base64/i), {
      target: { value: b64 },
    });
    fireEvent.click(screen.getByRole("button", { name: /parse data/i }));
    fireEvent.click(screen.getByRole("button", { name: /export save/i }));
    expect(URL.createObjectURL).toHaveBeenCalled();
  });
});
