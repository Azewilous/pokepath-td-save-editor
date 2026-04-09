import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@solidjs/testing-library";
import { createStore } from "solid-js/store";
import { InventoryTab } from "~/components/tabs/InventoryTab";
import { mockSaveData } from "~/test/fixtures";
import type { SaveData } from "~/types/save";

const TOTAL = 96;

const renderTab = (set = vi.fn()) => {
  const [store] = createStore({ data: mockSaveData });
  render(() => <InventoryTab store={store as { data: SaveData }} set={set} active={true} />);
};

describe("InventoryTab", () => {
  it("renders exactly 96 slots (filled + empty)", () => {
    renderTab();
    const filled = document.querySelectorAll(".inv-slot.filled");
    const empty = document.querySelectorAll(".inv-slot.empty");
    expect(filled.length + empty.length).toBe(TOTAL);
  });

  it("renders the correct number of filled slots for player items", () => {
    renderTab();
    expect(document.querySelectorAll(".inv-slot.filled").length).toBe(
      mockSaveData.player.items.length
    );
  });

  it("shows item names in filled slots", () => {
    renderTab();
    expect(screen.getByText("Light Clay")).toBeInTheDocument();
    expect(screen.getByText("Choice Band")).toBeInTheDocument();
  });

  it("shows the item count in the group label", () => {
    renderTab();
    expect(
      screen.getByText(String(mockSaveData.player.items.length), { exact: false })
    ).toBeInTheDocument();
  });

  it("calls set when a remove button is clicked", () => {
    const set = vi.fn();
    renderTab(set);
    // Hover to reveal the remove button then click
    const firstFilled = document.querySelector(".inv-slot.filled")!;
    fireEvent.mouseOver(firstFilled);
    const removeBtn = firstFilled.querySelector(".inv-remove") as HTMLButtonElement;
    fireEvent.click(removeBtn);
    expect(set).toHaveBeenCalledOnce();
  });

  it("shows the carrier name when an item is equipped by a team Pokémon", () => {
    renderTab();
    // Light Clay is held by charmander in mockSaveData.team[1]
    expect(screen.getByText("charmander")).toBeInTheDocument();
  });
});
