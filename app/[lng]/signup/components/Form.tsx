"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import SubmitButton from "@/app/components/SubmitButton";
import { register } from "@/app/services/user/controller";
import type { RegisterStateProps } from "@/app/interfaces";

const Form = ({ lng }: { lng: string }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialState: RegisterStateProps = { message: "", errors: {} };
  const [state, formAction] = useFormState(register, initialState);
  const { errors } = state ?? {};
  const [isAdmin, setIsAdmin] = useState(false);

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setIsAdmin(event.target.value === "admin");
  };

  const handleChangeIsSearching = (value: boolean) => {
    setIsSubmitting(value);
  };

  return (
    <>
      <div className="flex flex-col items-center gap-2">
        <h1 className=" text-6xl">Sign Up</h1>
        {state?.message && <p className="text-red-600">{state?.message}</p>}
      </div>
      <form action={formAction}>
        <fieldset disabled={isSubmitting}>
          <div className="flex flex-col gap-4 text-xl max-w-[500px]">
            <div className="flex gap-4 w-full">
              <div className="flex flex-col gap-2 w-1/2">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Your Name"
                  className={`border block w-full p-2.5 text-sm rounded-lg dark:bg-gray-700 ${
                    errors?.name
                      ? "bg-red-50 border-red-500 text-red-900 dark:text-red-400 placeholder-red-700 dark:placeholder-red-500 focus:ring-red-500 focus:border-red-500"
                      : "bg-gray-50 border-gray-300 text-gray-900 dark:text-white dark:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                />
                {errors?.name && (
                  <small className="text-red-600">{errors?.name}</small>
                )}
              </div>
              <div className="flex flex-col gap-2 w-1/2">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="email@test.com"
                  className={`border block w-full p-2.5 text-sm rounded-lg dark:bg-gray-700 ${
                    errors?.email
                      ? "bg-red-50 border-red-500 text-red-900 dark:text-red-400 placeholder-red-700 dark:placeholder-red-500 focus:ring-red-500 focus:border-red-500"
                      : "bg-gray-50 border-gray-300 text-gray-900 dark:text-white dark:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                />
                {errors?.email && (
                  <small className="text-red-600">{errors?.email}</small>
                )}
              </div>
            </div>

            <div className="flex gap-4 w-full">
              <div className="flex flex-col gap-2 w-1/2">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="password"
                  className={`border block w-full p-2.5 text-sm rounded-lg dark:bg-gray-700 ${
                    errors?.password
                      ? "bg-red-50 border-red-500 text-red-900 dark:text-red-400 placeholder-red-700 dark:placeholder-red-500 focus:ring-red-500 focus:border-red-500"
                      : "bg-gray-50 border-gray-300 text-gray-900 dark:text-white dark:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                />
                {errors?.password && (
                  <small className="text-red-600">{errors?.password}</small>
                )}
              </div>
              <div className="flex flex-col gap-2 w-1/2">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="Confirm password"
                  className={`border block w-full p-2.5 text-sm rounded-lg dark:bg-gray-700 ${
                    errors?.confirmPassword
                      ? "bg-red-50 border-red-500 text-red-900 dark:text-red-400 placeholder-red-700 dark:placeholder-red-500 focus:ring-red-500 focus:border-red-500"
                      : "bg-gray-50 border-gray-300 text-gray-900 dark:text-white dark:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                />
                {errors?.confirmPassword && (
                  <small className="text-red-600">
                    {errors?.confirmPassword}
                  </small>
                )}
              </div>
            </div>

            <div className="flex gap-4 w-full">
              <div className="flex flex-col gap-2 w-1/2">
                <label htmlFor="role">Role</label>
                <select
                  name="role"
                  id="role"
                  onChange={handleRoleChange}
                  className={`border block w-full p-2.5 text-sm rounded-lg dark:bg-gray-700 ${
                    errors?.role
                      ? "bg-red-50 border-red-500 text-red-900 dark:text-red-400 placeholder-red-700 dark:placeholder-red-500 focus:ring-red-500 focus:border-red-500"
                      : "bg-gray-50 border-gray-300 text-gray-900 dark:text-white dark:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                {errors?.role && (
                  <small className="text-red-600">{errors?.role}</small>
                )}
              </div>
              {isAdmin && (
                <div className="flex flex-col gap-2 w-1/2">
                  <label htmlFor="secretKey">Admin Secret Key</label>
                  <input
                    type="password"
                    name="secretKey"
                    id="secretKey"
                    placeholder="Secret key for admin"
                    className={`border block w-full p-2.5 text-sm rounded-lg dark:bg-gray-700 ${
                      errors?.secretKey
                        ? "bg-red-50 border-red-500 text-red-900 dark:text-red-400 placeholder-red-700 dark:placeholder-red-500 focus:ring-red-500 focus:border-red-500"
                        : "bg-gray-50 border-gray-300 text-gray-900 dark:text-white dark:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                  />
                  {errors?.secretKey && (
                    <small className="text-red-600">{errors?.secretKey}</small>
                  )}
                </div>
              )}
            </div>
          </div>
          <input type="text" hidden name="lang" defaultValue={lng} />
          <div className="text-center">
            <SubmitButton
              title="Log in"
              handleChangeIsSearching={handleChangeIsSearching}
            />
          </div>
        </fieldset>
      </form>
    </>
  );
};

export default Form;
