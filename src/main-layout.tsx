import { Outlet } from "react-router-dom";
import { DocPageProvider } from "./contexts/doc-page-context";
// import { LinesOverlay } from "lines-overlay";

export function AppProviderLayout() {
  return (
    <DocPageProvider>
      <>
        <Outlet />
        {/* <LinesOverlay /> */}
      </>
    </DocPageProvider>
  );
}
