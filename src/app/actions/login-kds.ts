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

type ActionResult = { success: true } | { success: false; error: string };

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

  // 2. Busca o restaurante para garantir o isolamento multi-tenant
  const restaurant = await db.restaurant.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!restaurant) {
    return { success: false, error: "Estabelecimento não encontrado." };
  }

  // 3. Busca o operador ativo no banco
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

  // 4. Validação do PIN (Compara o hash ou o valor cadastrado)
  // Nota: Se você usou bcrypt/argon2 no cadastro, substitua por bcrypt.compareSync(pin, user.pinHash)
  if (user.pinHash !== pin) {
    return { success: false, error: "PIN incorreto." };
  }

  // 5. Gera o Token JWT com a biblioteca jose
  const token = await new SignJWT({
    userId: user.id,
    restaurantId: restaurant.id,
    role: user.role,
    name: user.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h") // Sessão do turno da cozinha (12 horas)
    .sign(JWT_SECRET);

  // 6. Grava o cookie HTTP-only seguro
  const cookieStore = await cookies();
  cookieStore.set("kds_token", token, {
    httpOnly: true, // Protege contra XSS (JS no browser não acessa)
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12, // 12 horas em segundos
  });

  return { success: true };
}
