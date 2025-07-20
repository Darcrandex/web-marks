/**
 * @name NextProgressBar
 * @description
 * @author darcrand
 */

'use client'
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar'

export default function NextProgressBar() {
  return <ProgressBar height="4px" color="#fffd00" options={{ showSpinner: false }} shallowRouting />
}
