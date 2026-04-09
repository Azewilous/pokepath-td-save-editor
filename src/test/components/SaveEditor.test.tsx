import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@solidjs/testing-library";
import { createStore } from "solid-js/store";
import { SaveEditor } from "~/components/editor/SaveEditor";
import { mockSaveData } from "~/test/fixtures";
import type { SaveData } from "~/types/save";

const renderEditor = (onExport = vi.fn()) => {
  const [store] = createStore({ data: mockSaveData });
  return render(() => (
    <SaveEditor store={store as { data: SaveData }} set={vi.fn()} onExport={onExport} />
  ));
};

describe("SaveEditor", () => {
  it("displays team and box counts in the toolbar", () => {
    renderEditor();
    const status = document.querySelector(".editor-status")!;
    expect(status).toHaveTextContent(`${mockSaveData.team.length} team`);
    expect(status).toHaveTextContent(`${mockSaveData.box.length} box`);
  });

  it("renders all tab buttons", () => {
    renderEditor();
    for (const tab of ["Player", "Inventory", "Team", "Box", "Achievements", "Stats"]) {
      expect(screen.getByRole("button", { name: tab })).toBeInTheDocument();
    }
  });

  it("switches active tab when a tab button is clicked", () => {
    renderEditor();
    const statsBtn = screen.getByRole("button", { name: "Stats" });
    fireEvent.click(statsBtn);
    expect(statsBtn).toHaveClass("active");
  });

  it("calls onExport when Export Save is clicked", () => {
    const onExport = vi.fn();
    renderEditor(onExport);
    fireEvent.click(screen.getByRole("button", { name: /export save/i }));
    expect(onExport).toHaveBeenCalledOnce();
  });
});
