import { notFound } from "next/navigation"
import { getRequestConfig } from "next-intl/server"

export default getRequestConfig(async ({ locale }) => {
  if (!locale.includes(locale as any)) notFound()
  return {
    messages: (await import(`./assets/locales/${locale}.json`)).default
  }
})