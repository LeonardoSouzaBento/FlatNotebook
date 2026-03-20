import { Outlet } from "react-router-dom";
import { DocPageProvider } from "./contexts/doc-page-context";

export function AppProviderLayout() {
  return (
    <DocPageProvider>
      <Outlet />
    </DocPageProvider>
  );
}