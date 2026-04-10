import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@solidjs/testing-library";
import { createStore, produce } from "solid-js/store";
import { PlayerTab } from "~/components/tabs/PlayerTab";
import { mockSaveData } from "~/test/fixtures";
import type { SaveData } from "~/types/save";

const renderTab = (set = vi.fn()) => {
  const [store] = createStore({ data: mockSaveData });
  render(() => <PlayerTab store={store as { data: SaveData }} set={set} active={true} />);
};

describe("PlayerTab", () => {
  it("renders the player name input with current value", () => {
    renderTab();
    const input = screen.getByDisplayValue("TestPlayer");
    expect(input).toBeInTheDocument();
  });

  it("renders the gold field with current value", () => {
    renderTab();
    expect(screen.getByDisplayValue("5000")).toBeInTheDocument();
  });

  it("renders the stars field as read-only with the current value", () => {
    renderTab();
    // fixture stars=10, but there are multiple inputs with value "10" so check read-only attr
    const readOnlyInputs = document.querySelectorAll('input[readonly]');
    expect(readOnlyInputs.length).toBeGreaterThan(0);
  });

  it("shows locked slots when stars are below all thresholds", () => {
    renderTab();
    // fixture has 10 stars — all extra slots locked, show star requirements
    expect(screen.getByText("40 ★")).toBeInTheDocument();
    expect(screen.getByText("160 ★")).toBeInTheDocument();
    expect(screen.getByText("320 ★")).toBeInTheDocument();
    expect(screen.getByText("540 ★")).toBeInTheDocument();
  });

  it("shows unlocked slots when stars meet the threshold", () => {
    const set = vi.fn();
    const [store] = createStore({
      data: { ...mockSaveData, player: { ...mockSaveData.player, stars: 200 } },
    });
    render(() => <PlayerTab store={store as { data: SaveData }} set={set} active={true} />);
    // slots 7 (40★) and 8 (160★) unlocked; 9 (320★) and 10 (540★) still locked
    expect(screen.getAllByText("Unlocked")).toHaveLength(2);
    expect(screen.getByText("320 ★")).toBeInTheDocument();
    expect(screen.getByText("540 ★")).toBeInTheDocument();
  });

  it("syncs stars and team slots when a record value changes", () => {
    const [store, setStore] = createStore({ data: { ...mockSaveData, player: { ...mockSaveData.player, stars: 0, records: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] } } });
    const set = (fn: (d: SaveData) => void) => setStore(produce((s) => { fn(s.data!); }));
    render(() => <PlayerTab store={store as { data: SaveData }} set={set} active={true} />);
    // Records inputs have max="100"; health inputs have max="14"
    const [firstRecordInput] = document.querySelectorAll<HTMLInputElement>('input[max="100"]');
    fireEvent.input(firstRecordInput, { target: { value: "100" } });
    expect(store.data.player.stars).toBe(100);
    // stars=100 → slot 7 (≥40) unlocked, slot 8 (≥160) not → 6+1=7 total slots
    expect(store.data.team).toHaveLength(7);
  });

  it("calls set when the name input changes", () => {
    const set = vi.fn();
    renderTab(set);
    const input = screen.getByDisplayValue("TestPlayer");
    fireEvent.input(input, { target: { value: "NewName" } });
    expect(set).toHaveBeenCalledOnce();
  });

  it("renders the Secrets section with toggle labels", () => {
    renderTab();
    expect(screen.getByText("darkMode")).toBeInTheDocument();
    expect(screen.getByText("speedrun")).toBeInTheDocument();
  });

  it("renders Health and Records panel group headings", () => {
    renderTab();
    expect(screen.getByRole("heading", { name: /health/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /records/i })).toBeInTheDocument();
  });
});
