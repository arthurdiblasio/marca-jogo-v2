import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
}

export function PageContainer({
  children,
}: PageContainerProps) {
  return (
    <div className="mx-auto max-w-md px-6">
      {children}
    </div>
  );
}