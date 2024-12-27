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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
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

interface TransactionFormProps {
  className?: string;
  accountId: number;
  onSave: () => void;
}

const TransactionForm = ({ className, accountId, onSave }: TransactionFormProps) => {
  const categories = useLiveQuery(() => CategoryService.getAllCategories());

  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      amount: 0,
      date: new Date(),
      accountId: accountId,
      type: TransactionType.Expense,
      categoryId: undefined,
      frequency: Frequency.OneTime,
    },
  });

  const onSubmit = async (values: z.infer<typeof transactionSchema>) => {
    const newTransaction: Transaction = transactionSchema.parse({
      name: values.name,
      amount: (Math.round(values.amount * 100) / 100),
      date: values.date,
      accountId: values.accountId,
      type: values.type,
      categoryId: values.categoryId,
      frequency: GetFrequency(values.frequency),
    });
    await TransactionService.createAndApplyTransaction(newTransaction);

    form.reset();
    onSave();
  }

  return (
    <Form {...form}>
      <form className={cn("grid items-start gap-2 z-20 justify-items-end", className)} onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) =>
            <FormItem className="w-full">
              <FormLabel>Name:</FormLabel>
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
              <FormLabel>Amount:</FormLabel>
              <FormControl>
                <Input {...field} value={field.value} type="number" />
              </FormControl>
              <FormMessage />
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
              </FormItem>
            } />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) =>
              <FormItem className={cn("flex flex-col w-2/6")}>
                <FormLabel>Transaction is an:
                  <span className={`${field.value === 0 ? "text-red-500" : "text-green-500"}`}>
                    {field.value === TransactionType.Income ? " Income" : " Expense"}
                  </span></FormLabel>
                <div className="h-full flex items-center justify-start">
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
                                form.setValue("categoryId", category.id)
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
              </FormItem>
            } />
        </div>
        <Button type="submit" className="w-full">Create Transaction</Button>
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