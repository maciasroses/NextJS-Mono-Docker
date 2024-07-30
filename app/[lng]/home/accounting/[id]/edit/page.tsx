import { notFound, redirect } from "next/navigation";
import { getSession } from "@/app/services/user/controller";
import { getAccountById } from "@/app/services/accounting/controller";
import { AccountingForm } from "@/app/[lng]/home/accounting/components";
import type { AccountingIdProps, AccountingProps } from "@/app/interfaces";

const AccountingEditPage = async ({
  params: { lng, id },
}: AccountingIdProps) => {
  const userSession = await getSession();
  if (userSession.role !== "admin") redirect(`/${lng}/home/accounting/${id}`);

  const accounting = (await getAccountById({ id })) as AccountingProps;

  if (!accounting) notFound();

  return <AccountingForm lng={lng} accounting={accounting} isEditing />;
};

export default AccountingEditPage;
