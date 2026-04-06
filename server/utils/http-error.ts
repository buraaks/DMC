export function createHttpError(options: { statusCode: number, statusMessage: string }) {
  return Object.assign(new Error(options.statusMessage), options)
}
