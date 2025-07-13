'use server'

import CryptoJS from 'crypto-js'

const AES_SECRET_KEY = process.env.AES_SECRET_KEY || 'abc'

export async function aesEncrypt(payload: any) {
  const content = JSON.stringify(payload)
  const ciphertext = CryptoJS.AES.encrypt(content, AES_SECRET_KEY).toString()
  return encodeURIComponent(ciphertext)
}

export async function aesDecrypt<T = any>(ciphertext: string) {
  const decodedCiphertext = decodeURIComponent(ciphertext)
  const bytes = CryptoJS.AES.decrypt(decodedCiphertext, AES_SECRET_KEY)
  const originalText = bytes.toString(CryptoJS.enc.Utf8)
  const payload = JSON.parse(originalText)
  return payload as T
}
