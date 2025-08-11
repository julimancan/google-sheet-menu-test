import z from "zod";
import { getSheetData } from "./getGoogleSheetData";

const configSchema = z.object({
  seo: z.object({
    titulo: z.string().nullable().optional(),
    descripcion: z.string().nullable().optional(),
    imagen: z.string().nullable().optional(),
    dominio: z.string().nullable().optional(),
    nombreDelSitio: z.string().nullable().optional(),
    locale: z.string().nullable().optional(),
  }),
  visuales: z.object({
    imagenFondo: z.string().nullable().optional(),
    colorPrimario: z.string().nullable().optional(),
    colorSecundario: z.string().nullable().optional(),
    videoPrincipal: z.string().nullable().optional(),
    logoPequeno: z.string().nullable().optional(),
    logoGrande: z.string().nullable().optional(),
    copywright: z.string().nullable().optional(),
  }),
  // You can add more categories here as needed
});

export type SiteConfig = z.infer<typeof configSchema>;

export const getConfig = async () => {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const sheetRange = "CONFIGURACIONES!A:C";

  if (!sheetId) {
    throw new Error("not google sheet id found");
  }

  const sheetData = await getSheetData(sheetId, sheetRange);

  if (!sheetData || sheetData.length < 2) {
    return [];
  }

  const rawOrganizedConfig = organizeConfig(sheetData);

  const { success, data, error } = configSchema.safeParse(rawOrganizedConfig);

  if (!success) {
    console.error(error);
    throw new Error("Couldn't find config data");
  }

  return data;
};

type ConfigData = [string, string, string | undefined];

type OrganizedConfig = Record<string, Record<string, string | null>>;

function organizeConfig(data: (string | undefined)[][]): OrganizedConfig {
  const config: OrganizedConfig = {};

  // Skip the first two header rows
  for (let i = 2; i < data.length; i++) {
    const row = data[i] as ConfigData;
    const [category, name, value] = row;

    // Check if category and name are valid strings
    if (category && name) {
      // Initialize the category object if it doesn't exist
      if (!config[category]) {
        config[category] = {};
      }

      // Assign the name-value pair. Default to null if value is not present.
      config[category][name] = value || null;
    }
  }

  return config;
}
