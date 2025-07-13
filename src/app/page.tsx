/**
 * @name MainPage
 * @description
 * @author darcrand
 */

import { redirect } from 'next/navigation'

async function getThemeId() {
  const roll = Date.now() % 2 === 0
  return roll ? 'sky' : 'def'
}

export default async function MainPage() {
  const theme = await getThemeId()

  redirect(`/${theme}`)
}
