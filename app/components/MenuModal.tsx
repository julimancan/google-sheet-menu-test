"use client";

import { HTMLAttributes, useEffect, useRef } from "react";
import { cn } from "../utils/helpers";

type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
};

export default function MenuModal({
  open,
  onOpenChange,
  children,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Sync open prop with <dialog>
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => onOpenChange(false);
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onOpenChange]);

  return (
    <dialog
      ref={dialogRef}
      className="rounded-xl w-full h-full p-6 shadow-xl m-auto focus:ring-[1px] focus:ring-foreground/10 bg-[#111111] text-foreground backdrop:bg-background"
    >
      <div className="flex items-center justify-center h-full w-full">
        <div className="flex flex-col">
          <div className="mb-4">{children}</div>
        </div>
        <button
          onClick={() => onOpenChange(false)}
          className="group bg-transparent cursor-pointer shadow-[0px_0px_0px_0.1px] hover:shadow-[0px_0px_5px_0.5px] duration-200 transition-all shadow-foreground hover:shadow-foreground/50 rounded-lg w-[41px] h-[41px] absolute top-5 left-5"
        >
          <Bar className="absolute left-1/2 -translate-x-1/2 rotate-45 group-hover:rotate-0" />
          <Bar className="absolute left-1/2 -translate-x-1/2 -rotate-45 group-hover:rotate-0" />
        </button>
      </div>
    </dialog>
  );
}

const Bar = ({
  className,
}: {
  className?: HTMLAttributes<HTMLDivElement>["className"];
}) => {
  return (
    <div
      className={cn(
        "h-[2px] w-[20px] bg-foreground/50 transition-all duration-400",
        className
      )}
    />
  );
};
