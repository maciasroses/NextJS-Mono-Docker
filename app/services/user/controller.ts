"use server";

import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { create, read } from "./model";
import { validateUser } from "./schema";
import { redirect } from "next/navigation";
import createLog from "@/app/utils/createLog";
import { JWTPayload, SignJWT, jwtVerify } from "jose";
import type {
  LoginStateProps,
  RegisterStateProps,
  UserProps,
} from "@/app/interfaces";

const SESSION_SECRET = process.env.SESSION_SECRET;
if (!SESSION_SECRET) throw new Error("SESSION_SECRET is not set");
const SESSION_SECRET_ENCODED = new TextEncoder().encode(SESSION_SECRET);

async function encrypt(payload: JWTPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SESSION_SECRET_ENCODED);
}

async function decrypt(token: string): Promise<any> {
  const { payload } = await jwtVerify(token, SESSION_SECRET_ENCODED, {
    algorithms: ["HS256"],
  });
  return payload;
}

async function createUserSession(userId: string, role: string) {
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
  const session = await encrypt({ userId, role, expires });
  cookies().set("session", session, { expires, httpOnly: true });
}

export async function login(prevState: LoginStateProps, formData: FormData) {
  const dataToValidate = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const errors = validateUser("login", dataToValidate);

  if (Object.keys(errors).length !== 0) {
    return {
      errors,
      message: "",
    };
  }

  try {
    const user = await read({ email: dataToValidate.email as string });

    if (
      !user ||
      !(await bcrypt.compare(
        dataToValidate.password as string,
        (user as UserProps).password
      ))
    ) {
      await createLog({
        body: {
          level: "warning",
          message: "Invalid login",
          meta: {
            email: dataToValidate.email,
          },
        },
      });
      return { message: "Invalid mail or password" };
    }

    await createLog({
      body: {
        level: "info",
        message: "User logged in",
        meta: {
          userId: (user as UserProps).id,
        },
      },
    });

    await createUserSession((user as UserProps).id, (user as UserProps).role);
  } catch (error) {
    console.error(error);
    throw new Error("An internal error occurred");
  }
  const lng = formData.get("lang");
  redirect(`/${lng}/home`);
}

export async function register(
  prevState: RegisterStateProps,
  formData: FormData
) {
  const dataToValidate = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    role: formData.get("role"),
    secretKey: formData.get("secretKey"),
  };

  const errors = validateUser("register", dataToValidate);

  if (Object.keys(errors).length !== 0) {
    return {
      errors,
      message: "",
    };
  }

  if (dataToValidate.password !== dataToValidate.confirmPassword)
    return { message: "Passwords do not match" };

  if (
    dataToValidate.role === "admin" &&
    dataToValidate.secretKey !== process.env.ADMIN_SECRET_KEY
  )
    return { message: "Invalid secret key" };

  try {
    const userAlreadyExists = await read({
      email: dataToValidate.email as string,
    });
    if (userAlreadyExists) return { message: "User already exists" };

    const { confirmPassword, secretKey, ...data } = dataToValidate;

    const newUser = await create({ data });

    await createLog({
      body: {
        level: "info",
        message: "User registered",
        meta: {
          userId: newUser.id,
          user: {
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
          },
        },
      },
    });

    await createUserSession(
      (newUser as UserProps).id,
      (newUser as UserProps).role
    );
  } catch (error) {
    console.error(error);
    throw new Error("An internal error occurred");
  }
  const lng = formData.get("lang");
  redirect(`/${lng}/home`);
}

export async function logout() {
  try {
    await createLog({
      body: {
        level: "info",
        message: "User logged out",
        meta: {
          userId: (await getSession()).userId,
        },
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("An internal error occurred");
  }
  cookies().set("session", "", { expires: new Date(0) });
  redirect("/");
}

export async function getSession() {
  const session = cookies().get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function getUsers() {
  try {
    return await read({});
  } catch (error) {
    throw new Error("Failed to get users");
  }
}

export async function getUserById({ id }: { id: string }) {
  try {
    const user = await read({ id });
    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    throw new Error("Failed to get user");
  }
}

export async function getUserByEmail({ email }: { email: string }) {
  try {
    const user = await read({ email });
    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    throw new Error("Failed to get user");
  }
}

// export async function createUser({ body }: { body: unknown }) {
//   const data = validateUser(body);
//   if (!data.success) {
//     return data.error.message;
//   }
//   try {
//     return await create({ data: data.data });
//   } catch (error) {
//     throw new Error("Failed to create user");
//   }
// }

// export async function updateUser({ id, body }: { id: string; body: unknown }) {
//   const user = await read({ id });
//   if (!user) {
//     return null;
//   }
//   const data = validatePartialUser(body);
//   if (!data.success) {
//     return data.error.message;
//   }
//   try {
//     return await update({ id, data: data.data });
//   } catch (error) {
//     throw new Error("Failed to update user");
//   }
// }

// export async function deleteUser({ id }: { id: string }) {
//   const user = await read({ id });
//   if (!user) {
//     return null;
//   }
//   try {
//     return await deleteById({ id });
//   } catch (error) {
//     throw new Error("Failed to delete user");
//   }
// }
// ------------------------------------------------------------

// export async function updateSession(req: NextRequest) {
//   const session = req.cookies.get("session")?.value;
//   if (!session) return;

//   const parsed = await decrypt(session);
//   parsed.expires = new Date(parsed.exp * 1000);
//   const res = NextResponse.next();
//   res.cookies.set({
//     name: "session",
//     value: await encrypt(parsed),
//     expires: parsed.expires,
//     httpOnly: true,
//     sameSite: "lax",
//     secure: process.env.NODE_ENV === "production",
//   });
//   return res;
// }
