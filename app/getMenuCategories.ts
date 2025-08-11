"use server";

import { getSheetData } from "./getGoogleSheetData";

export type Category = {
  name: string;
  slug: string;
  parentCategory: string | null; // Use `null` for parentless categories
  isAvailable: boolean;
  image: string | null; // Use `null` for categories without an image
  imageLink: string | null; // Use `null` for categories without an image
  subCategories?: Category[];
  linkTitle: string | null;
  title: string | null;
};

export const getMenuCategories = async (): Promise<Category[] | null> => {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const sheetRange = "CATEGORIAS!A:H";

  if (!sheetId) {
    throw new Error("not google sheet id found");
  }

  const data = await getSheetData(sheetId, sheetRange);

  if (!data || data.length < 2) {
    return [];
  }

  const categories = data
    .slice(1)
    .filter((row) => row.some((cell) => cell.trim() !== ""))
    .filter((row) => row[0] && row[0].trim() !== "")
    .map((row) => {
      // Map the array indices to our new object keys
      const [
        name,
        slug,
        parentCategory,
        isAvailable,
        image,
        imageLink,
        linkTitle,
        title,
      ] = row;

      return {
        name: name || "",
        slug: slug || "",
        parentCategory: parentCategory || null,
        isAvailable: isAvailable?.toUpperCase() === "TRUE",
        image: image || null,
        imageLink: imageLink || null,
        linkTitle: linkTitle || null,
        title: title || null,
      };
    });

  return organizeCategories(categories);
};

const organizeCategories = (flatCategories: Category[]): Category[] => {
  const topLevelCategories: Category[] = [];
  const categoriesMap = new Map<string, Category>();

  // First pass: create a map for easy lookup and initialize the subCategories array
  flatCategories.forEach((category) => {
    // We'll use the category's name as the key for our map
    categoriesMap.set(category.name, { ...category, subCategories: [] });
  });

  // Second pass: build the tree
  categoriesMap.forEach((category) => {
    // If the category has a parent
    if (category.parentCategory) {
      const parent = categoriesMap.get(category.parentCategory);

      // If the parent exists, add the current category to the parent's subCategories array
      if (parent) {
        parent.subCategories?.push(category);
      }
    } else {
      // If there's no parent, it's a top-level category
      topLevelCategories.push(category);
    }
  });

  return topLevelCategories;
};
