import { sql } from "@vercel/postgres";
import { NextResponse, NextRequest } from "next/server";

export const GET = async () => {
  try {
    const data = await sql`SELECT title, detail,imageUrl FROM additem`;
    console.log("Your IDS are", data);

    return NextResponse.json({
      data,
    });
  } catch (error: any) {
    console.log("Error occured while getting data", error.message);
  }
};

export const dynamic = "force-dynamic";
export const revalidate = 0;
