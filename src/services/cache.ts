// Simple in-memory cache with timestamp tracking

interface CacheEntry<T> {
  data: T;
  lastFetched: number;
}

class CacheManager {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private defaultStaleTime: number = 1000 * 60 * 60; // 1 hour

  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      lastFetched: Date.now(),
    });
  }

  get<T>(key: string, staleTime?: number): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    const maxAge = staleTime || this.defaultStaleTime;
    const isStale = Date.now() - entry.lastFetched > maxAge;

    if (isStale) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  has(key: string, staleTime?: number): boolean {
    return this.get(key, staleTime) !== null;
  }

  clear(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  getAge(key: string): number | null {
    const entry = this.cache.get(key);
    return entry ? Date.now() - entry.lastFetched : null;
  }
}

export const cacheManager = new CacheManager();

// Cache keys
export const CACHE_KEYS = {
  DASHBOARD: 'dashboard',
  META: 'meta',
  PROFILES: 'profiles',
  USER_PROFILE: 'user_profile',
  SUBSCRIPTIONS: 'subscriptions',
  USERS: 'admin_users',
  SUPPORT_TICKETS: 'support_tickets',
};
