"use server";

import { google } from "googleapis";
import { googleAuth } from "./googleAuth";
import { cache } from "react";

export const getSheetData = cache(
  async (spreadsheetId: string, range: string) => {
    try {
      const auth = await googleAuth();
      const sheets = google.sheets({
        auth,
        version: "v4",
      });

      // console.log(sheets.spreadsheets.values.get({}));
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });

      return response.data.values?.filter((row) => {
        return row && row.some((cell) => cell && String(cell).trim() !== "");
      });
    } catch (error) {
      console.error("The API returned an error:", error);
      throw new Error("failed to get the data");
    }
  }
);
