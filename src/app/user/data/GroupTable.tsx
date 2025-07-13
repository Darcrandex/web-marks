/**
 * @name GroupTable
 * @description
 * @author darcrand
 */

import { http } from '@/utils/http.client'
import { useQuery } from '@tanstack/react-query'

export default function GroupTable() {
  const { data: groups } = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const res = await http.get('/api/user')
      return res.data
    },
  })

  return (
    <>
      <div>GroupTable</div>

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
