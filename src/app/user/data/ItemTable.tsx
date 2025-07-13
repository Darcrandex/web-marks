/**
 * @name ItemTable
 * @description
 * @author darcrand
 */

'use client'
import { Group } from '@/db/schema/groups'
import { http } from '@/utils/http.client'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useReactive } from 'ahooks'

export default function ItemTable() {
  const { data: groups } = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const res = await http.get('/api/group')
      return res.data
    },
  })

  const { data: items } = useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const res = await http.get('/api/item')
      return res.data
    },
  })

  // form
  const form = useReactive({
    groupId: '',
    url: '',
    name: '',
    desc: '',
    iconUrl: '',
  })

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await http.post('/api/item', form)
      return res.data
    },
    onSuccess: () => {},
  })

  return (
    <>
      <div>ItemTable</div>

      <section>
        <p>groupId</p>

        <div>
          {groups?.map((group: Group) => (
            <span
              key={group.id}
              className={form.groupId === group.id ? 'text-blue-400' : ''}
              onClick={() => (form.groupId = group.id)}
            >
              {group.name}
            </span>
          ))}
        </div>

        <p>name</p>
        <input type="text" value={form.name} onChange={(e) => (form.name = e.target.value)} />
        <p>desc</p>
        <textarea rows={5} value={form.desc} onChange={(e) => (form.desc = e.target.value)} />
        <p>url</p>
        <input type="text" value={form.url} onChange={(e) => (form.url = e.target.value)} />
        <p>iconUrl</p>
        <input type="text" value={form.iconUrl} onChange={(e) => (form.iconUrl = e.target.value)} />
      </section>

      <button type="button" onClick={() => createMutation.mutate()}>
        add
      </button>
    </>
  )
}
