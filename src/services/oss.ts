import { http } from '@/utils/http.client'

export const ossService = {
  upload(filename: string, file: File) {
    return http.post<string>('/api/oss/upload', file, { params: { filename }, headers: { 'Content-Type': file.type } })
  },
}
