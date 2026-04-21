import { NextResponse } from "next/server";
import { buildExport } from "@/lib/dataExchange";

export async function GET() {
  const bundle = await buildExport();
  return NextResponse.json(bundle, {
    headers: {
      "Content-Disposition": `attachment; filename=shelf-export-${new Date().toISOString().slice(0, 10)}.json`,
    },
  });
}
