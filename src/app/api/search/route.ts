import { NextRequest, NextResponse } from 'next/server'
import { getProducts } from '@/lib/products'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') || ''
  const limit = parseInt(searchParams.get('limit') || '10', 10)

  if (!q.trim()) {
    return NextResponse.json({ products: [] })
  }

  const products = await getProducts({ search: q, limit })
  return NextResponse.json({ products })
}
