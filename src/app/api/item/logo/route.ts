import axios from 'axios'
import * as cheerio from 'cheerio'
import { type NextRequest, NextResponse } from 'next/server'

// 获取网站 logo
export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams
  const url = search.get('url')
  if (!url) {
    return NextResponse.json({ message: 'url is required' }, { status: 400 })
  }

  if (url.length > 100) {
    return NextResponse.json({ message: 'url is too long' }, { status: 400 })
  }

  const targetUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`
  const parsedUrl = new URL(targetUrl)
  const hostname = parsedUrl.hostname
  const domainUrl = `https://${hostname}`
  const agent = request.headers.get('User-Agent')

  const response = await axios.get(domainUrl, { headers: { 'User-Agent': agent, Referer: domainUrl } })
  const html = response.data
  const $ = cheerio.load(html)

  // 尝试查找 logo 的优先级顺序
  const logoSelectors = [
    // Apple touch icon
    'link[rel="apple-touch-icon"]',
    'link[rel="apple-touch-icon-precomposed"]',

    // 标准 favicon
    'link[rel="icon"]',
    'link[rel="shortcut icon"]',

    // Open Graph 图片
    'meta[property="og:image"]',

    // Twitter 卡片图片
    'meta[name="twitter:image"]',
  ]

  let logoUrl: string | undefined = undefined

  // 按优先级查找 logo
  for (const selector of logoSelectors) {
    const element = $(selector).first()
    if (element.length) {
      if (selector.includes('link')) {
        logoUrl = element.attr('href')
      } else {
        logoUrl = element.attr('content')
      }

      if (logoUrl) break
    }
  }

  if (!logoUrl) {
    const faviconUrl = `${parsedUrl.protocol}//${hostname}/favicon.ico`
    try {
      const faviconResponse = await axios.head(faviconUrl)
      if (faviconResponse.status === 200) {
        logoUrl = faviconUrl
      }
    } catch (error) {
      console.log('没有找到默认的 favicon.ico')
    }
  }

  // 真没有
  if (!logoUrl) {
    return NextResponse.json({ message: '没有找到 logo' }, { status: 500 })
  }

  // 确保 logo URL 是绝对路径
  if (logoUrl.startsWith('//')) {
    logoUrl = parsedUrl.protocol + logoUrl
  } else if (logoUrl.startsWith('/')) {
    logoUrl = `${parsedUrl.protocol}//${hostname}${logoUrl}`
  } else if (!logoUrl.startsWith('http')) {
    logoUrl = new URL(logoUrl, targetUrl).href
  }

  return NextResponse.json({ message: 'success', data: logoUrl })
}
