import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SpeakerGrid } from "@/components/sections/SpeakerGrid";
import type { Speaker } from "@/content/types";

const speakers: Speaker[] = [
  {
    name: "Pr. Speaker One",
    role: "Professor",
    affiliation: "ENSA Fès",
    topic: "Conference One",
    biography: "Biography one.",
    links: [{ label: "LinkedIn", href: "https://example.com/one", external: true }]
  },
  {
    name: "Pr. Speaker Two",
    role: "Researcher",
    affiliation: "USMBA",
    topic: "Conference Two",
    biography: "Biography two."
  }
];

const labels = {
  biography: "Biographie",
  details: "Présentation",
  showDetails: "Découvrir la biographie",
  hideDetails: "Retour à la fiche"
};

describe("SpeakerGrid", () => {
  beforeEach(() => {
    vi.stubGlobal("IntersectionObserver", class {
      observe() {}
      unobserve() {}
      disconnect() {}
    });
    vi.stubGlobal("PointerEvent", class extends MouseEvent {
      pointerType: string;

      constructor(type: string, init: PointerEventInit = {}) {
        super(type, init);
        this.pointerType = init.pointerType ?? "";
      }
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("opens one card at a time on tap and closes it from outside", () => {
    const { container } = render(<SpeakerGrid speakers={speakers} labels={labels} />);
    const panels = container.querySelectorAll(".speaker-card__panel");

    expect(panels[0]).toHaveAttribute("aria-hidden", "true");
    expect(panels[1]).toHaveAttribute("aria-hidden", "true");

    fireEvent.click(screen.getByRole("heading", { name: "Pr. Speaker One" }));
    expect(panels[0]).toHaveAttribute("aria-hidden", "false");
    expect(screen.getByRole("link", { name: "LinkedIn" })).toBeInTheDocument();
    expect(screen.queryByText("Intervention")).not.toBeInTheDocument();
    expect(screen.queryByText("Conference One")).not.toBeInTheDocument();
    const firstLink = panels[0].querySelector("a");
    const biography = panels[0].querySelector(".speaker-card__bio:last-child");
    expect(firstLink && biography && (firstLink.compareDocumentPosition(biography) & Node.DOCUMENT_POSITION_FOLLOWING)).toBeTruthy();

    const closeButton = screen.getByRole("button", { name: "Retour à la fiche" });
    fireEvent.pointerDown(closeButton, { pointerType: "touch" });
    fireEvent.click(closeButton, { detail: 1 });
    expect(panels[0]).toHaveAttribute("aria-hidden", "true");

    fireEvent.focus(screen.getAllByRole("button", { name: "Découvrir la biographie" })[0]);
    expect(panels[0]).toHaveAttribute("aria-hidden", "false");
    fireEvent.click(screen.getByRole("heading", { name: "Pr. Speaker Two" }));
    expect(panels[0]).toHaveAttribute("aria-hidden", "true");
    expect(panels[1]).toHaveAttribute("aria-hidden", "false");

    fireEvent.pointerDown(document.body);
    expect(panels[1]).toHaveAttribute("aria-hidden", "true");
  });
});
