import { sql } from "@vercel/postgres";
import { NextResponse, NextRequest } from "next/server";

export const DELETE = async (
  req: NextRequest,
  params: { params: { slug: string } }
) => {
  try {
    const data = await sql`DELETE FROM additem WHERE id = ${Number(
      params.params.slug
    )} RETURNING *`;

    {
      console.log(params.params);
      return NextResponse.json({ params });
    }
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(error);
  }
  //   try {
  //     // const res = await request.json();
  //     // console.log(res.id);

  //     // console.log(data);

  //     // return NextResponse.json({
  //     //   message: "Deleted Successfully",
  //     //   data,
  //     });
  //   } catch (error: any) {
  //     console.log(error.message);
  //     return NextResponse.json({ error: error.message });
  //   }
};
