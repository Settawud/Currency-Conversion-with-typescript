/**
 * Currency Types Module
 * Demonstrates: Generics, Utility Types, Type Aliases
 */

/**
 * Generic interface with constraint
 * T must be a string type (for currency codes)
 */
export interface CurrencyResult<T extends string> {
    amount: number;
    base: string;
    date: string;
    rates: Record<T, number>;
}

/**
 * Supported currency codes as a union type
 */
export type SupportedCurrency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'THB' | 'AUD' | 'CAD' | 'CHF';

/**
 * Generic type for conversion options
 * Uses generic constraint to ensure currencies are valid
 */
export type ConversionOptions<T extends string> = {
    from: T;
    to: T;
    amount: number;
};

/**
 * API Error response type
 */
export interface ApiError {
    message: string;
    type: string;
}

/**
 * Result type using discriminated union
 * Demonstrates: Union Types, Type Guards pattern
 */
export type ConversionResult<T extends string> =
    | { success: true; data: CurrencyResult<T> }
    | { success: false; error: ApiError };

/**
 * Utility type: Make all properties optional except specified keys
 * Demonstrates: Custom Utility Types, Mapped Types
 */
export type PartialExcept<T, K extends keyof T> = Partial<Omit<T, K>> & Pick<T, K>;

/**
 * Extract currency codes from a readonly array type
 * Demonstrates: Indexed Access Types, const assertions
 */
export type ExtractCurrencies<T extends readonly string[]> = T[number];
