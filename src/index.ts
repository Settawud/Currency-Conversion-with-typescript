/**
 * Currency Conversion App - TypeScript Fundamentals Demo
 * 
 * This application demonstrates key TypeScript concepts:
 * 
 * 1. EXPORT/IMPORT
 *    - Modular file structure with barrel exports
 *    - Named exports for explicit imports
 * 
 * 2. GENERICS
 *    - Generic interfaces (CurrencyResult<T>)
 *    - Generic classes (CurrencyService<T>)
 *    - Const type parameters for literal types
 * 
 * 3. DECORATORS
 *    - @Log() - Method logging
 *    - @Cache() - Result caching with TTL
 *    - @ValidateAmount() - Input validation
 * 
 * 4. UTILITY TYPES
 *    - Record, Partial, Pick
 *    - Custom utility types (PartialExcept)
 * 
 * 5. TYPE GUARDS
 *    - Runtime type checking
 *    - Type predicates
 */

// Import from modules using barrel exports
import { CurrencyService } from './services/index.js';
import type { ConversionResult, SupportedCurrency } from './types/index.js';

// Create service instance with const assertion for literal types
const currencyService = new CurrencyService(['USD', 'EUR', 'JPY', 'THB'] as const);

/**
 * Demo function showing all TypeScript features in action
 */
async function demonstrateCurrencyConversion(): Promise<void> {
    console.log('\n' + '='.repeat(50));
    console.log('🚀 Currency Conversion Demo');
    console.log('='.repeat(50) + '\n');

    // Example 1: Basic conversion (USD -> THB)
    console.log('📍 Example 1: USD to THB');
    const result1 = await currencyService.convert({
        from: 'USD',
        to: 'THB',
        amount: 100
    });
    displayResult(result1);

    // Example 2: Another conversion (EUR -> JPY)
    console.log('\n📍 Example 2: EUR to JPY');
    const result2 = await currencyService.convert({
        from: 'EUR',
        to: 'JPY',
        amount: 50
    });
    displayResult(result2);

    // Example 3: Cached call (same as Example 1 - should hit cache)
    console.log('\n📍 Example 3: Cached call (USD to THB again)');
    const cachedResult = await currencyService.convert({
        from: 'USD',
        to: 'THB',
        amount: 100
    });
    displayResult(cachedResult);

    // Example 4: Get supported currencies
    console.log('\n📍 Example 4: Supported currencies');
    const currencies = currencyService.getSupportedCurrencies();
    console.log(`Supported: ${currencies.join(', ')}`);

    // Example 5: Type guard usage
    console.log('\n📍 Example 5: Currency validation');
    const testCurrency = 'USD';
    if (currencyService.isSupported(testCurrency)) {
        console.log(`✅ ${testCurrency} is supported`);
    }

    console.log('\n' + '='.repeat(50));
    console.log('✨ Demo Complete!');
    console.log('='.repeat(50) + '\n');
}

/**
 * Helper function to display conversion results
 */
function displayResult<T extends string>(result: ConversionResult<T>): void {
    if (result.success) {
        const { data } = result;
        console.log(`  Base: ${data.base}`);
        console.log(`  Amount: ${data.amount}`);
        console.log(`  Date: ${data.date}`);
        console.log(`  Rates:`, data.rates);
    } else {
        console.error(`  ❌ Error: ${result.error.message}`);
    }
}

// Run the demo
demonstrateCurrencyConversion();
