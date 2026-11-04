import { Card } from "../ui/card";

type StationsGridProps = {
  stations: {
    name: string;
    id: string;
    order: number;
    active: boolean;
    estimatedMinutes: number;
  }[];
};

const StationsGrid = ({ stations }: StationsGridProps) => {
  return (
    <>
      {stations.length === 0 ? (
        <div>
          <span>Nenhuma etapa cadastrada no sistema</span>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4 justify-center">
          {stations.map((station) => (
            <Card key={station.id} className="flex-row items-center gap-2 p-4">
              <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-lg text-sm font-semibold tabular-nums">
                {String(station.order).padStart(2, "0")}
              </div>
              <div>
                <p className="font-medium">{station.name}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
};

export default StationsGrid;
