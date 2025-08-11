import { ReactNode } from "react";

const Box = ({ children }: { children: ReactNode }) => {
  return (
    <div className="border-2 border-foreground rounded-2xl overflow-hidden">
      {children}
    </div>
  );
};

export default Box;
