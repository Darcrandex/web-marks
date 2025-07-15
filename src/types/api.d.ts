declare namespace API {
  // nextjs 本身没有定义 context 的类型，所以需要自己定义
  interface NextRequestContext {
    params: Promise<Record<string, string>>
  }

  interface Result<T = any> {
    message: string
    data?: T
  }
}
