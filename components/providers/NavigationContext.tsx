"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import Dashboard from "@/components/protected/Dashboard";
import Weather from "@/components/protected/Weather";
import Page1 from "@/components/protected/Page1";
import Page2 from "@/components/protected/Page2";
import Page3 from "@/components/protected/Page3";
import Help from "@/components/protected/Help";

type NavigationContextType = {
  currentPage: pageProp;
  setCurrentPage: (page: string) => void;
  pages: pageProp[];
};

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
);

type pageProp = {
  name: string;
  component: ReactNode;
};

const pages: pageProp[] = [
  { name: "Dashboard", component: <Dashboard /> },
  { name: "Weather", component: <Weather /> },
  { name: "Precautions", component: <Page1 /> },
  { name: "idk what to add 2", component: <Page2 /> },
  { name: "idk what to add final", component: <Page3 /> },
  { name: "Help", component: <Help /> },
];

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCPage] = useState<pageProp>({
    name: "Dashboard",
    component: <Dashboard />,
  });

  const setCurrentPage = (page: string) => {
    const foundPage = pages.find((p) => p.name === page);
    if (foundPage) {
      setCPage(foundPage);
    }
  };

  return (
    <NavigationContext.Provider value={{ currentPage, setCurrentPage, pages }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within NavigationProvider");
  }
  return context;
}
