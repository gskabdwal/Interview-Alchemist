import ListInterviews from "@/components/interview/ListInterviews";
import { getAuthHeader } from "@/helpers/auth";
import { cookies } from "next/headers";
import React from "react";

async function getInterviews(searchParams: string) {
  try {
    const urlParams = new URLSearchParams(searchParams);
    const queryStr = urlParams.toString();

    const nextCookies = await cookies();
    const authHeader = getAuthHeader(nextCookies);

    const response = await fetch(
      `${process.env?.NEXT_PUBLIC_APP_URL}/api/admin/interviews?${queryStr}`,
      authHeader
    );

    if (!response.ok) {
      throw new Error("An error occurred while fetching the data");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(error?.message);
  }
}

const InterviewsPage = async ({
  searchParams,
}: {
  searchParams: Promise<string>;
}) => {
  const searchParamsValue = await searchParams;

  const data = await getInterviews(searchParamsValue);
  return <ListInterviews data={data} />;
};

export default InterviewsPage;
