import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/app/services/user/controller";
import { AccountingForm } from "@/app/[lng]/home/accounting/components";
import type { BaseLangPageProps } from "@/app/interfaces";

const AccountingCreatePage = async ({ params: { lng } }: BaseLangPageProps) => {
  const userSession = await getSession();
  if (userSession.role !== "admin") redirect(`/${lng}/home/accounting`);

  return <AccountingForm lng={lng} />;
};

export default AccountingCreatePage;
