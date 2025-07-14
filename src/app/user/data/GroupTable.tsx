/**
 * @name GroupTable
 * @description
 * @author darcrand
 */

import { Group } from '@/db/schema/groups'
import { http } from '@/utils/http.client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useReactive, useToggle } from 'ahooks'
import { Button, Drawer, Form, Input } from 'antd'

export default function GroupTable() {
  const queyClient = useQueryClient()

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
      queyClient.invalidateQueries({ queryKey: ['groups'] })
    },
  })

  const onAdd = () => {
    form.resetFields()
    toggleDrawer()
  }

  const onUpdate = (group: Group) => {
    form.setFieldsValue(group)
    toggleDrawer()
  }

  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await http.delete(`/api/group/${id}`)
      return res
    },

    onSuccess() {
      queyClient.invalidateQueries({ queryKey: ['groups'] })
    },
  })

  const onRemove = (id: string) => {
    removeMutation.mutate(id)
  }

  return (
    <>
      <div>GroupTable</div>

      <header>
        <Button onClick={onAdd}>Create</Button>
      </header>

      <ol className="space-y-2">
        {groups?.map((group: any) => (
          <li key={group.id}>
            <p className="font-bold">{group.name}</p>
            <footer>
              <Button type="link" onClick={() => onUpdate(group)}>
                Update
              </Button>
              <Button type="link" onClick={() => onRemove(group.id)}>
                remove
              </Button>
            </footer>
          </li>
        ))}
      </ol>

      <Drawer open={openDrawer} onClose={toggleDrawer} title="Create/Update Group">
        <Form layout="vertical" form={form} onFinish={submit.mutate}>
          <Form.Item name="id" hidden>
            <input />
          </Form.Item>

          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submit.isPending}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  )
}
