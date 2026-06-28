"use client";

import { createContext, useContext, useState } from "react";
import { schools } from "@/lib/data/seed";

type SchoolFilter = "all" | string;
type Ctx = { activeSchool: SchoolFilter; setActiveSchool: (s: SchoolFilter) => void };

const SchoolCtx = createContext<Ctx>({ activeSchool: "all", setActiveSchool: () => {} });

export function SchoolProvider({ children }: { children: React.ReactNode }) {
  const [activeSchool, setActiveSchool] = useState<SchoolFilter>("all");
  return (
    <SchoolCtx.Provider value={{ activeSchool, setActiveSchool }}>
      {children}
    </SchoolCtx.Provider>
  );
}

export const useSchool = () => useContext(SchoolCtx);
export { schools };
