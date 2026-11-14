import type { ComponentPropsWithoutRef, ReactNode } from "react";

export type Model = ReadonlyArray<string>;

export type Message = {
  type: "open" | "close";
  value: string;
};

export type UpdateOptions = {
  model: Model;
  message: Message;
  hasMultipleOpenPanels: boolean;
};

export type Dispatch = (message: Message) => void;

export type RootProps = ComponentPropsWithoutRef<"div"> & {
  defaultOpenValues?: Model;
  hasMultipleOpenPanels?: UpdateOptions["hasMultipleOpenPanels"];
  children: ReactNode;
};

export type ItemProps = ComponentPropsWithoutRef<"div"> & {
  value: string;
  isDisabled?: boolean;
  children: ReactNode;
};

export type TriggerProps = {
  headingProps?: ComponentPropsWithoutRef<"h2" | "h3" | "h4" | "h5" | "h6"> & {
    heading?: "h2" | "h3" | "h4" | "h5" | "h6";
  };
  buttonProps?: ComponentPropsWithoutRef<"button">;
  children: ReactNode;
};

export type ContentProps = ComponentPropsWithoutRef<"div"> & {
  children: ReactNode;
};

export type TRootContext = {
  baseId: string;
  openValues: Model;
  dispatch: Dispatch;
};

export type TriggerId = `${string}-trigger-${ItemProps["value"]}`;
export type ContentId = `${string}-content-${ItemProps["value"]}`;

export type TItemContext = {
  value: ItemProps["value"];
  isOpen: boolean;
  isDisabled: NonNullable<ItemProps["isDisabled"]>;
  triggerId: TriggerId;
  contentId: ContentId;
};
