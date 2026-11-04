// app/actions/kds/logout-kds.ts
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logoutKds(slug: string) {
  const cookieStore = await cookies();

  // Apaga o cookie do KDS
  cookieStore.delete("kds_token");

  redirect(`/${slug}/login`);
}
