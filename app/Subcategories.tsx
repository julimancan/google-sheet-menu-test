import { Category } from "./getMenuCategories";
import { getProductsByType } from "./getProducts";
import { numberToColombianPriceString } from "./utils/helpers";

const Subcategories = async ({
  currentCategory,
}: {
  currentCategory: Category;
}) => {
  const products = await getProductsByType(
    currentCategory.name === "BAR" ? "PRODUCTS" : currentCategory.name
  );

  return (
    <ul className="flex flex-col gap-10">
      {currentCategory.subCategories?.map((subCat) => (
        <li key={subCat.name}>
          <CategoryTitle title={subCat.name} />

          <ul className="flex flex-col gap-10">
            {products
              .filter((product) => product.tipoDeServicio === subCat.name)
              .map((service) => (
                <li key={service.slug} className="flex items-center gap-2">
                  {service.imagen && (
                    <img
                      className="w-[150px] aspect-square border-2 border-foreground rounded-lg"
                      src={service.imagen}
                      alt={service.titulo}
                    />
                  )}
                  <div className="flex flex-col gap-1 w-full">
                    <div className="flex items-baseline">
                      <span>{service.titulo}</span>
                      <div className="border-b border-dotted mx-5 border-foreground/50 flex-grow"></div>
                      <span>{numberToColombianPriceString(service.valor)}</span>
                    </div>
                    <span>{service.descripcionCompleta}</span>
                  </div>
                </li>
              ))}
          </ul>
        </li>
      ))}
    </ul>
  );
};

export default Subcategories;

const CategoryTitle = ({ title }: { title: string | null }) => {
  return (
    <div className="flex items-center w-full">
      <Diamond />
      <Line />
      <span className="mx-2 font-forum text-[40px] whitespace-nowrap">
        {title ?? "undefined"}
      </span>
      <Line />
      <Diamond />
    </div>
  );
};

const Diamond = () => {
  return (
    <div className="border border-foreground/40 w-[13px] aspect-square rotate-45"></div>
  );
};
const Line = () => {
  return <div className="h-[1px] w-full bg-foreground/40"></div>;
};
