import { ItemContext, RootContext, useRequiredContext } from "./context";
import type { ContentId, ItemProps, TriggerId } from "./types";

export default function Item(props: ItemProps) {
  const { value, isDisabled = false, children, ...rest } = props;

  const { baseId, openValues } = useRequiredContext(
    RootContext,
    "Accordion.Item",
  );

  const isOpen = openValues.includes(value);
  const triggerId: TriggerId = `${baseId}-trigger-${value}`;
  const contentId: ContentId = `${baseId}-content-${value}`;

  return (
    <ItemContext value={{ value, isOpen, isDisabled, contentId, triggerId }}>
      <div
        {...rest}
        data-part="accordion-item"
        data-state={isOpen ? "open" : "closed"}
        data-disabled={isDisabled ? "" : undefined}
      >
        {children}
      </div>
    </ItemContext>
  );
}
