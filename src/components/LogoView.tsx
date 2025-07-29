/**
 * @name LogoView
 * @description
 * @author darcrand
 */

'use client'
import { cls } from '@/utils/cls'
import { loadImageAsync } from '@/utils/loadImageAsync'
import { useQuery } from '@tanstack/react-query'

export default function LogoView(props: { src?: any; className?: string }) {
  const { data: imgUrl } = useQuery({
    queryKey: ['logo', props.src],
    queryFn: async () => {
      return await loadImageAsync(props.src)
    },
  })

  if (!imgUrl) return <i className={cls('h-4 w-4 rounded-full bg-gray-200', props.className)} />

  return (
    <img
      src={imgUrl}
      alt=""
      referrerPolicy="no-referrer"
      crossOrigin="anonymous"
      decoding="async"
      loading="lazy"
      className={cls('h-4 w-4 rounded-full bg-cover bg-center', props.className)}
    />
  )
}
