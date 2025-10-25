import { NextResponse } from 'next/server'

type Address = {
  street_name?: string
  street_number?: number
  zip_code?: string
  city?: string
  state?: string
}

type Payer = {
  name?: string
  surname?: string
  email?: string
  phone?: {
    area_code?: string
    number?: string
  }
}

type Body = {
  title?: string
  quantity?: number
  unit_price?: number
  external_reference?: string
  items?: Array<{ title: string; quantity?: number; unit_price: number }>
  payer?: Payer
  shipping_option?: 'shipping' | 'pickup'
  address?: Address
  contact_number?: string
}


function cleanUrl(url: string) {
  // Reemplaza múltiples slashes por uno solo, excepto después de 'https://'
  return url.replace(/([^:])\/+/g, '$1/').replace(':/', '://')
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body

    const accessToken = process.env.MP_ACCESS_TOKEN
    if (!accessToken) {
      return NextResponse.json({ error: 'MP_ACCESS_TOKEN no configurado' }, { status: 500 })
    }

    // Usar items si vienen del cliente (carrito). Si no, caer al fallback.
    // IMPORTANTE: MercadoPago NO requiere centavos en Argentina para ARS, usa el valor directo
    const items = Array.isArray(body.items) && body.items.length > 0
      ? body.items.map((it) => ({
          title: it.title || 'Compra en Essenza',
          quantity: it.quantity ?? 1,
          unit_price: typeof it.unit_price === 'number' ? it.unit_price : Number(it.unit_price) || 0,
        }))
      : [
          {
            title: body.title || 'Compra en Essenza',
            quantity: body.quantity ?? 1,
            unit_price: body.unit_price ?? 100,
          },
        ]

    const baseUrl = (process.env.APP_BASE_URL || '').replace(/\/$/, '')
    
    // Validar que APP_BASE_URL existe y es válido
    if (!baseUrl || baseUrl.length === 0) {
      console.error('APP_BASE_URL no configurado o vacío:', process.env.APP_BASE_URL)
      return NextResponse.json({ error: 'APP_BASE_URL no configurado' }, { status: 500 })
    }
    
    if (!baseUrl.startsWith('https://')) {
      console.error('APP_BASE_URL debe ser HTTPS:', baseUrl)
      return NextResponse.json({ error: 'APP_BASE_URL debe ser HTTPS' }, { status: 500 })
    }

    // Construir payload simple y válido para MercadoPago
    const successUrl = `${baseUrl}/checkout/success`
    
    const payload: any = {
      items: items,
      back_urls: {
        success: successUrl,
        pending: successUrl,
        failure: successUrl,
      },
      auto_return: 'approved',
    }

    console.log('URLs de redirección:', { success: successUrl })

    // Agregar payer si fue enviado - SOLO con datos válidos
    if (body.payer && body.payer.email) {
      payload.payer = {
        email: body.payer.email,
      }
      if (body.payer.name) payload.payer.name = body.payer.name
      if (body.payer.surname) payload.payer.surname = body.payer.surname
      if (body.payer.phone && body.payer.phone.number) {
        payload.payer.phone = {
          area_code: body.payer.phone.area_code || '54',
          number: body.payer.phone.number,
        }
      }
    }

    // Agregar shipments si el usuario eligió envío y hay dirección
    if (body.shipping_option === 'shipping' && body.address && body.address.street_name) {
      payload.shipments = {
        receiver_address: {
          street_name: body.address.street_name,
          street_number: body.address.street_number || 0,
          zip_code: body.address.zip_code || '0000',
          city: body.address.city || 'Argentina',
          state: body.address.state || 'Argentina',
        },
      }
    }

    // Añadimos metadata opcional
    if (body.contact_number) {
      payload.metadata = { contact_number: body.contact_number }
    }

    console.log('Payload a enviar a MercadoPago:', JSON.stringify(payload, null, 2))

    const res = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error('Error de MercadoPago (status ' + res.status + '):', text)
      return NextResponse.json({ error: 'MP error', details: text }, { status: res.status })
    }

    const data = await res.json()
    // Actualizar las back_urls con el preference_id real
    const preference_id = data.id
    if (preference_id) {
      // Llamar a MP nuevamente con las URLs actualizadas - NO, esto sería innecesario
      // En su lugar, vamos a confiar en que MercadoPago captura los parámetros
    }
    
    return NextResponse.json({ 
      init_point: data.init_point, 
      preference_id: preference_id,
      payload_sent: payload 
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}
