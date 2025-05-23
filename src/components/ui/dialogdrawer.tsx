import React from "react"
import { useMediaQuery } from "@/hooks/use-media-query"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { DialogProps } from "@radix-ui/react-dialog";

interface ChildProps {
  children?: React.ReactNode;
  className?: string;
  asChild?: true;
}

const DialogDrawerContext = React.createContext<{ isDesktop: boolean }>({
  isDesktop: false,
})

const useDialogDrawerContext = () => {
  const context = React.useContext(DialogDrawerContext)
  if (!context) {
    throw new Error("useDialogDrawerContext must be used within a DialogDrawerProvider")
  }
  return context
}

const DialogDrawer = ({ children, ...props }: DialogProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const DialogDrawer = isDesktop ? Dialog : Drawer;

  return (
    <DialogDrawerContext.Provider value={{ isDesktop }}>
      <DialogDrawer {...props}>
        {children}
      </DialogDrawer>
    </DialogDrawerContext.Provider>
  )
}

const DialogDrawerTrigger = ({ children, className, ...props }: ChildProps) => {
  const { isDesktop } = useDialogDrawerContext()
  const DialogDrawerTrigger = isDesktop ? DialogTrigger : DrawerTrigger;

  return (
    <DialogDrawerTrigger className={className} {...props}>
      {children}
    </DialogDrawerTrigger>
  )
}

const DialogDrawerClose = ({ children, className, ...props }: ChildProps) => {
  const { isDesktop } = useDialogDrawerContext()
  const DialogDrawerClose = isDesktop ? DialogClose : DrawerClose;

  return (
    <DialogDrawerClose className={className} {...props}>
      {children}
    </DialogDrawerClose>
  )
}

interface WithNoXProps extends ChildProps {
  noX?: boolean;
}

const DialogDrawerContent = ({ children, className, noX, ...props }: WithNoXProps) => {
  const { isDesktop } = useDialogDrawerContext();

  return (
    <>
      {isDesktop ? (
        <DialogContent onKeyDown={(e) => e.stopPropagation()} className={className} noX={noX} {...props}>
          {children}
        </DialogContent>
      ) : (
        <DrawerContent onKeyDown={(e) => e.stopPropagation()} className={className} {...props}>
          {children}
        </DrawerContent>
      )}
    </>
  )
}

const DialogDrawerHeader = ({ children, className, ...props }: ChildProps) => {
  const { isDesktop } = useDialogDrawerContext()
  const DialogDrawerHeader = isDesktop ? DialogHeader : DrawerHeader;

  return (
    <DialogDrawerHeader className={className} {...props}>
      {children}
    </DialogDrawerHeader>
  )
}

const DialogDrawerFooter = ({ children, className, ...props }: ChildProps) => {
  const { isDesktop } = useDialogDrawerContext()
  const DialogDrawerFooter = isDesktop ? DialogFooter : DrawerFooter;

  return (
    <DialogDrawerFooter className={className} {...props}>
      {children}
    </DialogDrawerFooter>
  )
}

const DialogDrawerTitle = ({ children, className, ...props }: ChildProps) => {
  const { isDesktop } = useDialogDrawerContext()
  const DialogDrawerTitle = isDesktop ? DialogTitle : DrawerTitle;

  return (
    <DialogDrawerTitle className={className} {...props}>
      {children}
    </DialogDrawerTitle>
  )
}

const DialogDrawerDescription = ({ children, className, ...props }: ChildProps) => {
  const { isDesktop } = useDialogDrawerContext()
  const DialogDrawerDescription = isDesktop ? DialogDescription : DrawerDescription;

  return (
    <DialogDrawerDescription className={className} {...props}>
      {children}
    </DialogDrawerDescription>
  )
}

export {
  DialogDrawer,
  DialogDrawerTrigger,
  DialogDrawerClose,
  DialogDrawerContent,
  DialogDrawerHeader,
  DialogDrawerFooter,
  DialogDrawerTitle,
  DialogDrawerDescription,
}
