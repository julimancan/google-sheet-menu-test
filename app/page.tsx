import Link from "next/link";
import Box from "./components/Box";
import { getConfig, SiteConfig } from "./getConfig";
import { getMenuCategories } from "./getMenuCategories";
import RightArrowIcon from "./components/icons/RightArrowIcon";
import Subcategories from "./Subcategories";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const configData = await getConfig();
  const config: SiteConfig | null = Array.isArray(configData)
    ? null
    : configData;

  const categories = await getMenuCategories();

  if (!config || !categories) {
    return;
  }

  const params = await searchParams;
  const view = params.view;
  const currentCategory = categories.find((category) => category.slug === view);

  console.log({ currentCategory, view });

  return (
    <main className="p-5 flex flex-col gap-5">
      {currentCategory ? (
        <>
          <Box>
            {currentCategory.image ? (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <img src={currentCategory.image} alt="" />
                <h2 className="absolute bottom-10 left-1/2 -translate-x-1/2 text-foreground/70 font-forum text-4xl whitespace-nowrap font-semibold">
                  {currentCategory.title}
                </h2>
              </div>
            ) : (
              // <div className="w-full aspect-square h-full bg-gray-600" />
              <div className="w-full aspect-square h-full bg-gray-600" />
            )}
          </Box>
          <div className="relative">
            <ul className="sticky w-fit px-4 mx-auto flex gap-4 justify-center items-center border border-foreground bg-background rounded-lg py-2">
              {currentCategory.subCategories?.map((subCat, index) => (
                <li key={`${index}-${subCat.slug}`}>
                  <Link
                    href={`#${subCat.slug}`}
                    className="border border-foreground rounded-md px-1 flex items-center"
                  >
                    <span className="text-[11px] font-alegreya">
                      {subCat.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Subcategories currentCategory={currentCategory} />
          </div>
        </>
      ) : (
        <>
          <Box>
            <video
              src="https://framerusercontent.com/assets/jlqpkQc2ceU9TEpqIbYfOyegQsg.mp4"
              className="w-full"
              loop
              preload="auto"
              playsInline
              // style="cursor: auto; width: 100%; height: 100%; border-radius: 0px; display: block; object-fit: cover; background-color: rgba(0, 0, 0, 0); object-position: 50% 50%;"
              autoPlay
              // controls
              muted
            ></video>
            <div className="absolute left-1/2 -translate-x-1/2 bottom-16 flex flex-col items-center">
              {config.visuales.logoGrande && (
                <img
                  className="w-[175px]"
                  width={175}
                  height={58}
                  src={config.visuales.logoGrande}
                />
              )}
              <h1 className="text-[22px] font-forum">SERVICE MENU</h1>
            </div>
          </Box>
          <ul className="flex flex-col gap-5">
            {categories.map((category, index) => (
              <li key={`${index}-${category.slug}`} className="group relative">
                <Link href={`?view=${category.slug}`}>
                  <Box>
                    {category.imageLink && (
                      <img
                        className="w-full object-cover opacity-65 group-hover:opacity-100 transition-all"
                        src={category.imageLink}
                        alt=""
                      />
                    )}

                    {category.linkTitle && (
                      <div className="bg-foreground text-[20px] font-alegreya font-bold flex gap-2 items-center justify-center w-fit text-background py-2 px-3 rounded-md absolute bottom-5 right-5">
                        {category.linkTitle}
                        <div className="relative rounded-full overflow-hidden flex items-center border border-background bg-black/50 p-1 h-[32px] w-[32px] text-white/50 group-hover:bg-black transition-all">
                          <div className="absolute  -translate-x-full group-hover:translate-x-0 transition-all duration-300">
                            <RightArrowIcon />
                          </div>
                          <div className="group-hover:translate-x-100 transition-all duration-300">
                            <RightArrowIcon />
                          </div>
                        </div>
                      </div>
                    )}
                  </Box>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
