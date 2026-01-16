/**
 * Validate Decorator
 * Demonstrates: Method Decorator, Parameter Validation
 * 
 * Validates that amount is a positive number before method execution
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyMethod = (...args: any[]) => any;

interface HasAmount {
    amount: number;
}

function isHasAmount(obj: unknown): obj is HasAmount {
    return typeof obj === 'object' && obj !== null && 'amount' in obj && typeof (obj as HasAmount).amount === 'number';
}

/**
 * Decorator that validates the amount property in method arguments
 * Throws error if amount is not a positive number
 */
export function ValidateAmount() {
    return function (
        target: object,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor
    ): PropertyDescriptor {
        const originalMethod = descriptor.value as AnyMethod;

        if (!originalMethod) {
            return descriptor;
        }

        descriptor.value = function (this: unknown, ...args: unknown[]): unknown {
            // Find argument with 'amount' property
            for (const arg of args) {
                if (isHasAmount(arg)) {
                    if (arg.amount <= 0) {
                        throw new Error(`❌ Validation Error: amount must be positive, got ${arg.amount}`);
                    }
                    if (!Number.isFinite(arg.amount)) {
                        throw new Error(`❌ Validation Error: amount must be a finite number`);
                    }
                    console.log(`✅ [Validated] amount: ${arg.amount}`);
                }
            }

            return originalMethod.apply(this, args);
        };

        return descriptor;
    };
}

/**
 * Decorator that validates currency codes
 */
export function ValidateCurrency<C extends readonly string[]>(validCurrencies: C) {
    return function (
        target: object,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor
    ): PropertyDescriptor {
        const originalMethod = descriptor.value as AnyMethod;

        if (!originalMethod) {
            return descriptor;
        }

        descriptor.value = function (this: unknown, ...args: unknown[]): unknown {
            for (const arg of args) {
                if (typeof arg === 'object' && arg !== null) {
                    const obj = arg as Record<string, unknown>;
                    if ('from' in obj && typeof obj.from === 'string') {
                        if (!validCurrencies.includes(obj.from as C[number])) {
                            throw new Error(`❌ Invalid currency: ${obj.from}`);
                        }
                    }
                    if ('to' in obj && typeof obj.to === 'string') {
                        if (!validCurrencies.includes(obj.to as C[number])) {
                            throw new Error(`❌ Invalid currency: ${obj.to}`);
                        }
                    }
                }
            }

            return originalMethod.apply(this, args);
        };

        return descriptor;
    };
}
