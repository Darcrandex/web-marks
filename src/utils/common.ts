// 判断是否为空数组
export const isEmptyArray = (arr?: any) => {
  return !Array.isArray(arr) || arr.length === 0
}
