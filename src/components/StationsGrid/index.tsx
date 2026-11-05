import Link from "next/link";
import { Card } from "../ui/card";
import { Clock3, ChevronRight, ClipboardList } from "lucide-react";

type StationsGridProps = {
  slug: string;
  userId: string;
  stations: {
    name: string;
    id: string;
    order: number;
    active: boolean;
    estimatedMinutes: number;
  }[];
};

const StationsGrid = ({ stations, slug, userId }: StationsGridProps) => {
  if (stations.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center gap-3 py-12 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <ClipboardList className="size-6 text-muted-foreground" />
        </div>

        <div className="space-y-1">
          <p className="font-medium">Nenhuma operação disponível</p>
          <p className="text-sm text-muted-foreground">
            Não existem etapas de produção ativas no momento.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {stations
        .filter((station) => station.active)
        .map((station) => (
          <Link
            key={station.id}
            href={`/${slug}/${userId}/${station.id}`}
            className="group"
          >
            <Card className="flex-row items-center gap-3 p-4 transition-all hover:border-primary/50 hover:shadow-md">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-semibold tabular-nums text-primary">
                {String(station.order).padStart(2, "0")}
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <p className="truncate font-semibold">{station.name}</p>

                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock3 className="size-3.5" />
                  <span>{station.estimatedMinutes} min estimados</span>
                </div>
              </div>

              <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </Card>
          </Link>
        ))}
    </div>
  );
};

export default StationsGrid;
