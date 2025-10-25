import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    return NextResponse.json({
      success: true,
      received: body,
      message: 'Datos recibidos correctamente',
      items_count: body.items?.length || 0,
      total: body.items?.reduce((sum: number, item: any) => sum + (item.unit_price * (item.quantity || 1)), 0) || 0
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
