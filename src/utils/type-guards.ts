/**
 * Type Guards Module
 * Demonstrates: Type Guards, Type Predicates, Runtime Type Checking
 */

import type { CurrencyResult, ApiError } from '../types/index.js';

/**
 * Type guard to check if response is a valid CurrencyResult
 */
export function isCurrencyResult<T extends string>(obj: unknown): obj is CurrencyResult<T> {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'amount' in obj &&
        'base' in obj &&
        'date' in obj &&
        'rates' in obj &&
        typeof (obj as CurrencyResult<T>).amount === 'number' &&
        typeof (obj as CurrencyResult<T>).base === 'string' &&
        typeof (obj as CurrencyResult<T>).date === 'string' &&
        typeof (obj as CurrencyResult<T>).rates === 'object'
    );
}

/**
 * Type guard to check if response is an API error
 */
export function isApiError(obj: unknown): obj is ApiError {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'message' in obj &&
        'type' in obj
    );
}

/**
 * Type guard to check if value is a valid currency code
 */
export function isValidCurrency<T extends readonly string[]>(
    value: unknown,
    validCurrencies: T
): value is T[number] {
    return typeof value === 'string' && validCurrencies.includes(value as T[number]);
}

/**
 * Assert function - throws if condition is false
 * Demonstrates: Assertion Functions
 */
export function assertDefined<T>(value: T | null | undefined, message: string): asserts value is T {
    if (value === null || value === undefined) {
        throw new Error(message);
    }
}
