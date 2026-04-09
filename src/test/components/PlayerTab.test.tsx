import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@solidjs/testing-library";
import { createStore } from "solid-js/store";
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

  it("renders Health and Records panel groups", () => {
    renderTab();
    expect(screen.getByText(/health/i)).toBeInTheDocument();
    expect(screen.getByText(/records/i)).toBeInTheDocument();
  });
});
