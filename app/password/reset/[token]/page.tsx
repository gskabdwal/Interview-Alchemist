import ResetPassword from "@/components/auth/ResetPassword";
import React from "react";

const ResetPasswordPage = async ({
  params,
}: {
  params: Promise<{ token: string }>;
}) => {
  const { token } = await params;
  return <ResetPassword token={token} />;
};

export default ResetPasswordPage;
