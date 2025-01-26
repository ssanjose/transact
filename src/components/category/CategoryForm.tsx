'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { categorySchema } from '@/lib/validation/formSchemas';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Category } from '@/lib/db/db.model';
import { CategoryService } from '@/services/category.service';
import { ColorPicker, ColorPickerHex, ColorPickerInput } from '@/components/ui/color-picker';

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
                {!existingCategory && <FormDescription className="text-muted-foreground font-normal">Title e.g. Miscellaneous, Birthday Props.</FormDescription>}
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
                  <ColorPicker>
                    <ColorPickerHex
                      color={field.value}
                      onChange={field.onChange}
                    />
                    <ColorPickerInput
                      type="text"
                      {...field}
                      placeholder="#000"
                    />
                  </ColorPicker>
                </FormControl>
                <FormMessage />
                {!existingCategory && <FormDescription className="text-muted-foreground font-normal">3-digits or 6-digits hex number.</FormDescription>}
              </FormItem>
            );
          }} />
        <div className="flex gap-2 mt-2">
          <Button type="submit">{existingCategory
            ? "Edit " : "Create a "}Category</Button>
          <Button variant="outline" onClick={(e) => {
            e.preventDefault();
            onSave();
          }}>Cancel</Button>
        </div>
      </form>
    </Form>
  )
};

export { CategoryForm };