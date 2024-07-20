import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (request: NextRequest) => {
  try {
    const res = await request.json();
    const data =
      await sql`UPDATE additem SET title=${res.title}, detail=${res.detail},imageUrl=${res.imageUrl} WHERE id=${res.id} `;

    console.log("data is this", data);
    console.log("response of update is ", res);

    return NextResponse.json({
      message: "Updated Successfully",
      data,
    });
  } catch (error: any) {
    console.log("Error in updating", error.message);
  }
};
