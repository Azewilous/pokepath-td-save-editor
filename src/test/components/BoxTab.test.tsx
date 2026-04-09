import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@solidjs/testing-library";
import { createStore } from "solid-js/store";
import { BoxTab } from "~/components/tabs/BoxTab";
import { mockSaveData } from "~/test/fixtures";
import type { SaveData } from "~/types/save";

const renderTab = (set = vi.fn()) => {
  const [store] = createStore({ data: mockSaveData });
  render(() => <BoxTab store={store as { data: SaveData }} set={set} active={true} />);
};

describe("BoxTab", () => {
  it("renders each box Pokémon species name", () => {
    renderTab();
    expect(screen.getByText("BULBASAUR")).toBeInTheDocument();
  });

  it("renders the box count in the group label", () => {
    renderTab();
    expect(screen.getByText(/1 pokémon/i)).toBeInTheDocument();
  });

  it("renders a level input for each Pokémon", () => {
    renderTab();
    expect(screen.getByDisplayValue("25")).toBeInTheDocument();
  });

  it("calls set when a level input changes", () => {
    const set = vi.fn();
    renderTab(set);
    const lvlInput = screen.getByDisplayValue("25");
    fireEvent.input(lvlInput, { target: { value: "50" } });
    expect(set).toHaveBeenCalledOnce();
  });

  it("renders Shiny and Mega toggles for each Pokémon", () => {
    renderTab();
    expect(screen.getByText("Shiny")).toBeInTheDocument();
    expect(screen.getByText("Mega")).toBeInTheDocument();
  });
});
