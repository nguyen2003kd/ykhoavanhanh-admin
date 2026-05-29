"use client"

import * as React from "react"
import { Avatar as AvatarPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

// ── shadcn/ui Avatar primitives ──────────────────────────────────────────────

function AvatarRoot({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> & {
  size?: "default" | "sm" | "lg"
}) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      className={cn(
        "group/avatar relative flex size-8 shrink-0 rounded-full select-none after:absolute after:inset-0 after:rounded-full after:border after:border-border after:mix-blend-darken data-[size=lg]:size-10 data-[size=sm]:size-6 dark:after:mix-blend-lighten",
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full rounded-full object-cover", className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full bg-muted text-sm text-muted-foreground group-data-[size=sm]/avatar:text-xs",
        className
      )}
      {...props}
    />
  )
}

export { AvatarRoot, AvatarImage, AvatarFallback }

// ── Backward-compat API ──────────────────────────────────────────────────────

interface AvatarProps {
  name: string
  src?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

function getInitials(name: string) {
  if (!name?.trim()) return "?"
  return name
    .trim()
    .split(/\s+/)
    .map((n) => n[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?"
}

const sizeMap: Record<string, "sm" | "default" | "lg"> = {
  sm: "sm",
  md: "default",
  lg: "lg",
}

export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  return (
    <AvatarRoot size={sizeMap[size]} className={className}>
      {src && <AvatarImage src={src} alt={name} />}
      <AvatarFallback className="bg-primary-600 text-white font-semibold">
        {getInitials(name)}
      </AvatarFallback>
    </AvatarRoot>
  )
}
