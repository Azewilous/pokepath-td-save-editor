import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@solidjs/testing-library";
import { DataInterface } from "~/components/editor/DataInterface";
import { mockSaveData, encodeSaveData } from "~/test/fixtures";

describe("DataInterface", () => {
  it("renders the textarea and action buttons", () => {
    render(() => <DataInterface onParse={vi.fn()} />);
    expect(screen.getByPlaceholderText(/paste base64/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /parse data/i })).toBeInTheDocument();
    expect(screen.getByText(/load file/i)).toBeInTheDocument();
  });

  it("shows a toast when Parse Data is clicked with empty input", () => {
    render(() => <DataInterface onParse={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /parse data/i }));
    expect(screen.getByRole("alert")).toHaveTextContent(/no save data detected/i);
  });

  it("calls onParse with decoded SaveData for valid base64 input", () => {
    const onParse = vi.fn();
    render(() => <DataInterface onParse={onParse} />);

    const b64 = encodeSaveData(mockSaveData);
    fireEvent.input(screen.getByPlaceholderText(/paste base64/i), {
      target: { value: b64 },
    });
    fireEvent.click(screen.getByRole("button", { name: /parse data/i }));

    expect(onParse).toHaveBeenCalledOnce();
    expect(onParse.mock.calls[0][0].player.name).toBe("TestPlayer");
  });

  it("shows an error toast for invalid base64 input", () => {
    render(() => <DataInterface onParse={vi.fn()} />);
    fireEvent.input(screen.getByPlaceholderText(/paste base64/i), {
      target: { value: "this-is-not-valid-base64!!!" },
    });
    fireEvent.click(screen.getByRole("button", { name: /parse data/i }));
    expect(screen.getByRole("alert")).toHaveTextContent(/parse failed/i);
  });
});
