'use client';

import React from 'react';
import { CategoryForm } from '@/components/category/CategoryForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DrawerDialog } from '@/components/shared/ResponsiveDrawerDialog';
import { useDialog } from '@/hooks/use-dialog';

interface CategoryButtonProps {
  button?: React.ReactNode;
  dialogProps?: typeof useDialog;
}

/**
 * Opens a dialog to create a new category
 * @param {React.ReactNode} button - The button to render
 * @param {typeof useDialog} dialogProps - The dialog props
 */
const OpenCategoryButton = ({ button, dialogProps }: CategoryButtonProps) => {
  const openCategoryDialog = dialogProps ? dialogProps() : useDialog();
  const buttonChildren = button || (
    <Button variant="link" size="icon" className="p-none rounded-none w-fit px-3 h-9 fixed top-0 right-0">
      <Plus />
    </Button>
  );

  return (
    <DrawerDialog
      triggerButton={buttonChildren}
      title="Create a new Category"
      description=""
      dialog={openCategoryDialog}
    >
      <CategoryForm onSave={openCategoryDialog.dismiss} />
    </DrawerDialog>
  )
};

export { OpenCategoryButton };