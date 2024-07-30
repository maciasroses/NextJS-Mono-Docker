"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import createLog from "@/app/utils/createLog";
import { validateAccounting } from "./schema";
import { create, read, update, deleteById, readAll } from "./model";
import type {
  SearchParams,
  CreateNUpdateAccountingStateProps,
} from "@/app/interfaces";
import getExchangeRate from "@/app/utils/getExchangeRate";

export async function getAccounts({
  q,
  currency,
  type,
  page,
  pageSize,
}: SearchParams) {
  try {
    return await read({
      q,
      currency,
      type,
      page: Number(page),
      pageSize: Number(pageSize),
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get accounts");
  }
}

export async function getAccountById({ id }: { id: string }) {
  try {
    const accounting = await read({ id });
    if (!accounting) {
      // throw new Error("Accounting not found");
      return null;
    }
    return accounting;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get account");
  }
}

export async function getAllAccountsForBarChart({
  currencyToTake = "usd",
}: {
  currencyToTake?: string;
}) {
  let data = [];
  try {
    data = await readAll();
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get accounts");
  }

  const upperCurrency = currencyToTake.toUpperCase();

  const currencies = [
    ...new Set(data.map((item) => item.currency)),
    upperCurrency,
  ];

  const exchangeRates: { [key: string]: number } = {};

  for (const localCurrency of currencies) {
    if (localCurrency !== upperCurrency) {
      exchangeRates[localCurrency] = getExchangeRate(
        localCurrency,
        upperCurrency
      );
    }
    upperCurrency;
  }

  return data.map((item) => {
    const conversionRate =
      item.currency === upperCurrency ? 1 : exchangeRates[item.currency];
    const { description, userId, currency, createdAt, updatedAt, ...rest } =
      item;
    return {
      ...rest,
      amount: item.amount * conversionRate,
    };
  });
}

export async function createAccount(
  prevState: CreateNUpdateAccountingStateProps,
  formData: FormData
) {
  const data = {
    date: new Date(formData.get("date") as string),
    description: formData.get("description"),
    amount: Number(formData.get("amount")),
    currency: formData.get("currency"),
    type: formData.get("type"),
    userId: formData.get("userId"),
  };

  const errors = validateAccounting("create", data);

  if (Object.keys(errors).length !== 0) return { errors };

  try {
    await create({ data });
    await createLog({
      body: {
        level: "info",
        message: "Accounting created",
        meta: {
          userId: data.userId,
          accounting: data,
        },
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("An internal error occurred");
  }
  const lng = formData.get("lang");
  revalidatePath(`/${lng}/home/accounting`);
  redirect(`/${lng}/home/accounting`);
}

export async function updateAccount(
  prevState: CreateNUpdateAccountingStateProps,
  formData: FormData
) {
  const userId = formData.get("userId");
  const partialData = {
    date: new Date(formData.get("date") as string),
    description: formData.get("description"),
    amount: Number(formData.get("amount")),
    currency: formData.get("currency"),
    type: formData.get("type"),
    accountingId: formData.get("accountingId"),
  };

  const errors = validateAccounting("update", partialData);

  if (Object.keys(errors).length !== 0) return { errors };

  const { accountingId, ...data } = partialData;

  try {
    const accountingBefore = await read({ id: accountingId as string });
    const accountingAfter = await update({ id: accountingId as string, data });
    await createLog({
      body: {
        level: "info",
        message: "Accounting updated",
        meta: {
          userId: userId,
          accountingBefore,
          accountingAfter,
        },
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("An internal error occurred");
  }
  const lng = formData.get("lang");
  revalidatePath(`/${lng}/home/accounting`);
  redirect(`/${lng}/home/accounting`);
}

export async function deleteAccount(id: string, lng: string, userId: string) {
  try {
    await deleteById({ id });
    await createLog({
      body: {
        level: "info",
        message: "Accounting deleted",
        meta: {
          userId,
          accountingId: id,
        },
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("An internal error occurred");
  }
  revalidatePath(`/${lng}/home/accounting`);
  redirect(`/${lng}/home/accounting`);
}
