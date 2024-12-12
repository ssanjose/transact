'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Frequency, FrequencyOptions, Transaction, TransactionType } from '@/lib/db/db.model';
import { TransactionController } from '@/hooks/transaction.controller';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { transactionSchema } from '@/lib/validation/formSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectTrigger, SelectValue } from '../ui/select';
import { SelectItem } from '@radix-ui/react-select';

interface TransactionFormProps {
  className?: string;
  onSave: () => void;
  accountId: number;
}

const TransactionForm = ({ className, accountId, onSave }: TransactionFormProps) => {
  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      amount: 0.00,
      date: new Date(),
      accountId: accountId,
      type: TransactionType.Expense,
      frequency: Frequency.OneTime,
    }
  });

  const onSubmit = async (values: z.infer<typeof transactionSchema>) => {
    const newTransaction: Transaction = {
      name: values.name,
      amount: (Math.round(values.amount * 100) / 100),
      date: values.date,
      accountId: values.accountId,
      type: values.type,
      frequency: GetFrequency(values.frequency),
    };
    await TransactionController.createAndApplyTransaction(newTransaction);

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
            </FormItem>
          } />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) =>
            <FormItem className="w-full">
              <FormLabel>Amount:</FormLabel>
              <FormControl>
                <Input {...field} type="number" />
              </FormControl>
            </FormItem>
          } />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) =>
            <FormItem className="flex flex-col w-full">
              <FormLabel>Date</FormLabel>
              <Popover modal>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground")}>
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          }
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) =>
            <FormItem className="w-full">
              <FormLabel>Type</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value === TransactionType.Income}
                  onCheckedChange={() => form.setValue("type", field.value ? TransactionType.Expense : TransactionType.Income)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          }
        />
        <FormField
          control={form.control}
          name="frequency"
          render={({ field }) =>
            <FormItem className="flex flex-col w-full">
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