// app/api/dashboard/stats/route.ts
import { getInterviewStats } from "@/backend/controllers/interview.controller";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const res = await getInterviewStats(request);

    if (res?.error) {
      return NextResponse.json(
        { error: { message: res?.error?.message } },
        { status: res.error?.statusCode || 500 }
      );
    }

    return NextResponse.json({ data: res }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: { message: "Internal Server Error" } },
      { status: 500 }
    );
  }
} 