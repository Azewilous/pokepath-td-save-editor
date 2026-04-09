import { describe, it, expect } from "vitest";
import { render, screen } from "@solidjs/testing-library";
import { Toast } from "~/components/shared/Toast";

describe("Toast", () => {
  it("renders nothing when message is null", () => {
    render(() => <Toast message={null} />);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("renders the message when provided", () => {
    render(() => <Toast message="Something went wrong" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Something went wrong");
  });
});
