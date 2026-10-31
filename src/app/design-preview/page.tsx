import type { Metadata } from "next";

import { DesignPreview } from "./design-preview";

export const metadata: Metadata = {
  title: "Design preview",
  description: "Temporary component gallery. Remove in F8.",
};

/** Temporary route. Remove in F8. */
export default function DesignPreviewPage() {
  return <DesignPreview />;
}
