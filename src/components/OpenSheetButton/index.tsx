"use client";

import { EllipsisVertical } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import SheetKds from "../SheetKds";

type OpenSheetButtonProps = {
  slug: string;
};

const OpenSheetButton = ({ slug }: OpenSheetButtonProps) => {
  const [isOpenSheet, setIsOpenSheet] = useState(false);

  const handleSheet = () => {
    setIsOpenSheet(true);
  };

  return (
    <>
      <Button variant="outline" onClick={handleSheet}>
        <EllipsisVertical />
      </Button>

      {isOpenSheet && (
        <SheetKds
          open={isOpenSheet}
          onOpenChange={setIsOpenSheet}
          slug={slug}
        />
      )}
    </>
  );
};

export default OpenSheetButton;
