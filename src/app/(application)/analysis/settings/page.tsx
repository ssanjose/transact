"use client";

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

  continuousTransactions: z.boolean(),

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

      continuousTransactions: settings.continuousTransactions,

      appUpdates: settings.appUpdate,
      transactionUpdates: settings.transactionUpdates,
    },
  })

  function onSubmit(data: z.infer<typeof SettingSchema>) {
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
              name="continuousTransactions"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Continuous transactions</FormLabel>
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
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm max-w-[500px]">
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
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm max-w-[500px]">
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
          <h3 className="mb-4 text-lg font-medium">Notifications</h3>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="appUpdates"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
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
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
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
          <Button type="reset" variant="outline" onClick={(e) => {
            e.preventDefault()
            form.reset()
          }}>Cancel</Button>
          <Button type="button" variant="outline" onClick={(e) => {
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
    <ContentContainer className="flex flex-col gap-2 min-h-screen">
      <br />
      <SettingForm className="mx-auto max-w-[900px]" />
    </ContentContainer>
  )
};

export default Page;