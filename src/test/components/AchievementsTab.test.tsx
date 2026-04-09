import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@solidjs/testing-library";
import { createStore } from "solid-js/store";
import { AchievementsTab } from "~/components/tabs/AchievementsTab";
import { mockSaveData } from "~/test/fixtures";
import type { SaveData } from "~/types/save";

const renderTab = (set = vi.fn()) => {
  const [store] = createStore({ data: mockSaveData });
  render(() => <AchievementsTab store={store as { data: SaveData }} set={set} active={true} />);
};

describe("AchievementsTab", () => {
  it("renders the coming soon title", () => {
    renderTab();
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument();
  });

  it("renders the under construction message", () => {
    renderTab();
    expect(screen.getByText(/under construction/i)).toBeInTheDocument();
  });
});
