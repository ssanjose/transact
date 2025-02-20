"use client";

import React, { useEffect } from "react";
import { SectionTitle, Title } from "@/components/shared/Headers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import ContentContainer from "@/components/common/ContentContainer";
import { cn } from "@/lib/utils";
import useSettings from "@/hooks/use-settings";
import { Input } from "@/components/ui/input";
import { NUMBER_INPUT_MAX, NUMBER_INPUT_MIN } from "@/lib/types/settings";
import { Currencies } from "@/config/currency";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DeleteAllAccountButton } from "@/components/account/AccountButtons";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const SettingSchema = z.object({
  recentTransactionLimit: z.preprocess((x) => x || x === 0 ? Number(x) : undefined, z.number({
    message: 'Number must be a number',
  }).int().nonnegative()
    .min(NUMBER_INPUT_MIN, {
      message: 'Number must be at least 1',
    })
    .max(NUMBER_INPUT_MAX, {
      message: 'Number must be at most 6',
    })),
  upcomingTransactionLimit: z.preprocess((x) => x || x === 0 ? Number(x) : undefined, z.number({
    message: 'Number must be a number',
  }).int().nonnegative()
    .min(NUMBER_INPUT_MIN, {
      message: 'Number must be at least 1',
    })
    .max(NUMBER_INPUT_MAX, {
      message: 'Number must be at most 6',
    })),

  recurringTransactions: z.boolean(),

  currencyFormat: z.enum(Currencies, {
    message: 'Currency must be a valid currency',
  }),
  dateFormat: z.string(),

  appUpdates: z.boolean(),
  transactionUpdates: z.boolean(),
})

const SettingForm = ({ className }: React.HTMLAttributes<HTMLFormElement>) => {
  const { settings, updateSettings, resetSettings } = useSettings();

  const form = useForm<z.infer<typeof SettingSchema>>({
    resolver: zodResolver(SettingSchema),
    mode: "onChange",
    defaultValues: {
      recentTransactionLimit: settings.recentTransactionLimit,
      upcomingTransactionLimit: settings.upcomingTransactionLimit,

      recurringTransactions: settings.recurringTransactions,

      currencyFormat: settings.currencyFormat,
      dateFormat: settings.dateFormat,

      appUpdates: settings.appUpdates,
      transactionUpdates: settings.transactionUpdates,
    },
  })

  useEffect(() => {
    form.reset({
      recentTransactionLimit: settings.recentTransactionLimit,
      upcomingTransactionLimit: settings.upcomingTransactionLimit,
      recurringTransactions: settings.recurringTransactions,
      currencyFormat: settings.currencyFormat,
      dateFormat: settings.dateFormat,
      appUpdates: settings.appUpdates,
      transactionUpdates: settings.transactionUpdates,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  const onSubmit = (data: z.infer<typeof SettingSchema>) => {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })

    updateSettings(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("w-full space-y-6", className)}>
        <div>
          <h3 className="mb-4 text-lg font-medium">Transactions</h3>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="recurringTransactions"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-xs">
                  <div className="space-y-0.5">
                    <FormLabel>Recurring transactions</FormLabel>
                    <FormDescription>
                      Automatically add new transactions when a new month starts.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="recentTransactionLimit"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-xs max-w-[500px]">
                  <div className="space-y-0.5">
                    <FormLabel>Recent transaction limit</FormLabel>
                    <FormDescription>
                      The number of recent transactions that can be displayed.
                    </FormDescription>
                  </div>
                  <div className="flex flex-col items-end">
                    <FormControl>
                      <Input {...field} value={field.value} type="number" className="w-16" min={NUMBER_INPUT_MIN} max={NUMBER_INPUT_MAX} />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="upcomingTransactionLimit"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-xs max-w-[500px]">
                  <div className="space-y-0.5">
                    <FormLabel>Upcoming transaction limit</FormLabel>
                    <FormDescription>
                      The number of upcoming transactions that can be displayed.
                    </FormDescription>
                  </div>
                  <div className="flex flex-col items-end">
                    <FormControl>
                      <Input {...field} value={field.value} type="number" className="w-16" min={NUMBER_INPUT_MIN} max={NUMBER_INPUT_MAX} />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-medium">Preferences</h3>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="currencyFormat"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-xs max-w-[500px]">
                  <div className="space-y-0.5">
                    <FormLabel>Currency Format</FormLabel>
                    <FormDescription>
                      The default currency for new transactions.
                    </FormDescription>
                  </div>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl className="w-24">
                      <SelectTrigger>
                        <SelectValue>{field.value}</SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="w-24">
                      {Currencies.map((_, index) => {
                        return (
                          <SelectItem key={"currencyOption" + index} value={Currencies[index]}>
                            {Currencies[index]}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateFormat"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-xs max-w-[500px]">
                  <div className="space-y-0.5">
                    <FormLabel>Date format</FormLabel>
                    <FormDescription>
                      The format for displaying dates.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Input {...field} value={field.value} className="w-50" />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-medium">Notifications</h3>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="appUpdates"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-xs">
                  <div className="space-y-0.5">
                    <FormLabel>App updates</FormLabel>
                    <FormDescription>
                      Receive a notification when a new version of the app is available.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="transactionUpdates"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-xs">
                  <div className="space-y-0.5">
                    <FormLabel>Transaction updates</FormLabel>
                    <FormDescription>
                      Receive notifications when transactions are committed.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex flex-row items-center space-x-4">
          <Button type="submit">Save</Button>
          <Button type="button" variant="outline" onClick={(e) => {
            e.preventDefault()
            form.reset()
          }}>Cancel</Button>
          <Button type="reset" variant="outline" onClick={(e) => {
            e.preventDefault()
            resetSettings()
          }}>Reset</Button>
        </div>
      </form>
    </Form>
  )
}

const Page = () => {
  return (
    <ContentContainer className="flex flex-col gap-2 min-h-screen mx-auto max-w-[900px]">
      <Title>Settings</Title>
      <SectionTitle className="sr-only">Settings Form</SectionTitle>
      <SettingForm />
      <div className="w-full space-y-6 max-w-[900px] mx-auto mt-4">
      <h3 className="mb-4 text-lg font-medium">Data</h3>
        <Card className=" space-y-1 flex flex-row items-center justify-between rounded-lg border p-3 shadow-x">
          <CardHeader className="space-y-0.5 p-1">
            <CardTitle className="text-sm font-medium">
              Delete All Accounts
            </CardTitle>
            <CardDescription className="text-[0.8rem]">
              This action will permanently delete all accounts and associated
              transactions.
            </CardDescription>
          </CardHeader>
          <DeleteAllAccountButton
            button={<Button variant="destructive">Delete</Button>}
          />
        </Card>
      </div>
    </ContentContainer>
  )
};

export default Page;