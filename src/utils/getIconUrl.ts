import axios from 'axios'
import * as cheerio from 'cheerio'
import 'server-only'

// 获取网站 logo
export async function getIconUrl(url?: string): Promise<string | null> {
  if (typeof url !== 'string' || url.trim().length === 0 || url.trim().length > 100) {
    return null
  }

  const targetUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`
  const parsedUrl = new URL(targetUrl)
  const hostname = parsedUrl.hostname
  const domainUrl = `https://${hostname}`

  try {
    const response = await axios.get(domainUrl, {
      timeout: 10000,
      headers: {
        Referer: domainUrl,
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    })
    const html = response.data
    const $ = cheerio.load(html)

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

    // 默认的 favicon 路径
    if (!logoUrl) {
      logoUrl = `${parsedUrl.protocol}//${hostname}/favicon.ico`
    }

    // 确保 logo URL 是绝对路径
    if (logoUrl.startsWith('//')) {
      logoUrl = parsedUrl.protocol + logoUrl
    } else if (logoUrl.startsWith('/')) {
      logoUrl = `${parsedUrl.protocol}//${hostname}${logoUrl}`
    } else if (!logoUrl.startsWith('http')) {
      logoUrl = new URL(logoUrl, targetUrl).href
    }

    return logoUrl
  } catch (error) {
    console.log('Error fetching icon:', error)
    return null
  }
}
