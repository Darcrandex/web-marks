/**
 * @name MainPage
 * @description
 * @author darcrand
 */

import { redirect } from 'next/navigation'

async function getThemeId() {
  return 'def'
}

export default async function MainPage() {
  const theme = await getThemeId()

  redirect(`/${theme}`)
}
