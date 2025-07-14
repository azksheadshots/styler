"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2 } from "lucide-react";

const formSchema = z.object({
  industry: z.string().min(2, "Industry is required."),
  role: z.string().min(2, "Role is required."),
  stylePreferences: z.string().min(10, "Please describe your style preferences."),
});

type StyleFormValues = z.infer<typeof formSchema>;

interface StyleFormProps {
  onSubmit: (data: StyleFormValues) => void;
  isLoading: boolean;
}

export function StyleForm({ onSubmit, isLoading }: StyleFormProps) {
  const form = useForm<StyleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      industry: "",
      role: "",
      stylePreferences: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-1">
            <h2 className="text-2xl font-headline font-semibold">Describe Your Style</h2>
            <p className="text-muted-foreground text-sm">
            Tell us about your profession and preferences for a tailored look.
            </p>
        </div>
        <FormField
          control={form.control}
          name="industry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Industry</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Technology, Finance, Arts" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Role</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Software Engineer, CEO" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="stylePreferences"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Style Preferences</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., Modern and minimalist, classic business professional, creative..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Generate Style
        </Button>
      </form>
    </Form>
  );
}
