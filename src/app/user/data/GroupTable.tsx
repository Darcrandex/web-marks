/**
 * @name GroupTable
 * @description
 * @author darcrand
 */

import { Group } from '@/db/schema/groups'
import { http } from '@/utils/http.client'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useReactive, useToggle } from 'ahooks'
import { Button, Drawer, Form, Input } from 'antd'

export default function GroupTable() {
  const { data: groups } = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const res = await http.get('/api/group')
      return res.data
    },
  })

  const [form] = Form.useForm()
  const [openDrawer, { toggle: toggleDrawer }] = useToggle(false)

  const submit = useMutation({
    mutationFn: async (values: Group) => {
      if (values.id) {
        const res = await http.patch(`/api/group/${values.id}`, values)
        return res
      }

      const res = await http.post('/api/group', values)
      return res
    },

    onSuccess() {
      toggleDrawer()
      form.resetFields()
    },
  })

  return (
    <>
      <div>GroupTable</div>

      <header>
        <Button
          onClick={() => {
            form.resetFields()
            toggleDrawer()
          }}
        >
          Create
        </Button>
      </header>

      <ol className="list-disc list-inside">
        {groups?.map((group: any) => (
          <li key={group.id} className="font-bold">
            {group.name}
          </li>
        ))}
      </ol>

      <Drawer open={openDrawer} onClose={toggleDrawer} title="Create/Update Group">
        <Form form={form} onFinish={submit.mutate}>
          <Form.Item name="id" hidden>
            <input />
          </Form.Item>

          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  )
}
