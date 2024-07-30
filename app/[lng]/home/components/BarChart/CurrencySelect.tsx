"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const CurrencySelect = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSelect = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(key, value);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap justify-end">
      <div className="flex items-center me-4">
        <input
          aria-label="Currency USD"
          id="usd"
          name="currencyToTake"
          type="radio"
          onChange={(e) => handleSelect("currencyToTake", e.target.id)}
          defaultChecked={
            searchParams.get("currencyToTake") === "usd" ||
            !searchParams.get("currencyToTake")
          }
          className="w-4 h-4"
        />
        <label
          htmlFor="usd"
          className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          USD
        </label>
      </div>
      <div className="flex items-center me-4">
        <input
          aria-label="Currency MXN"
          id="mxn"
          name="currencyToTake"
          type="radio"
          onChange={(e) => handleSelect("currencyToTake", e.target.id)}
          defaultChecked={searchParams.get("currencyToTake") === "mxn"}
          className="w-4 h-4"
        />
        <label
          htmlFor="mxn"
          className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          MXN
        </label>
      </div>
      <div className="flex items-center me-4">
        <input
          aria-label="Currency EUR"
          id="eur"
          name="currencyToTake"
          type="radio"
          onChange={(e) => handleSelect("currencyToTake", e.target.id)}
          defaultChecked={searchParams.get("currencyToTake") === "eur"}
          className="w-4 h-4"
        />
        <label
          htmlFor="eur"
          className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          EUR
        </label>
      </div>
      <div className="flex items-center me-4">
        <input
          aria-label="Currency GBP"
          id="gbp"
          name="currencyToTake"
          type="radio"
          onChange={(e) => handleSelect("currencyToTake", e.target.id)}
          defaultChecked={searchParams.get("currencyToTake") === "gbp"}
          className="w-4 h-4"
        />
        <label
          htmlFor="gbp"
          className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          GBP
        </label>
      </div>
    </div>
  );
};

export default CurrencySelect;
