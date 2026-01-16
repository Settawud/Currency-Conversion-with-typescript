/**
 * Log Decorator
 * Demonstrates: Method Decorator, Decorator Factory
 * 
 * Logs method calls with arguments and return values
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyMethod = (...args: any[]) => any;

/**
 * Decorator factory that creates a logging decorator
 * @param prefix - Optional prefix for log messages
 */
export function Log(prefix: string = '📝') {
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
            const methodName = String(propertyKey);
            const argsString = args.map(arg => JSON.stringify(arg)).join(', ');

            console.log(`${prefix} [${methodName}] Called with: ${argsString}`);

            const result: unknown = originalMethod.apply(this, args);

            // Handle promises
            if (result instanceof Promise) {
                return result.then((resolved: unknown) => {
                    console.log(`${prefix} [${methodName}] Returned: ${JSON.stringify(resolved)}`);
                    return resolved;
                });
            }

            console.log(`${prefix} [${methodName}] Returned: ${JSON.stringify(result)}`);
            return result;
        };

        return descriptor;
    };
}
