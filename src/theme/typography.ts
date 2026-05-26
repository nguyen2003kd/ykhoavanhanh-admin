export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 30,
};

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: '700' as const,
};

export const FontFamily = {
  regular: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  medium: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  semiBold: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  bold: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
};

export const LineHeight = {
  xs: 16,
  sm: 18,
  md: 22,
  lg: 26,
  xl: 30,
  xxl: 34,
};

export const Typography = {
  h1: { fontSize: FontSize.xxxl, fontFamily: FontFamily.bold, lineHeight: `${LineHeight.xxl}px`, fontWeight: FontWeight.bold },
  h2: { fontSize: FontSize.xxl, fontFamily: FontFamily.bold, lineHeight: `${LineHeight.xl}px`, fontWeight: FontWeight.bold },
  h3: { fontSize: FontSize.xl, fontFamily: FontFamily.semiBold, lineHeight: `${LineHeight.lg}px`, fontWeight: FontWeight.semiBold },
  h4: { fontSize: FontSize.lg, fontFamily: FontFamily.semiBold, lineHeight: `${LineHeight.md}px`, fontWeight: FontWeight.semiBold },
  bodyLarge: { fontSize: FontSize.md, fontFamily: FontFamily.regular, lineHeight: `${LineHeight.md}px`, fontWeight: FontWeight.regular },
  bodyMedium: { fontSize: FontSize.md, fontFamily: FontFamily.medium, lineHeight: `${LineHeight.md}px`, fontWeight: FontWeight.medium },
  bodySmall: { fontSize: FontSize.sm, fontFamily: FontFamily.regular, lineHeight: `${LineHeight.sm}px`, fontWeight: FontWeight.regular },
  caption: { fontSize: FontSize.xs, fontFamily: FontFamily.regular, lineHeight: `${LineHeight.xs}px`, fontWeight: FontWeight.regular },
  captionMedium: { fontSize: FontSize.xs, fontFamily: FontFamily.medium, lineHeight: `${LineHeight.xs}px`, fontWeight: FontWeight.medium },
  button: { fontSize: FontSize.md, fontFamily: FontFamily.semiBold, lineHeight: `${LineHeight.md}px`, fontWeight: FontWeight.semiBold },
  label: { fontSize: FontSize.sm, fontFamily: FontFamily.medium, lineHeight: `${LineHeight.sm}px`, fontWeight: FontWeight.medium },
} as const;
