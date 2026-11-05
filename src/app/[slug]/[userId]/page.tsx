import BreadcrumbKDS from "@/components/BreadcrumbKDS";
import ModeToggle from "@/components/ModeToggle";
import OpenSheetButton from "@/components/OpenSheetButton";
import StationsGrid from "@/components/StationsGrid";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/prisma";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

interface ContributorHomePageProps {
  params: Promise<{
    slug: string;
    userId: string;
  }>;
}

export default async function ContributorHomePage({
  params,
}: ContributorHomePageProps) {
  const { slug, userId } = await params;

  const userKds = await db.kdsUser.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      active: true,
      role: true,
      restaurant: {
        select: {
          id: true,
          name: true,
          kdsStations: {
            select: {
              id: true,
              name: true,
              order: true,
              active: true,
              estimatedMinutes: true,
            },
          },
        },
      },
    },
  });

  if (!userKds) {
    notFound();
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("kds_token")?.value;

  if (!token) {
    redirect(`/${slug}/login`);
  }

  const activeStations = userKds.restaurant.kdsStations.filter(
    (station) => station.active,
  );

  return (
    <div className="page-bg">
      <div className="relative z-10 min-h-screen p-4 md:p-6 space-y-8">
        <header className="flex items-center justify-between pb-4 border-b">
          <BreadcrumbKDS />

          <div className="flex items-center gap-2">
            <ModeToggle />
            <OpenSheetButton slug={slug} />
          </div>
        </header>

        <main className="max-w-6xl mx-auto space-y-8">
          <section className="space-y-2">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">
                {userKds.restaurant.name}
              </p>

              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Olá, {userKds.name}!
              </h1>

              <p className="text-muted-foreground">
                Selecione uma operação para começar seu trabalho.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Badge variant="secondary">
                {activeStations.length}{" "}
                {activeStations.length === 1
                  ? "operação disponível"
                  : "operações disponíveis"}
              </Badge>
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Etapas de produção</h2>
              <p className="text-sm text-muted-foreground">
                Escolha a estação em que deseja trabalhar.
              </p>
            </div>

            <StationsGrid
              slug={slug}
              userId={userId}
              stations={activeStations}
            />
          </section>
        </main>
      </div>
    </div>
  );
}
