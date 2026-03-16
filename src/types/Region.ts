export interface Region {
  id: number;
  name: string;
  code: string;
  languageCode: string;
  prefixPhone: string;
  currencyCode: string;
  locale: string;
  requiresZeroPrefix: boolean;
  phoneMaxLength: number;
  phoneRegex: string | null;
  createdAt: Date;
  updatedAt: Date;
}
