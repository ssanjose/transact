'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { categorySchema } from '@/lib/validation/formSchemas';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Category } from '@/lib/db/db.model';
import { CategoryService } from '@/services/category.service';

interface CategoryFormProps {
  className?: string;
  onSave: () => void;
  existingCategory?: Category;
}

const CategoryForm = ({ className, onSave, existingCategory }: CategoryFormProps) => {
  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    mode: "onChange",
    defaultValues: {
      id: existingCategory
        ?.id || undefined,
      name: existingCategory?.name || "",
      color: existingCategory?.color || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof categorySchema>) => {
    const category = {
      name: values.name,
      color: values.color,
    };

    if (existingCategory && existingCategory.id !== undefined)
      await CategoryService.updateCategory(existingCategory
        .id, category);
    else {
      await CategoryService.createCategory(category);
    }

    onSave();
  }

  return (
    <Form {...form}>
      <form className={cn("grid items-start gap-4", className)} onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>
                  Name
                </FormLabel>
                <FormControl>
                  <Input type="text" {...field} placeholder="New Category" />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>
                  Color
                </FormLabel>
                <FormControl>
                  <Input type="text" {...field} disabled={!!existingCategory

                  } placeholder="#000" />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }} />
        <Button type="submit">{existingCategory
          ? "Edit " : "Create a "}Category</Button>
      </form>
    </Form>
  )
};

export { CategoryForm };