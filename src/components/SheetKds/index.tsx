"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { LogoutButton } from "../LogoutButton";

type SheetKdsProps = {
  open: boolean;
  onOpenChange: (nextOpen: boolean) => void;
  slug: string;
};
const SheetKds = ({ open, onOpenChange, slug }: SheetKdsProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>

        <SheetFooter>
          <LogoutButton slug={slug} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default SheetKds;
