import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Accordion } from "../index";
import type { RootProps } from "../types";

const items = [
  { value: "a", title: "First" },
  { value: "b", title: "Second" },
  { value: "c", title: "Third" },
];

function renderAccordion(rootProps: Omit<RootProps, "children"> = {}) {
  const user = userEvent.setup();

  return {
    user,
    ...render(
      <Accordion.Root {...rootProps}>
        {items.map(({ value, title }) => (
          <Accordion.Item key={value} value={value}>
            <Accordion.Trigger>{title}</Accordion.Trigger>
            <Accordion.Content>{title} content</Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>,
    ),
  };
}

function getExpandedStates() {
  return screen
    .getAllByRole("button")
    .map((button) => button.getAttribute("aria-expanded"));
}

function getParts(container: HTMLElement, part: string) {
  return container.querySelectorAll(`[data-part="${part}"]`);
}

const stateParts = ["accordion-item", "accordion-trigger", "accordion-content"];

describe("Accordion", () => {
  describe("initial render", () => {
    it("should render item open when value is in defaultOpenValues", () => {
      renderAccordion({ defaultOpenValues: ["b"] });

      expect(screen.getByRole("button", { name: "Second" })).toHaveAttribute(
        "aria-expanded",
        "true",
      );
    });

    it("should render all items closed when defaultOpenValues is not set", () => {
      renderAccordion();

      expect(getExpandedStates()).toEqual(["false", "false", "false"]);
    });

    it("should open only first value when single mode and many defaults", () => {
      renderAccordion({ defaultOpenValues: ["b", "c"] });

      expect(getExpandedStates()).toEqual(["false", "true", "false"]);
    });

    it("should open all default values when multiple mode", () => {
      renderAccordion({
        defaultOpenValues: ["a", "c"],
        hasMultipleOpenPanels: true,
      });

      expect(getExpandedStates()).toEqual(["true", "false", "true"]);
    });
  });

  describe("interaction", () => {
    it("should open panel when closed trigger is clicked", async () => {
      const { user } = renderAccordion();

      await user.click(screen.getByRole("button", { name: "Second" }));

      expect(getExpandedStates()).toEqual(["false", "true", "false"]);
    });

    it("should close panel when open trigger is clicked", async () => {
      const { user } = renderAccordion({ defaultOpenValues: ["a"] });

      await user.click(screen.getByRole("button", { name: "First" }));

      expect(getExpandedStates()).toEqual(["false", "false", "false"]);
    });

    it("should close other panel when single mode and another opens", async () => {
      const { user } = renderAccordion({ defaultOpenValues: ["a"] });

      await user.click(screen.getByRole("button", { name: "Second" }));

      expect(getExpandedStates()).toEqual(["false", "true", "false"]);
    });

    it("should keep other panels open when multiple mode and another opens", async () => {
      const { user } = renderAccordion({
        defaultOpenValues: ["a"],
        hasMultipleOpenPanels: true,
      });

      await user.click(screen.getByRole("button", { name: "Second" }));

      expect(getExpandedStates()).toEqual(["true", "true", "false"]);
    });

    it("should not toggle when item is disabled", async () => {
      const user = userEvent.setup();
      render(
        <Accordion.Root>
          <Accordion.Item value="a" isDisabled>
            <Accordion.Trigger>First</Accordion.Trigger>
            <Accordion.Content>First content</Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>,
      );

      await user.click(screen.getByRole("button", { name: "First" }));

      expect(screen.getByRole("button", { name: "First" })).toHaveAttribute(
        "aria-expanded",
        "false",
      );
    });

    it("should not toggle when onClick prevents default", async () => {
      const user = userEvent.setup();
      render(
        <Accordion.Root>
          <Accordion.Item value="a">
            <Accordion.Trigger
              buttonProps={{ onClick: (event) => event.preventDefault() }}
            >
              First
            </Accordion.Trigger>
            <Accordion.Content>First content</Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>,
      );

      await user.click(screen.getByRole("button", { name: "First" }));

      expect(screen.getByRole("button", { name: "First" })).toHaveAttribute(
        "aria-expanded",
        "false",
      );
    });
  });

  describe("accessibility", () => {
    it("should link trigger and region when rendered", () => {
      renderAccordion({ defaultOpenValues: ["a"] });

      const trigger = screen.getByRole("button", { name: "First" });
      const region = screen.getByRole("region", { name: "First" });

      expect(trigger).toHaveAttribute("aria-controls", region.id);
    });

    it("should render trigger inside a heading when rendered", () => {
      renderAccordion();

      const heading = screen.getByRole("heading", { name: "First" });

      expect(
        within(heading).getByRole("button", { name: "First" }),
      ).toBeInTheDocument();
    });

    it("should render disabled trigger as disabled when item is disabled", () => {
      render(
        <Accordion.Root>
          <Accordion.Item value="a" isDisabled>
            <Accordion.Trigger>First</Accordion.Trigger>
            <Accordion.Content>First content</Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>,
      );

      expect(screen.getByRole("button", { name: "First" })).toBeDisabled();
    });

    it("should have no axe violations when all panels are closed", async () => {
      const { container } = renderAccordion();

      expect(await axe(container)).toHaveNoViolations();
    });

    it("should have no axe violations when a panel is open", async () => {
      const { container } = renderAccordion({ defaultOpenValues: ["a"] });

      expect(await axe(container)).toHaveNoViolations();
    });
  });

  describe("extensibility", () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should render h3 heading when heading prop is not set", () => {
      renderAccordion();

      expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(3);
    });

    it("should render custom heading level when heading prop is set", () => {
      render(
        <Accordion.Root>
          <Accordion.Item value="a">
            <Accordion.Trigger headingProps={{ heading: "h2" }}>
              Title
            </Accordion.Trigger>
            <Accordion.Content>Body</Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>,
      );

      expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
    });

    it("should forward extra props when passed to Root, Item and Content", () => {
      render(
        <Accordion.Root data-testid="root" className="custom-root">
          <Accordion.Item value="a" data-testid="item" className="custom-item">
            <Accordion.Trigger>Title</Accordion.Trigger>
            <Accordion.Content data-testid="content" className="custom-content">
              Body
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>,
      );

      expect(screen.getByTestId("root")).toHaveClass("custom-root");
      expect(screen.getByTestId("item")).toHaveClass("custom-item");
      expect(screen.getByTestId("content")).toHaveClass("custom-content");
    });

    it("should forward extra props when passed to heading and button", () => {
      render(
        <Accordion.Root>
          <Accordion.Item value="a">
            <Accordion.Trigger
              headingProps={{ className: "custom-heading" }}
              buttonProps={{ className: "custom-button" }}
            >
              Title
            </Accordion.Trigger>
            <Accordion.Content>Body</Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>,
      );

      expect(screen.getByRole("heading")).toHaveClass("custom-heading");
      expect(screen.getByRole("button")).toHaveClass("custom-button");
    });

    it("should call user onClick when trigger is clicked", async () => {
      const onClick = vi.fn();
      const user = userEvent.setup();
      render(
        <Accordion.Root>
          <Accordion.Item value="a">
            <Accordion.Trigger buttonProps={{ onClick }}>
              Title
            </Accordion.Trigger>
            <Accordion.Content>Body</Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>,
      );

      await user.click(screen.getByRole("button", { name: "Title" }));

      expect(onClick).toHaveBeenCalledOnce();
    });

    it("should keep aria link when user passes id to trigger and content", () => {
      render(
        <Accordion.Root>
          <Accordion.Item value="a">
            <Accordion.Trigger buttonProps={{ id: "mine" }}>
              Title
            </Accordion.Trigger>
            <Accordion.Content id="mine-too">Body</Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>,
      );

      const trigger = screen.getByRole("button", { name: "Title" });
      const region = screen.getByRole("region", { name: "Title" });

      expect(trigger).toHaveAttribute("aria-controls", region.id);
    });

    it("should throw when Item is used outside Root", () => {
      vi.spyOn(console, "error").mockImplementation(() => {});

      expect(() =>
        render(
          <Accordion.Item value="a">
            <Accordion.Content>Body</Accordion.Content>
          </Accordion.Item>,
        ),
      ).toThrow("<Accordion.Item> must be used inside its parent.");
    });

    it("should throw when Content is used outside Item", () => {
      vi.spyOn(console, "error").mockImplementation(() => {});

      expect(() =>
        render(
          <Accordion.Root>
            <Accordion.Content>Body</Accordion.Content>
          </Accordion.Root>,
        ),
      ).toThrow("<Accordion.Content> must be used inside its parent.");
    });
  });

  describe("styling hooks", () => {
    describe("data-part", () => {
      it.each([
        { part: "accordion-root", count: 1 },
        { part: "accordion-item", count: 3 },
        { part: "accordion-header", count: 3 },
        { part: "accordion-trigger", count: 3 },
        { part: "accordion-content", count: 3 },
        { part: "accordion-content-clip", count: 3 },
        { part: "accordion-content-body", count: 3 },
      ])(
        "should render $count $part elements when rendered",
        ({ part, count }) => {
          const { container } = renderAccordion();

          expect(getParts(container, part)).toHaveLength(count);
        },
      );

      it("should keep own data-part when user passes data-part", () => {
        const override = { className: "custom", "data-part": "custom" };

        const { container } = render(
          <Accordion.Root {...override}>
            <Accordion.Item value="a" {...override}>
              <Accordion.Trigger headingProps={override} buttonProps={override}>
                Title
              </Accordion.Trigger>
              <Accordion.Content {...override}>Body</Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>,
        );

        expect(container.querySelector('[data-part="custom"]')).toBeNull();
      });
    });

    describe("data-state", () => {
      it.each(stateParts)(
        "should set data-state to open on %s when item is open",
        (part) => {
          const { container } = renderAccordion({ defaultOpenValues: ["a"] });

          expect(getParts(container, part)[0]).toHaveAttribute(
            "data-state",
            "open",
          );
        },
      );

      it.each(stateParts)(
        "should set data-state to closed on %s when item is closed",
        (part) => {
          const { container } = renderAccordion();

          expect(getParts(container, part)[0]).toHaveAttribute(
            "data-state",
            "closed",
          );
        },
      );

      it("should update data-state when trigger is clicked", async () => {
        const { user } = renderAccordion();

        await user.click(screen.getByRole("button", { name: "First" }));

        expect(screen.getByRole("region", { name: "First" })).toHaveAttribute(
          "data-state",
          "open",
        );
      });
    });

    describe("data-disabled", () => {
      function renderSingleItem(isDisabled: boolean) {
        return render(
          <Accordion.Root>
            <Accordion.Item value="a" isDisabled={isDisabled}>
              <Accordion.Trigger>First</Accordion.Trigger>
              <Accordion.Content>First content</Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>,
        );
      }

      it.each(stateParts)(
        "should set empty data-disabled on %s when item is disabled",
        (part) => {
          const { container } = renderSingleItem(true);

          expect(getParts(container, part)[0]).toHaveAttribute(
            "data-disabled",
            "",
          );
        },
      );

      it.each(stateParts)(
        "should omit data-disabled on %s when item is enabled",
        (part) => {
          const { container } = renderSingleItem(false);

          expect(getParts(container, part)[0]).not.toHaveAttribute(
            "data-disabled",
          );
        },
      );
    });
  });
});
