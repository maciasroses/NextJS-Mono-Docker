import { Suspense } from "react";
import { useTranslation } from "@/app/i18n";
import {
  SearchBar,
  Pagination,
  AccountingList,
  AccountingListSkeleton,
} from "./components";
import { getAccounts } from "@/app/services/accounting/controller";
import type {
  AccountingListProps,
  BaseLangPageProps,
  SearchParams,
} from "@/app/interfaces";

interface AccountingPageProps extends BaseLangPageProps {
  searchParams?: SearchParams;
}

const AccountingPage = async ({
  searchParams,
  params: { lng },
}: AccountingPageProps) => {
  const { t } = await useTranslation(lng, "accounting");
  const searchbarProps = JSON.parse(t("searchBar"));

  const {
    q = "",
    currency = "",
    type = "",
    page = "1",
    pageSize = "9",
  } = searchParams || {};

  const searchParamsForList = {
    q,
    currency,
    type,
    page,
    pageSize,
  };

  const { totalPages } = (await getAccounts(
    searchParamsForList
  )) as AccountingListProps;

  return (
    <>
      <SearchBar searchbarProps={searchbarProps} />
      <Suspense
        key={q + currency + type + page}
        fallback={<AccountingListSkeleton />}
      >
        <AccountingList lng={lng} searchParams={searchParamsForList} />
      </Suspense>
      <Pagination totalPages={totalPages} />
    </>
  );
};

export default AccountingPage;
