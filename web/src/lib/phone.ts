export function normalizePhoneNumber(phone: string) {
  return phone.replace(/\D/g, "");
}

export function isValidPhoneNumber(phone: string) {
  return normalizePhoneNumber(phone).length === 10;
}
