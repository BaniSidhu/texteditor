import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (request: NextRequest) => {
  try {
    const res = await request.json();
    const data =
      await sql`UPDATE additem SET title=${res.title}, detail=${res.detail} WHERE id=${res.id} `;

    return NextResponse.json({
      message: "Updated Successfully",
      data,
    });
  } catch (error: any) {
    console.log("Error in updating", error.message);
  }
};
