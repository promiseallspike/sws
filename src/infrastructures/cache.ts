import { caching, MemoryCache } from 'cache-manager';
import * as _ from 'lodash';

let memoryCache: MemoryCache;
export async function init(): Promise<void> {
  if (memoryCache) {
    return;
  }
  memoryCache = await caching('memory', {
    max: 100,
    ttl: 10 * 1000 /*milliseconds*/,
  });
}

export function buildKey(
  partition: string,
  key_params?: Record<string, string | number | boolean>,
): string {
  const combined = _.map(key_params, (key, val) => `${key}:${val}`);
  return [partition, ...combined].join('_');
}

export async function set<T>(options: {
  partition: string;
  key_params?: Record<string, string | number | string | boolean>;
  value: T;
}): Promise<void> {
  const { partition, key_params, value } = options;
  await memoryCache.set(buildKey(partition, key_params), JSON.stringify(value));
}

export async function get<T>(options: {
  partition: string;
  key_params?: Record<string, string | number | boolean>;
}): Promise<T | null> {
  const { partition, key_params } = options;
  const key = buildKey(partition, key_params);
  const result = (await memoryCache.get(key)) as string | null;
  return result ? JSON.parse(result) : null;
}
