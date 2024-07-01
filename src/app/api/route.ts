import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export const GET = async () => {
  const data = await sql`SELECT * FROM additem`;
  return NextResponse.json({
    detail: "",
    data,
  });
};
