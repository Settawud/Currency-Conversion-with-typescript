/**
 * Currency Service
 * Demonstrates: Generic Class, Decorators, async/await
 */

import { Log, Cache, ValidateAmount } from '../decorators/index.js';
import type { CurrencyResult, ConversionOptions, ConversionResult } from '../types/index.js';
import { isCurrencyResult, isApiError } from '../utils/index.js';

/**
 * CurrencyService - Generic class for currency conversion
 * 
 * @template T - Tuple of supported currency codes (const assertion)
 * 
 * Demonstrates:
 * - Generic class with const type parameter
 * - Method decorators (@Log, @Cache, @ValidateAmount)
 * - Conditional types in return values
 */
export class CurrencyService<const T extends readonly string[]> {
    private readonly apiUrl = 'https://api.frankfurter.dev/v1';

    /**
     * Creates a new CurrencyService instance
     * @param supportedCurrencies - Array of supported currency codes
     */
    constructor(public readonly supportedCurrencies: T) {
        console.log(`💱 CurrencyService initialized with: ${supportedCurrencies.join(', ')}`);
    }

    /**
     * Convert currency using the Frankfurter API
     * 
     * Decorators applied (execution order: bottom to top):
     * 1. @ValidateAmount - Validates amount is positive
     * 2. @Cache - Caches results for 1 minute
     * 3. @Log - Logs method calls
     */
    @Log('💱')
    @Cache(60000)
    @ValidateAmount()
    async convert<To extends T[number]>(
        options: ConversionOptions<T[number]>
    ): Promise<ConversionResult<To>> {
        const { from, to, amount } = options;

        try {
            const response = await fetch(
                `${this.apiUrl}/latest?base=${from}&symbols=${to}&amount=${amount}`
            );

            if (!response.ok) {
                return {
                    success: false,
                    error: {
                        message: `HTTP Error: ${response.status}`,
                        type: 'HTTP_ERROR'
                    }
                };
            }

            const data: unknown = await response.json();

            // Use type guard for runtime validation
            if (isCurrencyResult<To>(data)) {
                return { success: true, data };
            }

            if (isApiError(data)) {
                return { success: false, error: data };
            }

            return {
                success: false,
                error: {
                    message: 'Unknown response format',
                    type: 'PARSE_ERROR'
                }
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    message: error instanceof Error ? error.message : 'Unknown error',
                    type: 'NETWORK_ERROR'
                }
            };
        }
    }

    /**
     * Get list of all supported currencies
     */
    @Log('📋')
    getSupportedCurrencies(): T {
        return this.supportedCurrencies;
    }

    /**
     * Check if a currency is supported
     */
    isSupported(currency: string): currency is T[number] {
        return this.supportedCurrencies.includes(currency as T[number]);
    }
}
