/**
 * Cache Decorator
 * Demonstrates: Method Decorator, Closure, Map data structure
 * 
 * Caches method results with TTL (time-to-live)
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyMethod = (...args: any[]) => Promise<any>;

interface CacheEntry {
    value: unknown;
    expiry: number;
}

/**
 * Decorator factory that creates a caching decorator
 * @param ttlMs - Time-to-live in milliseconds (default: 60000 = 1 minute)
 */
export function Cache(ttlMs: number = 60000) {
    // Cache storage shared across all method calls
    const cache = new Map<string, CacheEntry>();

    return function (
        target: object,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor
    ): PropertyDescriptor {
        const originalMethod = descriptor.value as AnyMethod;

        if (!originalMethod) {
            return descriptor;
        }

        descriptor.value = async function (this: unknown, ...args: unknown[]): Promise<unknown> {
            const cacheKey = `${String(propertyKey)}:${JSON.stringify(args)}`;
            const now = Date.now();

            // Check cache
            const cached = cache.get(cacheKey);
            if (cached && cached.expiry > now) {
                console.log(`💾 [Cache Hit] ${String(propertyKey)}`);
                return cached.value;
            }

            // Cache miss - call original method
            console.log(`🔄 [Cache Miss] ${String(propertyKey)}`);
            const result: unknown = await originalMethod.apply(this, args);

            // Store in cache
            cache.set(cacheKey, {
                value: result,
                expiry: now + ttlMs
            });

            return result;
        };

        return descriptor;
    };
}

/**
 * Clear all cached values
 * Utility function for testing
 */
export function clearCache(): void {
    console.log('🗑️ Cache cleared');
}
