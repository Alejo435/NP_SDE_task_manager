import { createContext, useContext } from "react";
import { MEMBER_COLORS } from "../lib/team";

const TagColorsContext = createContext<Record<string, string>>({});

export const TagColorsProvider = TagColorsContext.Provider;

export function useTagColors() {
  const colors = useContext(TagColorsContext);
  return (tag: string) => colors[tag] ?? MEMBER_COLORS[0];
}
