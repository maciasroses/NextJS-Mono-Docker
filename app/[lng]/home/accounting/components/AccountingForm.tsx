"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import {
  createAccount,
  updateAccount,
} from "@/app/services/accounting/controller";
import type {
  AccountingProps,
  CreateNUpdateAccountingStateProps,
  UserProps,
} from "@/app/interfaces";
import formatDateForDateInput from "@/app/utils/formatDate-dateInput";
import { useAuth } from "@/app/providers/AuthContext";

const AccountingForm = ({
  lng,
  accounting,
  isEditing,
}: {
  lng: string;
  accounting?: AccountingProps;
  isEditing?: boolean;
}) => {
  const { user } = useAuth();
  const initialState: CreateNUpdateAccountingStateProps = {
    errors: {},
  };
  const [state, formAction] = useFormState(
    isEditing ? updateAccount : createAccount,
    initialState
  );
  const { errors } = state ?? {};

  return (
    <div className="flex flex-col items-center gap-4 dark:text-white">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-4xl">
          {isEditing ? "Edit Accounting" : "Create an Accounting"}
        </h1>
      </div>
      <form action={formAction}>
        <div className="flex flex-col gap-4 text-xl max-w-[500px]">
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <div className="flex flex-col gap-2 w-full sm:w-1/2">
              <label htmlFor="amount">Amount</label>
              <input
                type="number"
                name="amount"
                id="amount"
                placeholder="Your amount"
                defaultValue={accounting?.amount ?? ""}
                className={`border block w-full p-2.5 text-sm rounded-lg dark:bg-gray-700 ${
                  errors?.amount
                    ? "bg-red-50 border-red-500 text-red-900 dark:text-red-400 placeholder-red-700 dark:placeholder-red-500 focus:ring-red-500 focus:border-red-500"
                    : "bg-gray-50 border-gray-300 text-gray-900 dark:text-white dark:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                }`}
              />
              {errors?.amount && (
                <small className="text-red-600">{errors?.amount}</small>
              )}
            </div>
            <div className="flex flex-col gap-2 w-full sm:w-1/2">
              <label htmlFor="currency">Currency</label>
              <select
                name="currency"
                id="currency"
                defaultValue={accounting?.currency ?? ""}
                className={`border block w-full p-2.5 text-sm rounded-lg dark:bg-gray-700 ${
                  errors?.currency
                    ? "bg-red-50 border-red-500 text-red-900 dark:text-red-400 placeholder-red-700 dark:placeholder-red-500 focus:ring-red-500 focus:border-red-500"
                    : "bg-gray-50 border-gray-300 text-gray-900 dark:text-white dark:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                }`}
              >
                <option value="">Select a currency</option>
                <option value="USD">USD</option>
                <option value="MXN">MXN</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
              {errors?.currency && (
                <small className="text-red-600">{errors?.currency}</small>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <div className="flex flex-col gap-2 w-full sm:w-1/2">
              <label htmlFor="date">Date</label>
              <input
                type="date"
                name="date"
                id="date"
                placeholder="Your date"
                defaultValue={
                  accounting?.date
                    ? formatDateForDateInput(accounting.date)
                    : ""
                }
                className={`border block w-full p-2.5 text-sm rounded-lg dark:bg-gray-700 ${
                  errors?.date
                    ? "bg-red-50 border-red-500 text-red-900 dark:text-red-400 placeholder-red-700 dark:placeholder-red-500 focus:ring-red-500 focus:border-red-500"
                    : "bg-gray-50 border-gray-300 text-gray-900 dark:text-white dark:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                }`}
              />
              {errors?.date && (
                <small className="text-red-600">{errors?.date}</small>
              )}
            </div>
            <div className="flex flex-col gap-2 w-full sm:w-1/2">
              <label htmlFor="type">Type</label>
              <select
                name="type"
                id="type"
                defaultValue={accounting?.type ?? ""}
                className={`border block w-full p-2.5 text-sm rounded-lg dark:bg-gray-700 ${
                  errors?.type
                    ? "bg-red-50 border-red-500 text-red-900 dark:text-red-400 placeholder-red-700 dark:placeholder-red-500 focus:ring-red-500 focus:border-red-500"
                    : "bg-gray-50 border-gray-300 text-gray-900 dark:text-white dark:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                }`}
              >
                <option value="">Select a type</option>
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
                <option value="Transfer">Transfer</option>
              </select>
              {errors?.type && (
                <small className="text-red-600">{errors?.type}</small>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              id="description"
              placeholder="Your description"
              defaultValue={accounting?.description ?? ""}
              className={`border block w-full p-2.5 text-sm rounded-lg dark:bg-gray-700 ${
                errors?.description
                  ? "bg-red-50 border-red-500 text-red-900 dark:text-red-400 placeholder-red-700 dark:placeholder-red-500 focus:ring-red-500 focus:border-red-500"
                  : "bg-gray-50 border-gray-300 text-gray-900 dark:text-white dark:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
              }`}
            />
            {errors?.description && (
              <small className="text-red-600">{errors?.description}</small>
            )}
          </div>
        </div>
        <input hidden name="userId" defaultValue={(user as UserProps)?.id} />
        <input hidden name="lang" defaultValue={lng} />
        <input hidden name="accountingId" defaultValue={accounting?.id ?? ""} />
        <div className="flex justify-center items-center gap-2 mt-4">
          <Link
            className="px-4 py-2 bg-gray-300 text-gray-400 dark:bg-gray-600 dark:text-gray-400 rounded-md w-auto"
            href={`${
              accounting?.id
                ? `/${lng}/home/accounting/${accounting.id}`
                : `/${lng}/home/accounting`
            }`}
          >
            Cancel
          </Link>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md w-auto"
            type="submit"
          >
            {isEditing ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountingForm;
