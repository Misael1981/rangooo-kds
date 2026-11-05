"use server";

import { cookies } from "next/headers";
import { db } from "@/lib/prisma";
import { SignJWT } from "jose";
import { z } from "zod";

const kdsLoginSchema = z.object({
  username: z.string().min(1, "Informe o usuário"),
  pin: z.string().min(4, "PIN inválido").max(6, "PIN inválido"),
});

export type KdsLoginInput = z.infer<typeof kdsLoginSchema>;

type ActionResult =
  | { success: true; userId: string }
  | { success: false; error: string };

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

export async function loginKds(
  slug: string,
  input: KdsLoginInput,
): Promise<ActionResult> {
  // 1. Validação no Servidor
  const parsed = kdsLoginSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Dados de login inválidos." };
  }

  const { username, pin } = parsed.data;

  // 2. Busca o restaurante
  const restaurant = await db.restaurant.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!restaurant) {
    return { success: false, error: "Estabelecimento não encontrado." };
  }

  // 3. Busca o operador
  const user = await db.kdsUser.findUnique({
    where: {
      restaurantId_username: {
        restaurantId: restaurant.id,
        username,
      },
    },
  });

  if (!user || !user.active) {
    return { success: false, error: "Usuário não encontrado ou inativo." };
  }

  if (user.pinHash !== pin) {
    return { success: false, error: "PIN incorreto." };
  }

  // 4. Gera o Token JWT
  const token = await new SignJWT({
    userId: user.id,
    restaurantId: restaurant.id,
    role: user.role,
    name: user.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(JWT_SECRET);

  // 5. Grava o cookie
  const cookieStore = await cookies();
  cookieStore.set("kds_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return { success: true, userId: user.id };
}
