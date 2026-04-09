import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@solidjs/testing-library";
import { createStore } from "solid-js/store";
import { AchievementsTab } from "~/components/tabs/AchievementsTab";
import { mockSaveData } from "~/test/fixtures";
import type { SaveData } from "~/types/save";

const renderTab = (set = vi.fn()) => {
  const [store] = createStore({ data: mockSaveData });
  render(() => <AchievementsTab store={store as { data: SaveData }} set={set} active={true} />);
};

describe("AchievementsTab", () => {
  it("renders all achievement descriptions", () => {
    renderTab();
    expect(screen.getByText("First catch")).toBeInTheDocument();
    expect(screen.getByText("Win 10 waves")).toBeInTheDocument();
  });

  it("unlocked achievement card has the 'unlocked' class", () => {
    renderTab();
    // "First catch" is status: true → should have unlocked class on its card
    const desc = screen.getByText("First catch");
    expect(desc.closest(".achievement-card")).toHaveClass("unlocked");
  });

  it("locked achievement card does not have the 'unlocked' class", () => {
    renderTab();
    const desc = screen.getByText("Win 10 waves");
    expect(desc.closest(".achievement-card")).not.toHaveClass("unlocked");
  });

  it("calls set when an achievement checkbox is toggled", () => {
    const set = vi.fn();
    renderTab(set);
    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.change(checkboxes[0], { target: { checked: false } });
    expect(set).toHaveBeenCalledOnce();
  });

  it("shows unlocked/locked label text", () => {
    renderTab();
    expect(screen.getByText("Unlocked")).toBeInTheDocument();
    expect(screen.getByText("Locked")).toBeInTheDocument();
  });
});
