import ResultDetails from "@/components/result/ResultDetails";
import { getAuthHeader } from "@/helpers/auth";
import { cookies } from "next/headers";

async function getInterview(id: string) {
  try {
    const nextCookies = await cookies();
    const authHeader = getAuthHeader(nextCookies);

    const response = await fetch(
      `${process.env?.NEXT_PUBLIC_APP_URL}/api/interviews/${id}`,
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

const ResultDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const data = await getInterview(id);

  if (!data?.interview) {
    throw new Error("Interview not found");
  }

  return <ResultDetails interview={data?.interview} />;
};

export default ResultDetailsPage;
