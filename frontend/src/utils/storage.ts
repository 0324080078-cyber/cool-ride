const KEY_PREFIX = 'coolride:'

export const storage = {
  get<T>(key: string): T | null {
    const raw = localStorage.getItem(KEY_PREFIX + key)
    return raw ? (JSON.parse(raw) as T) : null
  },
  set<T>(key: string, value: T) {
    localStorage.setItem(KEY_PREFIX + key, JSON.stringify(value))
  },
  remove(key: string) {
    localStorage.removeItem(KEY_PREFIX + key)
  },
}
