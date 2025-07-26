/**
 * @name ThemeDefault
 * @description
 * @author darcrand
 */

'use client'
import { Item } from '@/db/schema/items'
import { useAllData } from '@/hooks/useAllData'
import { itemService } from '@/services/item'
import { cls } from '@/utils/cls'
import { useQuery } from '@tanstack/react-query'
import { Settings, Table2 } from 'lucide-react'
import Link from 'next/link'

export default function ThemeDefault() {
  const { list } = useAllData()

  return (
    <>
      <HeaderContent />

      <ul className="my-8 space-y-8">
        {list.map((g) => (
          <li key={g.id}>
            <h3 className="my-4 text-center text-3xl font-bold">
              <span className="relative after:absolute after:bottom-0 after:left-full after:z-0 after:inline-block after:h-2 after:w-2 after:bg-lime-400">
                {g.name}
              </span>
            </h3>

            <ul className="rouded-lg mx-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6">
              {g.items.map((i) => (
                <li
                  key={i.id}
                  className="m-4 rounded-lg border border-gray-300 bg-white transition-all hover:shadow-md"
                >
                  <Link href={i.url || '#'} target="_blank" className="flex items-center gap-2 p-4">
                    <ItemLogo data={i} />

                    <article>
                      <h4 className="truncate text-lg font-bold text-gray-800">{i.name}</h4>
                      <p className="truncate text-gray-500">{i.desc}</p>
                    </article>
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </>
  )
}

function HeaderContent() {
  const { userInfo } = useAllData()

  const menus = [
    { title: 'Profile', url: '/user/profile', icon: <Settings /> },
    { title: 'Data Edit', url: '/user/data', icon: <Table2 /> },
  ]

  return (
    <header className="flex items-center justify-between bg-white px-4 shadow">
      <h1 className="text-4xl font-bold text-lime-400">Web Marks</h1>
      <nav className="group/menu relative my-2 flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 transition-all hover:bg-gray-50">
        <span className="text-xl text-gray-800">{userInfo?.name || 'no name'}</span>
        <i
          className="block h-12 w-12 rounded-full bg-gray-200 bg-cover bg-center"
          style={{ backgroundImage: userInfo?.avatar ? `url(${userInfo?.avatar})` : undefined }}
        />

        <div className="invisible absolute top-full right-0 z-10 opacity-0 transition-all group-hover/menu:visible group-hover/menu:opacity-100">
          <ol className="mt-1 w-40 rounded bg-white shadow">
            {menus.map((v) => (
              <li key={v.title} className="hover:bg-gray-50">
                <Link href={v.url} className="flex items-center gap-2 px-4 py-2 text-lg !text-gray-500">
                  {v.icon}
                  {v.title}
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </nav>
    </header>
  )
}

function ItemLogo(props: { data: Item; className?: string }) {
  const { data } = useQuery({
    enabled: !!props.data.url,
    queryKey: ['item', 'logo', props.data.url],
    staleTime: 1000 * 60 * 60 * 24,
    queryFn: async () => {
      const res = await itemService.getLogo(props.data.url || '')
      return res
    },
  })

  const { data: logoUrl } = useQuery({
    queryKey: ['item', 'logo-url', data, props.data.iconUrl],
    queryFn: async () => {
      let res = ''
      try {
        res = await loadImageAsync(data)
      } catch (error) {
        console.log(error)
        res = await loadImageAsync(props.data.iconUrl || '')
      }

      return res
    },
  })

  return (
    <i
      style={{ backgroundImage: logoUrl ? `url(${logoUrl})` : undefined }}
      className={cls('h-12 w-12 rounded-full bg-gray-200 bg-cover', props.className)}
    />
  )
}

async function loadImageAsync(url?: string, timeout: number = 2000): Promise<string> {
  if (!url) {
    throw new Error('URL不能为空')
  }

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(url)
    img.onerror = () => reject(new Error(`图片加载失败: ${url}`))
    img.src = url

    // 设置超时机制，避免无限等待
    setTimeout(() => {
      reject(new Error(`请求超时: ${url}`))
      img.src = '' // 中断加载
    }, timeout)
  })
}
