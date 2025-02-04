import React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  DialogDrawer,
  DialogDrawerTrigger,
  DialogDrawerClose,
  DialogDrawerContent,
  DialogDrawerDescription,
  DialogDrawerFooter,
  DialogDrawerHeader,
  DialogDrawerTitle,
} from "@/components/ui/dialogdrawer";
import { cn } from "@/lib/utils";

import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ["latin"] });

interface DrawerDialogProps {
  children: React.ReactNode;
  triggerButton?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  title?: string;
  className?: string;
  description?: string;
  dialog: {
    triggerProps: {
      ref: React.RefObject<HTMLButtonElement>;
      onClick: () => void;
    };
    dialogProps: {
      open: boolean;
      onOpenChange: (open: boolean) => void;
    };
    trigger: () => void;
    dismiss: () => void;
  };
  noX?: boolean;
}

/**
 * DrawerDialog component that renders a responsive dialog drawer.
 * 
 * @param {React.ReactNode} mobileContent - The content to display on mobile devices.
 * @param {React.ReactNode} children - The content to display on desktop devices.
 * @param {React.ReactNode} [triggerButton] - Optional custom trigger button for opening the drawer.
 * @param {React.ReactNode} [header] - Optional custom header content for the drawer.
 * @param {React.ReactNode} [footer] - Optional custom footer content for the drawer.
 * @param {string} [className] - Optional class name to apply to the drawer.
 * @param {string} [title="Title"] - The title of the drawer.
 * @param {string} [description="Description"] - The description of the drawer.
 * 
 * @returns {JSX.Element} The rendered DrawerDialog component.
 */
export const DrawerDialog = ({
  children,
  triggerButton,
  header,
  footer,
  className,
  title = "Title",
  description = "Description",
  dialog,
  noX,
}: DrawerDialogProps) => {
  const { dialogProps, triggerProps } = dialog;

  const defaultTriggerButton = (
    <Button variant="outline">{title}</Button>
  );

  const defaultHeader = (
    <>
      <DialogDrawerTitle>{title}</DialogDrawerTitle>
      <DialogDrawerDescription>{description}</DialogDrawerDescription>
    </>
  );

  const defaultFooter = <Button variant="outline" className="w-full">Cancel</Button>

  return (
    <DialogDrawer {...dialogProps}>
      <DialogDrawerTrigger asChild {...triggerProps}>
        {triggerButton || defaultTriggerButton}
      </DialogDrawerTrigger>
      <DialogDrawerContent noX={noX} className={cn("sm:max-w-[425px] p-6 pt-2 sm:p-6", className, inter.className)}>
        <DialogDrawerHeader>
          {header || defaultHeader}
        </DialogDrawerHeader>
        {children}
        {footer === null ? null : (
          <DialogDrawerFooter>
            <DialogDrawerClose asChild>
              {footer || defaultFooter}
            </DialogDrawerClose>
          </DialogDrawerFooter>
        )}
      </DialogDrawerContent>
    </DialogDrawer>
  );
};