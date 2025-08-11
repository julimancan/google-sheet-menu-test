"use client";
import { HTMLAttributes, useState } from "react";
import { cn } from "../utils/helpers";
import MenuModal from "./MenuModal";
import { Category } from "../getMenuCategories";
import Link from "next/link";

const BurgerMenu = ({ categories }: { categories: Category[] | null }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="bg-foreground px-2 flex flex-col justify-center items-center duration-400 gap-1 rounded-sm h-[34px] w-[34px] group transition-all cursor-pointer"
      >
        <Bar className="group-hover:translate-y-[6px]" />
        <Bar />
        <Bar className="group-hover:-translate-y-[6px]" />
      </button>
      <MenuModal open={open} onOpenChange={setOpen}>
        <ul>
          {categories?.map((category) => (
            <li
              key={category.slug}
              className="font-forum text-[32px] md:text-[48px] text-center"
            >
              <Link
                onClick={() => setOpen(false)}
                href={`?view=${category.slug}`}
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </MenuModal>
    </>
  );
};

export default BurgerMenu;

const Bar = ({
  className,
}: {
  className?: HTMLAttributes<HTMLDivElement>["className"];
}) => {
  return (
    <div
      className={cn(
        "bg-background h-[2px] w-[20px] transition-all duration-400",
        className
      )}
    ></div>
  );
};
