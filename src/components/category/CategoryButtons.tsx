'use client';

import React from 'react';
import { CategoryForm } from '@/components/category/CategoryForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DrawerDialog } from '@/components/shared/ResponsiveDrawerDialog';
import { useDialog } from '@/hooks/use-dialog';
import { Category } from '@/lib/db/db.model';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { CategoryService } from '@/services/category.service';
import { Sleep } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface CategoryButtonProps {
  button?: React.ReactElement;
  dialogProps?: typeof useDialog;
  title?: string;
  description?: string;
  visible?: boolean;
}

interface EditCategoryButtonProps extends CategoryButtonProps {
  existingCategory?: Category;
}

interface DeleteCategoryButtonProps extends CategoryButtonProps {
  id?: number;
  name?: string;
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
      footer={null}
      noX
    >
      <CategoryForm onSave={openCategoryDialog.dismiss} />
    </DrawerDialog>
  )
};

/**
 * Opens a dialog to edit a category
 * @param {React.ReactNode} button - The button to render
 * @param {typeof useDialog} dialogProps - The dialog props
 * @param {string} title - The title of the dialog
 * @param {string} description - The description of the dialog
 * @param {Category} existingCategory - The existing category
 * @returns {React.ReactElement}
 */
const EditCategoryButton = ({ button, dialogProps, title, description, existingCategory, visible }: EditCategoryButtonProps) => {
  const editCategoryDialog = dialogProps ? dialogProps() : useDialog();
  const buttonChildren = button || (
    <Button variant="ghost" size="icon" className={`px-2 w-full flex justify-start ${visible ? "block" : "hidden"}`}>
      <span>Edit a Category</span>
    </Button>
  );

  return (
    <DrawerDialog
      triggerButton={buttonChildren}
      title={title ? title : ""}
      description={description ? description : ""}
      dialog={editCategoryDialog}
      footer={null}
      noX
    >
      <CategoryForm
        onSave={editCategoryDialog.dismiss}
        existingCategory={existingCategory} />
    </DrawerDialog>
  )
}

const DeleteCategoryButton = ({ id, button, title, description, name, dialogProps, visible }: DeleteCategoryButtonProps) => {
  const deleteCategoryDialog = dialogProps ? dialogProps() : useDialog();
  const { toast } = useToast();
  const buttonChildren = button || (
    <Button variant="link" size="icon" className="p-none w-min">
      <span>Delete Category</span>
    </Button>
  );

  const handleDelete = async (id?: number) => {
    try {
      const deleteCategory = async () => {
        if (id === -1) return;

        if (!id) throw new Error("Category ID is required");

        await CategoryService.deleteCategory(id);
        await Sleep(500);
        toast({
          variant: "destructive",
          title: "Category Deleted",
          description: `Category ${name} has been deleted successfully`,
          duration: 4000,
        });
      }
      deleteCategory();
      deleteCategoryDialog.dismiss();
    } catch (e) {
      let result = (e as Error).message;
      if (typeof e === "string")
        result = e;
      else if (e instanceof Error)
        result = e.message;

      toast({
        variant: "destructive",
        title: "Error",
        description: result,
      });
    }
  }

  return (
    <AlertDialog {...deleteCategoryDialog.dialogProps}>
      <AlertDialogTrigger asChild
        className={visible ? "block" : "hidden"}
      >{buttonChildren}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold">
            {title ? title : "Are you sure you want to delete this category?"}
            {name ? `: ${name}` : ""}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {description ? description : "This action cannot be undone. This will permanently delete the category. This will also remove the category selection from all transactions associated with this category."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleDelete(id)}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
};

export { OpenCategoryButton, EditCategoryButton, DeleteCategoryButton };