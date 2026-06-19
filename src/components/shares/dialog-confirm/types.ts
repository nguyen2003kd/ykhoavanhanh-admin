"use client";

import * as React from "react";

// ─── Interfaces ────────────────────────────────────────────────────────────────

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  asChild?: boolean;
}

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
  isLoading?: boolean;
  onConfirm: () => void;
}

export interface MagicCardBaseProps {
  children?: React.ReactNode;
  className?: string;
  gradientSize?: number;
  gradientFrom?: string;
  gradientTo?: string;
}

export interface MagicCardGradientProps extends MagicCardBaseProps {
  mode?: "gradient";
  gradientColor?: string;
  gradientOpacity?: number;
  glowFrom?: never;
  glowTo?: never;
  glowAngle?: never;
  glowSize?: never;
  glowBlur?: never;
  glowOpacity?: never;
}

export interface MagicCardOrbProps extends MagicCardBaseProps {
  mode: "orb";
  glowFrom?: string;
  glowTo?: string;
  glowAngle?: number;
  glowSize?: number;
  glowBlur?: number;
  glowOpacity?: number;
  gradientColor?: never;
  gradientOpacity?: never;
}

// ─── Types ─────────────────────────────────────────────────────────────────────

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline" | "link";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

export type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "secondary";

export type ConfirmVariant = "delete" | "edit" | "warning" | "info";

export type MagicCardProps = MagicCardGradientProps | MagicCardOrbProps;
export type ResetReason = "enter" | "leave" | "global" | "init";
