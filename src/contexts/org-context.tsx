"use client";

import { createContext, useContext } from "react";

export type OrgInfo = {
  id: string;
  name: string;
  slug: string;
  type: "PELADA" | "TEAM";
  logoUrl: string | null;
  modality: string | null;
};

interface OrgContextValue {
  orgs: OrgInfo[];
  activeOrg: OrgInfo | null;
}

const OrgContext = createContext<OrgContextValue>({ orgs: [], activeOrg: null });

export function useOrgs() {
  return useContext(OrgContext);
}

export function OrgProvider({
  orgs,
  activeOrg,
  children,
}: OrgContextValue & { children: React.ReactNode }) {
  return (
    <OrgContext.Provider value={{ orgs, activeOrg }}>
      {children}
    </OrgContext.Provider>
  );
}
