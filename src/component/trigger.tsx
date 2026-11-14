import type { MouseEventHandler } from "react";
import { ItemContext, RootContext, useRequiredContext } from "./context";
import type { TriggerProps } from "./types";

export default function Trigger(props: TriggerProps) {
  const { headingProps, buttonProps, children } = props;
  const { heading = "h3", ...restHeadingProps } = headingProps ?? {};
  const { onClick, ...restButtonProps } = buttonProps ?? {};
  const part = "Accordion.Trigger";
  const { dispatch } = useRequiredContext(RootContext, part);

  const { value, isOpen, isDisabled, triggerId, contentId } =
    useRequiredContext(ItemContext, part);

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    onClick?.(event);
    if (event.defaultPrevented) return;

    dispatch({
      type: isOpen ? "close" : "open",
      value,
    });
  };

  const Heading = heading;

  return (
    <Heading {...restHeadingProps} data-part="accordion-header">
      <button
        {...restButtonProps}
        id={triggerId}
        aria-expanded={isOpen}
        aria-controls={contentId}
        disabled={isDisabled}
        data-part="accordion-trigger"
        data-state={isOpen ? "open" : "closed"}
        data-disabled={isDisabled ? "" : undefined}
        onClick={handleClick}
      >
        {children}
      </button>
    </Heading>
  );
}
