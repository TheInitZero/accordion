import type { UpdateOptions } from "./types";

export function update(options: UpdateOptions) {
  const { model, message, hasMultipleOpenPanels } = options;

  switch (message.type) {
    case "open": {
      if (model.includes(message.value)) return model;

      return hasMultipleOpenPanels
        ? [...model, message.value]
        : [message.value];
    }
    case "close": {
      return model.filter((value) => value !== message.value);
    }
    default: {
      message.type satisfies never;
      return model;
    }
  }
}
