'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Frequency, FrequencyOptions, Transaction, TransactionType } from '@/lib/db/db.model';
import { TransactionService } from '@/services/transaction.service';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { transactionSchema } from '@/lib/validation/formSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react';
import CalendarWithTime from '@/components/transaction/CalendarWithTime';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SelectItem } from '@radix-ui/react-select';
import { CategoryService } from '@/services/category.service';
import { useLiveQuery } from 'dexie-react-hooks';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { OpenCategoryButton } from '@/components/category/CategoryButtons';
import { useDialog } from '@/hooks/use-dialog';

interface TransactionFormProps extends React.HTMLAttributes<HTMLFormElement> {
  accountId: number;
  onSave: () => void;
  existingTransaction?: Transaction;
}

const TransactionForm = ({ className, accountId, onSave, existingTransaction }: TransactionFormProps) => {
  const categories = useLiveQuery(() => CategoryService.getAllCategories());
  const editCategory = useDialog();
  const deleteCategory = useDialog();

  const nullableTransactionSchema = transactionSchema.merge(z.object({
    categoryId: z.nullable(z.number()),
  }));

  const form = useForm<z.infer<typeof nullableTransactionSchema>>({
    resolver: zodResolver(nullableTransactionSchema),
    mode: "onChange",
    defaultValues: {
      id: existingTransaction?.id || undefined,
      name: existingTransaction?.name || "",
      amount: existingTransaction?.amount || 0.00,
      date: existingTransaction?.date || new Date(),
      accountId: existingTransaction?.accountId || accountId,
      type: existingTransaction?.type || TransactionType.Expense,
      categoryId: existingTransaction?.categoryId || null,
      frequency: existingTransaction?.frequency || Frequency.OneTime,
      transactionId: existingTransaction?.transactionId || undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof nullableTransactionSchema>) => {
    const transaction: Transaction = transactionSchema.parse({
      id: values.id,
      name: values.name,
      amount: (Math.round(values.amount * 100) / 100),
      date: values.date,
      accountId: values.accountId,
      type: values.type,
      categoryId: values.categoryId === null ? undefined : values.categoryId,
      frequency: GetFrequency(values.frequency),
      transactionId: values.transactionId,
    });

    if (existingTransaction && existingTransaction.id !== undefined)
      await TransactionService.updateTransaction(transaction);
    else
      await TransactionService.createTransaction(transaction);

    onSave();
  }

  return (
    <Form {...form}>
      <form className={cn("flex flex-col items-start gap-2 z-20", className)} onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) =>
            <FormItem className="w-full">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} type="text" />
              </FormControl>
              <FormMessage />
            </FormItem>
          } />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) =>
            <FormItem className="w-full">
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input {...field} value={field.value} type="number" />
              </FormControl>
              <FormMessage />
              {!existingTransaction && <FormDescription className="text-muted-foreground font-normal">Amount used for the transaction</FormDescription>}
            </FormItem>
          } />
        <div className="flex gap-2 w-full">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) =>
              <FormItem className="flex flex-col w-4/6">
                <FormLabel>Date</FormLabel>
                <Popover modal>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full sm:w-fit pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground")}>
                        {field.value ? (
                          format(field.value, "PPP p")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-fit" align="start">
                    <CalendarWithTime
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
                {!existingTransaction && <FormDescription className="text-muted-foreground font-normal">Date when it happens</FormDescription>}
              </FormItem>
            } />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) =>
              <FormItem className={cn("space-y-2 flex flex-col w-2/6")}>
                <FormDescription className="text-muted-foreground font-normal">Transaction is an:</FormDescription>
                <div className="flex items-center justify-between w-full max-w-[105px]">
                  <FormLabel
                    className="cursor-pointer"
                    onClick={() => form.setValue("type", field.value === TransactionType.Expense ? TransactionType.Expense : TransactionType.Income)}>
                    <span className={`${field.value === 0 ? "text-number-negative" : "text-number-positive"}`}>
                      {field.value === TransactionType.Income ? " Income" : " Expense"}
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value === TransactionType.Income}
                      onCheckedChange={() => form.setValue("type", field.value ? TransactionType.Expense : TransactionType.Income)}
                      className={cn(field.value === 0 ? "data-[state=unchecked]:bg-red-300" : "data-[state=checked]:bg-green-300")}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            } />
        </div>

        <div className="flex gap-2 w-full">
          <FormField
            control={form.control}
            name="frequency"
            render={({ field }) =>
              <FormItem className="flex flex-col w-2/5">
                <FormLabel>Frequency</FormLabel>
                <Select
                  value={field.value.toString()}
                  onValueChange={(value) => {
                    if (!isNaN(parseInt(value)) && value !== "-1") field.onChange(parseInt(value));
                  }}
                  disabled={!!existingTransaction?.transactionId}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue>{`${Frequency[field.value]}`}</SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {FrequencyOptions.map((option, index) =>
                      <SelectItem key={index} value={index.toString()}>
                        {Frequency[index]}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
                {!existingTransaction && <FormDescription className="text-muted-foreground font-normal">How frequent is it?</FormDescription>}
              </FormItem>
            } />
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) =>
              <FormItem className="flex flex-col w-3/5">
                <FormLabel>Category</FormLabel>
                <Popover modal>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn("justify-between",
                          !field.value && "text-muted-foreground"
                        )}>
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded mr-2 ${!field.value ? "hidden" : "block"}`}
                            style={{ backgroundColor: categories?.find((category) => category.id === field.value)?.color }} />
                          {field.value ? categories?.find((category) => category.id === field.value)?.name : "Select a category"}
                        </div>
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Command>
                      <div className="flex flex-row">
                        <CommandInput placeholder="Search categories..." className="h-9 w-full" disabled={false} />
                        <OpenCategoryButton />
                      </div>
                      <CommandList>
                        <CommandEmpty>No categories found</CommandEmpty>
                        <CommandGroup>
                          {categories?.map((category) => (
                            <CommandItem
                              value={category.name}
                              key={category.id}
                              onSelect={() => {
                                if (category.id === field.value)
                                  field.onChange(null);
                                else
                                  field.onChange(category.id);
                              }}
                              className="flex items-center w-full"
                            >
                              <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: category.color }} />
                              {category.name}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  category.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
                {!existingTransaction && <FormDescription className="text-muted-foreground font-normal">Category of the Transaction</FormDescription>}
              </FormItem>
            } />
        </div>
        <div className="flex gap-2 mt-2">
          <Button type="submit">{existingTransaction ? "Edit " : "Create an "}Transaction</Button>
          <Button variant="outline" onClick={(e) => {
            e.preventDefault();
            onSave();
          }}>Cancel</Button>
        </div>
      </form>
    </Form >
  )
};

const GetFrequency = (value: number): Frequency => {
  switch (value) {
    case 0:
      return Frequency.OneTime;
    case 1:
      return Frequency.Daily;
    case 2:
      return Frequency.Weekly;
    case 3:
      return Frequency.Monthly;
    default:
      return Frequency.Monthly;
  }
}

export default TransactionForm;