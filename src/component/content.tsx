import { ItemContext, useRequiredContext } from "./context";
import type { ContentProps } from "./types";

export default function Content(props: ContentProps) {
  const { children, ...rest } = props;

  const { isOpen, isDisabled, triggerId, contentId } = useRequiredContext(
    ItemContext,
    "Accordion.Content",
  );

  return (
    <div
      {...rest}
      id={contentId}
      role="region"
      aria-labelledby={triggerId}
      data-part="accordion-content"
      data-state={isOpen ? "open" : "closed"}
      data-disabled={isDisabled ? "" : undefined}
    >
      <div data-part="accordion-content-clip">
        <div data-part="accordion-content-body">{children}</div>
      </div>
    </div>
  );
}
