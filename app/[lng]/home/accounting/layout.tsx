import Link from "next/link";
import { useTranslation } from "@/app/i18n";
import { getSession } from "@/app/services/user/controller";
import type { BaseLangPageProps } from "@/app/interfaces";

interface AccountingLayout extends BaseLangPageProps {
  children: React.ReactNode;
}

const AccountingLayout = async ({
  children,
  params: { lng },
}: AccountingLayout) => {
  const userSession = await getSession();

  const { t } = await useTranslation(lng, "accounting");
  return (
    <>
      <div className="relative w-full">
        <Link href={`/${lng}/home/accounting`}>
          <h1
            className={`text-4xl md:text-6xl text-center dark:text-white ${
              userSession.role === "admin" && "pt-16"
            }`}
          >
            {t("title")}
          </h1>
        </Link>
        {userSession.role === "admin" && (
          <Link href={`/${lng}/home/accounting/create`}>
            <button className="absolute top-0 right-0 mt-4 mr-4 bg-blue-500 text-white px-4 py-2 rounded-lg">
              Create
            </button>
          </Link>
        )}
      </div>
      <p className="text-2xl md:text-xl text-center dark:text-white">
        {t("description")}
      </p>
      {children}
    </>
  );
};

export default AccountingLayout;
