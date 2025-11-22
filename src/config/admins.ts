const ADMIN_EMAILS = ["hzjsj895@gmail.com"];

export function isAdminEmail(email?: string | null) {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

export const FOUNDER_EMAIL = "hzjsj895@gmail.com";

export function isFounderEmail(email?: string | null) {
  if (!email) return false;
  return email.toLowerCase() === FOUNDER_EMAIL;
}

export { ADMIN_EMAILS };


