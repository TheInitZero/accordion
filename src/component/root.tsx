import { useId, useState } from "react";
import type { Dispatch, Model, RootProps } from "./types";
import { update } from "./state";
import { RootContext } from "./context";

export default function Root(props: RootProps) {
  const {
    defaultOpenValues = [],
    hasMultipleOpenPanels = false,
    children,
    ...rest
  } = props;

  const baseId = useId();

  const [model, setModel] = useState<Model>(() => {
    return hasMultipleOpenPanels
      ? defaultOpenValues
      : defaultOpenValues.slice(0, 1);
  });

  const dispatch: Dispatch = (message) => {
    setModel((model) => update({ model, message, hasMultipleOpenPanels }));
  };

  return (
    <RootContext value={{ baseId, dispatch, openValues: model }}>
      <div {...rest} data-part="accordion-root">
        {children}
      </div>
    </RootContext>
  );
}
