import Interview from "@/components/interview/Interview";
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

const InterviewConductPage = async ({
  params,
}: {
  params: any;
}) => {
  const { id } = await params;

  const data = await getInterview(id);

  if (data?.interview?.status === "completed") {
    throw new Error("Interview has already been completed");
  }

  return <Interview interview={data?.interview} />;
};

export default InterviewConductPage;
