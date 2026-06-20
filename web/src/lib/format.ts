import { normalizePhoneNumber } from "@/lib/phone";

export function formatPhoneNumber(phone: string): string {
  const normalizedPhone = normalizePhoneNumber(phone);

  if (normalizedPhone.length !== 10) {
    return phone;
  }

  return `(${normalizedPhone.slice(0, 3)})-${normalizedPhone.slice(3, 6)}-${normalizedPhone.slice(6)}`;
}
