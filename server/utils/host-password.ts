export function hasConfiguredHostPassword(password: unknown): password is string {
  return typeof password === 'string' && password.trim().length > 0
}
