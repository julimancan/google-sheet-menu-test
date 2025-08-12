"use server";

import { sheets_v4 } from "googleapis";
import { googleAuth } from "./googleAuth";
import { cache } from "react";

export const getSheetData = cache(
  async (spreadsheetId: string, range: string) => {
    try {
      const auth = await googleAuth();
      const token = await auth.getAccessToken();

      // const sheets = google.sheets({
      //   auth,
      //   version: "v4",
      // });

      // // console.log(sheets.spreadsheets.values.get({}));
      // const response = await sheets.spreadsheets.values.get({
      //   spreadsheetId,
      //   range,
      // });
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        // Set a revalidation time for Incremental Static Regeneration (ISR).
        // This example caches the data for one hour (3600 seconds).
        cache: "force-cache",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data from Google Sheets");
      }

      const data = await response.json();

      interface GoogleSheetResponse {
        range: string;
        majorDimension: string;
        values?: (string | number | null)[][];
      }

      type SheetRow = (string | number | null)[];

      const sheetData: GoogleSheetResponse = data;

      return sheetData.values?.filter((row: SheetRow) => {
        return row && row.some((cell) => cell && String(cell).trim() !== "");
      });
    } catch (error) {
      console.error("The API returned an error:", error);
      throw new Error("failed to get the data");
    }
  }
);
