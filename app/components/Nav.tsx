import Link from "next/link";
import { getMenuCategories } from "../getMenuCategories";
import BurgerMenu from "./BurgerMenu";

const Nav = async () => {
  const categories = await getMenuCategories();

  return (
    <nav className="fixed z-10 left-1/2 -translate-x-1/2 top-8 w-full">
      <div className="flex gap-5 items-center p-2 border border-foreground bg-background rounded-lg w-fit mx-auto">
        <BurgerMenu categories={categories} />
        <Link href={"/"}>
          <img src="/logo.svg" alt="logo" className="h-[4ch]" />
        </Link>
        <ul className="flex items-center gap-5">
          {categories?.map((category) => (
            <li
              key={category.slug}
              className="font-alegreya text-[14px] hover:bg-foreground hover:text-background flex items-center justify-center h-[30.8px] px-2 rounded-md transition-all duration-300"
            >
              <Link href={`?view=${category.slug}`}>{category.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Nav;
