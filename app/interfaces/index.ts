export interface UserProps {
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AccountingProps {
  id: string;
  date: Date;
  description: string;
  amount: number;
  currency: string;
  type: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchParams {
  q?: string;
  currency?: string;
  type?: string;
  page?: string;
  pageSize?: string;
}

export interface AccountingListProps {
  accountings: AccountingProps[];
  totalPages: number;
}

export interface AccountingIdProps {
  params: { lng: string; id: string };
}

export interface BaseLangPageProps {
  params: {
    lng: string;
  };
}

export interface RegisterStateProps {
  message: string;
  errors?: {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    role?: string;
    secretKey?: string;
  };
}

export interface LoginStateProps {
  message: string;
  errors?: {
    email?: string;
    password?: string;
  };
}

export interface CreateNUpdateAccountingStateProps {
  errors: {
    date?: string;
    description?: string;
    amount?: string;
    currency?: string;
    type?: string;
  };
}

export interface SearchParamsForBarChart {
  currencyToTake?: string;
}

export interface AccountingsForBarChartProps {
  amount: number;
  id: string;
  date: Date;
  type: string;
}
