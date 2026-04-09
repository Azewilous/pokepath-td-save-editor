import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@solidjs/testing-library";
import { createStore } from "solid-js/store";
import { StatsTab } from "~/components/tabs/StatsTab";
import { mockSaveData } from "~/test/fixtures";
import type { SaveData } from "~/types/save";

const renderTab = (set = vi.fn()) => {
  const [store] = createStore({ data: mockSaveData });
  render(() => <StatsTab store={store as { data: SaveData }} set={set} active={true} />);
};

describe("StatsTab", () => {
  it("renders stat labels", () => {
    renderTab();
    expect(screen.getByText(/pokémon owned/i)).toBeInTheDocument();
    expect(screen.getByText(/waves completed/i)).toBeInTheDocument();
    expect(screen.getByText(/time played/i)).toBeInTheDocument();
  });

  it("renders stat inputs with correct values from store", () => {
    renderTab();
    // Use values unique in the fixture: wavesCompleted=30, timePlayed=120
    expect(screen.getByDisplayValue("30")).toBeInTheDocument(); // wavesCompleted
    expect(screen.getByDisplayValue("120")).toBeInTheDocument(); // timePlayed
  });

  it("calls set when a stat input changes", () => {
    const set = vi.fn();
    renderTab(set);
    const inputs = screen.getAllByRole("spinbutton");
    fireEvent.input(inputs[0], { target: { value: "10" } });
    expect(set).toHaveBeenCalledOnce();
  });

  it("renders defeated species tags", () => {
    renderTab();
    expect(screen.getByText("pikachu")).toBeInTheDocument();
    expect(screen.getByText("charmander")).toBeInTheDocument();
  });

  it("renders the read-only Best Gold/Wave field", () => {
    renderTab();
    expect(screen.getByText(/best gold\/wave/i)).toBeInTheDocument();
  });
});
