import AccountingCard from "./AccountingCard";
import { Card404 } from "@/app/components";
import { getAccounts } from "@/app/services/accounting/controller";
import type { AccountingListProps, SearchParams } from "@/app/interfaces";

interface AccountingListPageProps {
  searchParams: SearchParams;
  lng: string;
}

const AccountingList = async ({
  searchParams,
  lng,
}: AccountingListPageProps) => {
  const { accountings } = (await getAccounts(
    searchParams
  )) as AccountingListProps;

  return (
    <>
      {accountings.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
          {accountings.map((accounting) => (
            <AccountingCard
              key={accounting.id}
              lng={lng}
              accounting={accounting}
            />
          ))}
        </div>
      ) : (
        <Card404
          title={
            lng === "en"
              ? "Accountings were not found with this search"
              : "No se encontraron contabilidades con esta búsqueda"
          }
          description={
            lng === "en" ? "Try another search" : "Intenta otra búsqueda"
          }
        />
      )}
    </>
  );
};

export default AccountingList;
