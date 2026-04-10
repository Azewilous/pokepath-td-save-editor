import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@solidjs/testing-library";
import IndexPage from "~/routes/index";
import { encodeSaveData, decodeSaveData, mockSaveData } from "~/test/fixtures";
import type { SaveData } from "~/types/save";

URL.createObjectURL = vi.fn(() => "blob:mock");
URL.revokeObjectURL = vi.fn();

/** Intercept the Blob constructor to capture whatever text the app exports */
let lastExportedContent = "";
const OriginalBlob = global.Blob;
global.Blob = class extends OriginalBlob {
  constructor(parts: BlobPart[], options?: BlobPropertyBag) {
    super(parts, options);
    lastExportedContent = parts[0] as string;
  }
} as typeof Blob;

/** Parse a save into the app and return helpers to interact further */
const loadSave = (data: SaveData = mockSaveData) => {
  render(() => <IndexPage />);
  fireEvent.input(screen.getByPlaceholderText(/paste base64/i), {
    target: { value: encodeSaveData(data) },
  });
  fireEvent.click(screen.getByRole("button", { name: /parse data/i }));
};

/** Open the export modal, click Download, and decode the resulting base64 */
const exportAndDecode = (): SaveData => {
  lastExportedContent = "";
  fireEvent.click(screen.getByRole("button", { name: /export save/i }));
  fireEvent.click(screen.getByRole("button", { name: /download/i }));
  return decodeSaveData(lastExportedContent);
};

beforeEach(() => {
  lastExportedContent = "";
  vi.clearAllMocks();
});

// ─── Encode / decode ────────────────────────────────────────────────────────

describe("round-trip integrity", () => {
  it("decodeSaveData(encodeSaveData(data)) is deep-equal to the original", () => {
    expect(decodeSaveData(encodeSaveData(mockSaveData))).toEqual(mockSaveData);
  });

  it("parse → export produces output identical to the original save", () => {
    loadSave();
    const result = exportAndDecode();
    expect(result).toEqual(mockSaveData);
  });
});

// ─── Player mutations ────────────────────────────────────────────────────────

describe("player edits round-trip", () => {
  it("edited player name is preserved in the export", () => {
    loadSave();
    fireEvent.input(screen.getByDisplayValue("TestPlayer"), {
      target: { value: "Azewilous" },
    });
    expect(exportAndDecode().player.name).toBe("Azewilous");
  });

  it("edited gold value is preserved in the export", () => {
    loadSave();
    fireEvent.input(screen.getByDisplayValue("5000"), {
      target: { value: "99999" },
    });
    expect(exportAndDecode().player.gold).toBe(99999);
  });

  it("editing a record updates stars and is preserved in the export", () => {
    loadSave();
    // Records inputs have max="100"; health inputs have max="14"
    const [firstRecordInput] = document.querySelectorAll<HTMLInputElement>('input[max="100"]');
    fireEvent.input(firstRecordInput, { target: { value: "100" } });
    const exported = exportAndDecode();
    // stars = sum of all records: 100 + remaining fixture records
    const expectedStars = [100, ...mockSaveData.player.records.slice(1)].reduce((a, b) => a + b, 0);
    expect(exported.player.stars).toBe(expectedStars);
    expect(exported.player.records[0]).toBe(100);
  });
});

// ─── Achievement tab ─────────────────────────────────────────────────────────

describe("achievements tab", () => {
  it("shows coming soon when achievements tab is active", () => {
    loadSave();
    fireEvent.click(screen.getByRole("button", { name: /achievements/i }));
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument();
  });
});

// ─── Inventory mutations ─────────────────────────────────────────────────────

describe("inventory edits round-trip", () => {
  it("removing an item is reflected in the export", () => {
    loadSave();
    fireEvent.click(screen.getByRole("button", { name: /inventory/i }));
    const before = mockSaveData.player.items.length;
    const removeBtn = document.querySelector(".inv-remove") as HTMLButtonElement;
    fireEvent.click(removeBtn);
    expect(exportAndDecode().player.items.length).toBe(before - 1);
  });
});

// ─── UI shell ────────────────────────────────────────────────────────────────

describe("page shell", () => {
  it("renders navbar, hero, and footer before any save is loaded", () => {
    render(() => <IndexPage />);
    expect(screen.getByText(/Pokepath TD Editor/i)).toBeInTheDocument();
    expect(screen.getByText(/Access · Decrypt/i)).toBeInTheDocument();
    expect(screen.getByText(/support the original creator/i)).toBeInTheDocument();
  });

  it("does not show the editor before a save is parsed", () => {
    render(() => <IndexPage />);
    expect(document.querySelector(".save-editor")).not.toBeInTheDocument();
  });

  it("shows the editor after a valid save is parsed", () => {
    loadSave();
    expect(document.querySelector(".save-editor")).toBeInTheDocument();
  });

  it("shows a toast for invalid base64 input", () => {
    render(() => <IndexPage />);
    fireEvent.input(screen.getByPlaceholderText(/paste base64/i), {
      target: { value: "not-valid-base64!!!" },
    });
    fireEvent.click(screen.getByRole("button", { name: /parse data/i }));
    expect(screen.getByRole("alert")).toHaveTextContent(/parse failed/i);
  });
});

// ─── Export modal ─────────────────────────────────────────────────────────────

describe("export modal", () => {
  it("opens when Export Save is clicked", () => {
    loadSave();
    fireEvent.click(screen.getByRole("button", { name: /export save/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("shows backup and reload warnings", () => {
    loadSave();
    fireEvent.click(screen.getByRole("button", { name: /export save/i }));
    expect(screen.getByText(/backup first/i)).toBeInTheDocument();
    expect(screen.getByText(/game won't load/i)).toBeInTheDocument();
  });

  it("closes when Cancel is clicked", () => {
    loadSave();
    fireEvent.click(screen.getByRole("button", { name: /export save/i }));
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes when backdrop is clicked", () => {
    loadSave();
    fireEvent.click(screen.getByRole("button", { name: /export save/i }));
    fireEvent.click(document.querySelector(".modal-backdrop")!);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("downloads and closes when Download is clicked", () => {
    loadSave();
    fireEvent.click(screen.getByRole("button", { name: /export save/i }));
    fireEvent.click(screen.getByRole("button", { name: /download/i }));
    expect(lastExportedContent).not.toBe("");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
