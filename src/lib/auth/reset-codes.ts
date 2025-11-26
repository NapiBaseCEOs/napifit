// In-memory code storage (production'da Redis veya database kullanılmalı)
const resetCodes = new Map<string, { code: string; expiresAt: number }>();

export function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function storeResetCode(email: string, code: string, expiresInMinutes = 10): void {
  const expiresAt = Date.now() + expiresInMinutes * 60 * 1000;
  resetCodes.set(email, { code, expiresAt });
}

export function getResetCode(email: string): { code: string; expiresAt: number } | undefined {
  return resetCodes.get(email);
}

export function verifyResetCode(email: string, code: string): boolean {
  const stored = resetCodes.get(email);
  if (!stored) return false;
  if (Date.now() > stored.expiresAt) {
    resetCodes.delete(email);
    return false;
  }
  return stored.code === code;
}

export function deleteResetCode(email: string): void {
  resetCodes.delete(email);
}


