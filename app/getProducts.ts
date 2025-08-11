import { getSheetData } from "./getGoogleSheetData";
import z from "zod";

const serviceSchema = z.object({
  tipoDeServicio: z.string().optional().nullable(),
  slug: z.string(),
  titulo: z.string(),
  disponible: z.boolean().optional().nullable(),
  descripcionCompleta: z.string().optional().nullable(),
  valor: z.number(),
  imagen: z.string().optional().nullable(),
  categoria: z.string().optional().nullable(),
});
export type Service = z.infer<typeof serviceSchema>;

export const servicesSchema = z.array(serviceSchema);
export const getProductsByType = async (type: string) => {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const sheetRange = `${type}!A:H`;

  if (!sheetId) {
    throw new Error("not google sheet id found");
  }

  const sheetData = await getSheetData(sheetId, sheetRange);

  if (!sheetData || sheetData.length < 2) {
    return [];
  }

  const organizedServices = organizeServices(sheetData);

  const { success, data, error } = servicesSchema.safeParse(organizedServices);

  if (!success) {
    console.error("Zod validation failed for services:", error);
    throw new Error("Couldn't validate service data");
  }

  return data;
};

function organizeServices(data: (string | undefined)[][]): any[] {
  // Skip the header row and then filter out any rows where all cells are undefined or empty strings.
  const serviceRows = data
    .slice(1)
    .filter((row) =>
      row.some(
        (cell) =>
          cell !== undefined && cell !== null && String(cell).trim() !== ""
      )
    );

  return serviceRows.map((row) => {
    // Destructure the new row data based on the columns
    const [
      tipoDeServicio,
      slug,
      titulo,
      disponible,
      descripcionCompleta,
      valor,
      imagen,
      categoria,
    ] = row;

    // Convert 'TRUE'/'FALSE' string to a boolean.
    const isAvailable = disponible?.toUpperCase() === "TRUE";

    // Convert the 'valor' string to a number, removing any thousands separators.
    const numericValue = valor ? parseInt(valor.replace(/\./g, ""), 10) : 0;

    return {
      tipoDeServicio: tipoDeServicio || null,
      slug: slug || null,
      titulo: titulo || null,
      disponible: isAvailable,
      descripcionCompleta: descripcionCompleta || null,
      valor: numericValue,
      imagen: imagen || null,
      categoria: categoria || null,
    };
  });
}
