"use client";

import * as React from "react";
import { PlusIcon } from "lucide-react";
import { Accordion as AccordionPrimitive } from "radix-ui";

import { cn } from "@/shared/lib/cn";

function Accordion({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex flex-col gap-2.5", className)}
      {...props}
    />
  );
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(
        "overflow-hidden rounded-[22px] border border-glass-border bg-white/60 shadow-[0_6px_18px_rgb(76_49_168/0.06)] backdrop-blur-[18px] transition-shadow",
        "data-[state=open]:bg-white/85 data-[state=open]:shadow-[0_18px_40px_rgb(76_49_168/0.12)]",
        className,
      )}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group flex flex-1 cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left text-[15.5px] font-bold outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
          className,
        )}
        {...props}
      >
        {children}
        <span className="grid size-7.5 shrink-0 place-items-center rounded-full bg-muted/90 text-label transition-[transform,background-color,color] duration-200 group-data-[state=open]:rotate-45 group-data-[state=open]:bg-primary group-data-[state=open]:text-white">
          <PlusIcon className="size-4" />
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div
        className={cn(
          "max-w-180 px-6 pb-5.5 text-[14.5px] leading-relaxed text-label",
          className,
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
