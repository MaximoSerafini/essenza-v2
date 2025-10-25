"use client"

import React from 'react'

type Props = {
  title?: string
  quantity?: number
  unit_price?: number
  external_reference?: string
  children?: React.ReactNode
}

export default function MercadoCheckout({ title, quantity = 1, unit_price = 100, external_reference, children }: Props) {
  const [loading, setLoading] = React.useState(false)

  async function handleCheckout(e?: React.MouseEvent) {
    e?.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/mercadopago/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, quantity, unit_price, external_reference }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Error creando preferencia')

      if (data.init_point) {
        // redirigir a la url de checkout
        window.location.assign(data.init_point)
      } else {
        throw new Error('init_point no recibido')
      }
    } catch (err: any) {
      console.error(err)
      alert('No se pudo iniciar pago: ' + (err.message || String(err)))
    } finally {
      setLoading(false)
    }
  }

  return (
    <button className="px-4 py-2 bg-emerald-600 text-white rounded disabled:opacity-60" onClick={handleCheckout} disabled={loading}>
      {children ?? (loading ? 'Redirigiendo...' : 'Pagar con MercadoPago')}
    </button>
  )
}
