import { createContext, useContext, type Context } from "react";
import type { TItemContext, TRootContext } from "./types";

export const RootContext = createContext<TRootContext | null>(null);
export const ItemContext = createContext<TItemContext | null>(null);

export function useRequiredContext<Value>(
  context: Context<Value | null>,
  part: string,
) {
  const value = useContext(context);

  if (value == null) {
    throw new Error(`<${part}> must be used inside its parent.`);
  }

  return value;
}
