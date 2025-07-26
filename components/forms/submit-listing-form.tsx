"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import confetti from 'canvas-confetti';
import { useRouter } from "next/navigation";

import { Icons } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllSubmitConfigs } from "@/config/submit-app";
import { z } from "zod";

// Simple schema for tattoo shop submission
const listingSchema = z.object({
  name: z.string().min(1, "Shop name is required").max(50, "Shop name must be 50 characters or less"),
  website: z.string().url("Please enter a valid website URL").optional().or(z.literal("")),
  instagram: z.string().url("Please enter a valid Instagram URL").optional().or(z.literal("")),
  bookingUrl: z.string().url("Please enter a valid booking URL").optional().or(z.literal("")),
  email: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
  description: z.string().min(10, "Description must be at least 10 characters").max(500, "Description must be 500 characters or less"),
  category: z.string().min(1, "Please select a category"),
});

type ListingFormData = z.infer<typeof listingSchema>;

interface SubmitListingFormProps {
  lang: string;
  user: Pick<User, "id" | "name">;
  categories: string[];
}

export function SubmitListingForm({ lang, user, categories }: SubmitListingFormProps) {
  const formConfig = getAllSubmitConfigs()[lang] || getAllSubmitConfigs()['en'];
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      name: "",
      website: "",
      instagram: "",
      bookingUrl: "",
      email: "",
      description: "",
      category: "",
    },
  });

  const selectedCategory = watch("category");

  const onSubmit = handleSubmit(data => {
    console.log('SubmitListingForm, onSubmit, data:', data);
    startTransition(async () => {
      try {
        // Submit to our API route
        const response = await fetch('/api/submit-listing', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...data,
            userId: user.id,
          }),
        });
  
        const result = await response.json();
  
        if (result.success) {
          confetti();
          reset();
          toast.success(formConfig.form.success);
          router.push(`/${lang}/dashboard`);
        } else {
          toast.error(result.message || formConfig.form.error);
        }
      } catch (error) {
        console.error('Submission error:', error);
        toast.error(formConfig.form.error);
      }
    });
  });

  return (
    <form onSubmit={onSubmit}>
      <Card>
        <CardHeader>
          <CardDescription>
            {formConfig.form.title}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {/* Shop Name */}
            <div className="flex gap-4 items-start">
              <Label className="min-w-[100px] mt-2" htmlFor="name">
                {formConfig.form.name}
              </Label>
              <div className="w-full flex flex-col">
                <Input
                  id="name"
                  className="w-full"
                  placeholder={formConfig.form.namePlaceHolder}
                  {...register("name")}
                />
                {errors?.name && (
                  <p className="px-1 text-xs text-red-600 mt-1">{errors.name.message}</p>
                )}
              </div>
            </div>

            {/* Category */}
            <div className="flex gap-4 items-start">
              <Label className="min-w-[100px] mt-2" htmlFor="category">
                {formConfig.form.category}
              </Label>
              <div className="w-full flex flex-col">
                <Select onValueChange={(value) => setValue("category", value)} value={selectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors?.category && (
                  <p className="px-1 text-xs text-red-600 mt-1">{errors.category.message}</p>
                )}
              </div>
            </div>

            {/* Website */}
            <div className="flex gap-4 items-start">
              <Label className="min-w-[100px] mt-2" htmlFor="website">
                {formConfig.form.website}
              </Label>
              <div className="w-full flex flex-col">
                <Input
                  id="website"
                  className="w-full"
                  placeholder={formConfig.form.websitePlaceHolder}
                  {...register("website")}
                />
                {errors?.website && (
                  <p className="px-1 text-xs text-red-600 mt-1">{errors.website.message}</p>
                )}
              </div>
            </div>

            {/* Instagram */}
            <div className="flex gap-4 items-start">
              <Label className="min-w-[100px] mt-2" htmlFor="instagram">
                {formConfig.form.instagram}
              </Label>
              <div className="w-full flex flex-col">
                <Input
                  id="instagram"
                  className="w-full"
                  placeholder={formConfig.form.instagramPlaceHolder}
                  {...register("instagram")}
                />
                {errors?.instagram && (
                  <p className="px-1 text-xs text-red-600 mt-1">{errors.instagram.message}</p>
                )}
              </div>
            </div>

            {/* Booking URL */}
            <div className="flex gap-4 items-start">
              <Label className="min-w-[100px] mt-2" htmlFor="bookingUrl">
                {formConfig.form.bookingUrl}
              </Label>
              <div className="w-full flex flex-col">
                <Input
                  id="bookingUrl"
                  className="w-full"
                  placeholder={formConfig.form.bookingUrlPlaceHolder}
                  {...register("bookingUrl")}
                />
                {errors?.bookingUrl && (
                  <p className="px-1 text-xs text-red-600 mt-1">{errors.bookingUrl.message}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="flex gap-4 items-start">
              <Label className="min-w-[100px] mt-2" htmlFor="email">
                {formConfig.form.email}
              </Label>
              <div className="w-full flex flex-col">
                <Input
                  id="email"
                  type="email"
                  className="w-full"
                  placeholder={formConfig.form.emailPlaceHolder}
                  {...register("email")}
                />
                {errors?.email && (
                  <p className="px-1 text-xs text-red-600 mt-1">{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="flex gap-4 items-start">
              <Label className="min-w-[100px] mt-2" htmlFor="description">
                {formConfig.form.description}
              </Label>
              <div className="w-full flex flex-col">
                <Textarea
                  id="description"
                  className="w-full min-h-[100px]"
                  placeholder={formConfig.form.descriptionPlaceHolder}
                  {...register("description")}
                />
                {errors?.description && (
                  <p className="px-1 text-xs text-red-600 mt-1">{errors.description.message}</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/25 pt-6">
          <div className="w-full flex items-center justify-between gap-8">
            <Button
              type="submit"
              variant="default"
              disabled={isPending}
            >
              {isPending && (
                <Icons.spinner className="mr-2 size-4 animate-spin" />
              )}
              <span>{isPending ? formConfig.form.submiting : formConfig.form.submit}</span>
            </Button>

            <div className="text-sm text-muted-foreground">
              {formConfig.form.notice}
            </div>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}