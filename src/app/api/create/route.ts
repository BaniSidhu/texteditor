import { sql } from "@vercel/postgres";
import { NextResponse, NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const res = await request.json();
    console.log(res);

    const data =
      await sql`INSERT INTO additem(title,detail,imageUrl) VALUES(${res.title},${res.detail},${res.imageUrl})  RETURNING *`;
    console.log(data);

    return NextResponse.json({
      title: "",
      detail: "",
      imageUrl: "",

      data: data.rows[0],
    });
  } catch (error: any) {
    return NextResponse.json({ error, message: error.message });
    console.log(error.message);
  }
};
