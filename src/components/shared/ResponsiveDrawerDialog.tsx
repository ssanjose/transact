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

interface DrawerDialogProps {
  mobileContent: React.ReactNode;
  children: React.ReactNode;
  triggerButton?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

/**
 * DrawerDialog component that renders a responsive dialog drawer.
 * 
 * @param {React.ReactNode} mobileContent - The content to display on mobile devices.
 * @param {React.ReactNode} children - The content to display on desktop devices.
 * @param {React.ReactNode} [triggerButton] - Optional custom trigger button for opening the drawer.
 * @param {React.ReactNode} [header] - Optional custom header content for the drawer.
 * @param {React.ReactNode} [footer] - Optional custom footer content for the drawer.
 * @param {string} [title="Title"] - The title of the drawer.
 * @param {string} [description="Description"] - The description of the drawer.
 * 
 * @returns {JSX.Element} The rendered DrawerDialog component.
 */
export const DrawerDialog = ({
  mobileContent,
  children,
  triggerButton,
  header,
  footer,
  title = "Title",
  description = "Description",
  className,
}: DrawerDialogProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const defaultTriggerButton = (
    <Button variant="outline">{title}</Button>
  );

  const defaultHeader = (
    <>
      <DialogDrawerTitle>{title}</DialogDrawerTitle>
      <DialogDrawerDescription>{description}</DialogDrawerDescription>
    </>
  );

  const defaultFooter = (
    <Button variant="outline" className="w-full">Cancel</Button>
  );

  return (
    <DialogDrawer>
      <DialogDrawerTrigger asChild>
        {triggerButton || defaultTriggerButton}
      </DialogDrawerTrigger>
      <DialogDrawerContent className="sm:max-w-[425px]">
        <DialogDrawerHeader>
          {header || defaultHeader}
        </DialogDrawerHeader>
        {isDesktop ? children : mobileContent}
        <DialogDrawerFooter>
          <DialogDrawerClose asChild>
            {footer || defaultFooter}
          </DialogDrawerClose>
        </DialogDrawerFooter>
      </DialogDrawerContent>
    </DialogDrawer>
  );
};