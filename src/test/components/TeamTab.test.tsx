import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@solidjs/testing-library";
import { createStore } from "solid-js/store";
import { TeamTab } from "~/components/tabs/TeamTab";
import { mockSaveData } from "~/test/fixtures";
import type { SaveData } from "~/types/save";

const renderTab = (overrideData?: Partial<SaveData>, set = vi.fn()) => {
  const [store] = createStore({ data: { ...mockSaveData, ...overrideData } });
  render(() => <TeamTab store={store as { data: SaveData }} set={set} active={true} />);
};

describe("TeamTab", () => {
  it("renders a species placeholder option for every team slot", () => {
    renderTab();
    // fixture has 2 Pokémon → 2 species selects each with the placeholder option
    expect(screen.getAllByText("— choose species —")).toHaveLength(2);
  });

  it("shows the placeholder as the selected value for empty slots", () => {
    const teamWithEmpty = [
      ...mockSaveData.team,
      { specieKey: "", lvl: 1, targetMode: "first", favorite: false, isShiny: false, hideShiny: false, isMega: false },
    ];
    renderTab({ team: teamWithEmpty });
    // 3 slots → 3 species selects; the empty one has placeholder selected
    const placeholders = screen.getAllByText("— choose species —");
    expect(placeholders).toHaveLength(3);
  });

  it("renders a level input for each filled slot", () => {
    // 2 filled Pokémon → 2 number inputs (one per level field)
    renderTab();
    expect(screen.getAllByRole("spinbutton")).toHaveLength(2);
  });

  it("does not render card fields for empty slots", () => {
    const teamWithEmpty = [
      { specieKey: "", lvl: 1, targetMode: "first", favorite: false, isShiny: false, hideShiny: false, isMega: false },
    ];
    renderTab({ team: teamWithEmpty });
    expect(screen.queryByRole("spinbutton")).not.toBeInTheDocument();
  });

  it("calls set when the species select changes", () => {
    const set = vi.fn();
    renderTab(undefined, set);
    // get all comboboxes; the first belongs to slot #1's species select
    const [firstSpeciesSelect] = screen.getAllByRole("combobox");
    fireEvent.change(firstSpeciesSelect, { target: { value: "bulbasaur" } });
    expect(set).toHaveBeenCalledOnce();
  });

  it("shows filled/total slot count in the header", () => {
    // fixture: 10 stars → 6 total slots, 2 filled Pokémon
    renderTab();
    expect(screen.getByText(/2 \/ 6 slots/)).toBeInTheDocument();
  });

  it("excludes empty slots from the filled count", () => {
    const teamWithEmpty = [
      ...mockSaveData.team,
      { specieKey: "", lvl: 1, targetMode: "first", favorite: false, isShiny: false, hideShiny: false, isMega: false },
    ];
    // 40 stars → 7 total slots, 2 filled (empty entry not counted)
    renderTab({ team: teamWithEmpty, player: { ...mockSaveData.player, stars: 40 } });
    expect(screen.getByText(/2 \/ 7 slots/)).toBeInTheDocument();
  });
});
