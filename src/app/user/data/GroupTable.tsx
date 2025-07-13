/**
 * @name GroupTable
 * @description
 * @author darcrand
 */

import { http } from '@/utils/http.client'
import { useMutation, useQuery } from '@tanstack/react-query'

export default function GroupTable() {
  const { data: groups } = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const res = await http.get('/api/group')
      return res.data
    },
  })

  const createMutation = useMutation({
    mutationFn: async (newGroup: any) => {
      const res = await http.post('/api/group', newGroup)
      return res
    },
  })

  return (
    <>
      <div>GroupTable</div>

      <button onClick={() => createMutation.mutate({ name: 'New Group', sort: 0 })}>Create New Group</button>

      <ol className="list-disc list-inside">
        {groups?.map((group: any) => (
          <li key={group.id} className="font-bold">
            {group.name}
          </li>
        ))}
      </ol>
    </>
  )
}
