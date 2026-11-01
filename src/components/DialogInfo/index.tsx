"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";

type DialogInfoProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  message?: string;
  title: string;
  icon?: React.ReactNode;
  className?: string;
};

const DialogInfo = ({
  isOpen,
  onOpenChange,
  message,
  title,
  icon,
  className,
}: DialogInfoProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="space-y-3">
          <div
            className={`mx-auto inline-flex size-12 items-center justify-center rounded-md ${className}`}
          >
            {icon}
          </div>
          <DialogTitle className="text-center text-xl">{title}</DialogTitle>
        </DialogHeader>

        <div>
          {message && <p className="text-center text-md">{message}</p>}

          <DialogDescription className="text-center">
            Procure o responsável pelo setor.
          </DialogDescription>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            Tentar Novamente
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogInfo;
