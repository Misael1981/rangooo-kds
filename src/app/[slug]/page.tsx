import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import ModeToggle from "@/components/ModeToggle";
import BreadcrumbKDS from "@/components/BreadcrumbKDS";
import StationsGrid from "@/components/StationsGrid";
import OpenSheetButton from "@/components/OpenSheetButton";

interface KdsMainPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

export default async function KdsMainPage({ params }: KdsMainPageProps) {
  const { slug } = await params;

  // 1. Valida se o restaurante existe pelo slug
  const restaurant = await db.restaurant.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      kdsUsers: {
        select: {
          id: true,
          name: true,
        },
      },
      kdsStations: {
        select: {
          id: true,
          name: true,
          order: true,
          estimatedMinutes: true,
          active: true,
        },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!restaurant) {
    notFound();
  }

  // 2. Pega o token do cookie
  const cookieStore = await cookies();
  const token = cookieStore.get("kds_token")?.value;

  if (!token) {
    redirect(`/${slug}/login`);
  }

  // 3. Validação do token isolada no try/catch (sem JSX aqui dentro!)
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    // Trava de segurança multi-tenant
    if (payload.restaurantId !== restaurant.id) {
      redirect(`/${slug}/login`);
    }
  } catch (error) {
    // Se o token estiver expirado, inválido ou adulterado, redireciona
    console.log("Token inválido ou expirado:", error);
    redirect(`/${slug}/login`);
  }

  // 4. O JSX fica totalmente fora do try/catch, limpo e seguro!
  return (
    <div className="page-bg">
      <div className="relative z-10 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <BreadcrumbKDS />
          <div className="flex items-center gap-2">
            <ModeToggle />
            <OpenSheetButton slug={slug} />
          </div>
        </div>
        <h1 className="text-2xl font-bold">Painel KDS - {restaurant.name}</h1>

        <StationsGrid stations={restaurant.kdsStations} />
      </div>
    </div>
  );
}
