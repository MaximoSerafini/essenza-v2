"use client"

import React from 'react'
import Image from 'next/image'
import { Lock, Truck, Package } from 'lucide-react'

type CartItem = {
  id: number
  nombre: string
  marca?: string
  precio: number
  quantity?: number
}

export default function CheckoutPage() {
  const [cart, setCart] = React.useState<CartItem[]>([])

  const [name, setName] = React.useState('')
  const [surname, setSurname] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [contactNumber, setContactNumber] = React.useState('')

  const [shippingOption, setShippingOption] = React.useState<'shipping' | 'pickup'>('shipping')
  const [streetName, setStreetName] = React.useState('')
  const [streetNumber, setStreetNumber] = React.useState<number | ''>('')
  const [zipCode, setZipCode] = React.useState('')
  const [city, setCity] = React.useState('')
  const [state, setState] = React.useState('')

  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('essenza-cart')
      if (saved) {
        const parsed = JSON.parse(saved) as any[]
        const items: CartItem[] = parsed.map((p) => ({
          id: p.id,
          nombre: p.nombre,
          marca: p.marca,
          precio: p.precio ?? p.precio,
          quantity: p.quantity ?? 1,
        }))
        setCart(items)
      }
    } catch (e) {
      console.error('Error leyendo carrito desde localStorage', e)
    }
  }, [])

  const subtotal = React.useMemo(() => cart.reduce((sum, it) => sum + it.precio * (it.quantity ?? 1), 0), [cart])

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault()
    if (cart.length === 0) {
      alert('El carrito está vacío')
      return
    }

    setLoading(true)
    try {
      const payload: any = {
        items: cart.map((it) => ({ 
          title: it.nombre, 
          quantity: it.quantity ?? 1, 
          unit_price: it.precio 
        })),
        external_reference: undefined,
        payer: {
          name,
          surname,
          email,
          phone: { area_code: '', number: phone },
        },
        shipping_option: shippingOption,
        contact_number: contactNumber,
      }

      // Debug: mostrar lo que se va a enviar
      console.log('Payload a enviar:', JSON.stringify(payload, null, 2))

      if (shippingOption === 'shipping') {
        payload.address = {
          street_name: streetName,
          street_number: Number(streetNumber) || 0,
          zip_code: zipCode,
          city,
          state,
        }
      }

      const res = await fetch('/api/mercadopago/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) {
        // Mostrar detalle de error de MercadoPago si existe
        const details = data?.details ? `\nDetalles: ${data.details}` : ''
        throw new Error((data?.error || 'Error creando preferencia') + details)
      }

      if (data.init_point) {
        // redirigir al checkout de MercadoPago
        window.location.assign(data.init_point)
      } else {
        throw new Error('init_point no recibido')
      }
    } catch (err: any) {
      console.error(err)
      alert('Error: ' + (err.message || String(err)))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="relative w-32 h-10">
              <a href="/">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura_de_pantalla_2025-06-10_210739-removebg-preview-u5U4MnjC9NBIef2Jym8Y8xXxKFGuoa.png"
                  alt="Essenza Logo"
                  fill
                  className="object-contain"
                />
              </a>
            </div>
            <span className="text-sm text-gray-600">Finalizar compra</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {cart.length === 0 ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Tu carrito está vacío</h2>
              <p className="text-gray-600 mb-6">Agrega productos antes de finalizar la compra</p>
              <a href="/" className="inline-block bg-[#5D2A71] text-white px-6 py-3 rounded-lg hover:bg-[#4A2259] transition-colors">
                Volver a tienda
              </a>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Resumen de compra */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Datos del comprador */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-[#5D2A71] mb-6">Datos personales</h2>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre</label>
                        <input
                          placeholder="Juan"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#5D2A71] focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Apellido</label>
                        <input
                          placeholder="Pérez"
                          value={surname}
                          onChange={(e) => setSurname(e.target.value)}
                          required
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#5D2A71] focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          placeholder="juan@ejemplo.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#5D2A71] focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Teléfono</label>
                        <input
                          placeholder="+54 9 3794 123456"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#5D2A71] focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Número de contacto adicional</label>
                      <input
                        placeholder="Otro número de teléfono"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#5D2A71] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Envío o retiro */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-[#5D2A71] mb-6">Modalidad de entrega</h2>
                  
                  <div className="space-y-4">
                    <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#5D2A71] hover:bg-purple-50 transition-all" onClick={() => setShippingOption('shipping')}>
                      <input
                        type="radio"
                        checked={shippingOption === 'shipping'}
                        onChange={() => setShippingOption('shipping')}
                        className="w-5 h-5 accent-[#5D2A71]"
                      />
                      <Truck className="h-5 w-5 text-[#5D2A71] ml-3" />
                      <div className="ml-3">
                        <p className="font-semibold text-gray-900">Envío a domicilio</p>
                        <p className="text-sm text-gray-500">Entrega en tu dirección</p>
                      </div>
                    </label>

                    <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#5D2A71] hover:bg-purple-50 transition-all" onClick={() => setShippingOption('pickup')}>
                      <input
                        type="radio"
                        checked={shippingOption === 'pickup'}
                        onChange={() => setShippingOption('pickup')}
                        className="w-5 h-5 accent-[#5D2A71]"
                      />
                      <Package className="h-5 w-5 text-[#5D2A71] ml-3" />
                      <div className="ml-3">
                        <p className="font-semibold text-gray-900">Retiro (a coordinar)</p>
                        <p className="text-sm text-gray-500">Coordina con nosotros el retiro</p>
                      </div>
                    </label>
                  </div>

                  {/* Dirección condicional */}
                  {shippingOption === 'shipping' && (
                    <div className="mt-6 space-y-4 pt-6 border-t-2 border-gray-200">
                      <h3 className="font-semibold text-gray-900 text-lg">Dirección de envío</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Calle</label>
                          <input
                            placeholder="Avenida Principal"
                            value={streetName}
                            onChange={(e) => setStreetName(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#5D2A71] focus:outline-none transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Número</label>
                          <input
                            placeholder="123"
                            type="number"
                            value={streetNumber as any}
                            onChange={(e) => setStreetNumber(e.target.value === '' ? '' : Number(e.target.value))}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#5D2A71] focus:outline-none transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Código postal</label>
                          <input
                            placeholder="3400"
                            value={zipCode}
                            onChange={(e) => setZipCode(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#5D2A71] focus:outline-none transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Localidad</label>
                          <input
                            placeholder="Corrientes"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#5D2A71] focus:outline-none transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Provincia</label>
                          <input
                            placeholder="Corrientes"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#5D2A71] focus:outline-none transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Botón de pago */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#5D2A71] to-[#8B4A99] hover:from-[#4A2259] hover:to-[#6B3A79] text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-60 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <Lock className="h-5 w-5" />
                  {loading ? 'Procesando...' : 'Pagar con MercadoPago'}
                </button>

                <a
                  href="/"
                  className="block w-full text-center text-gray-600 hover:text-gray-900 font-semibold py-3 transition-colors"
                >
                  Volver a la tienda
                </a>
              </form>
            </div>

            {/* Resumen del carrito (sidebar) */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-24">
                <h3 className="text-2xl font-bold text-[#5D2A71] mb-6">Resumen</h3>
                
                <div className="space-y-4 mb-6 max-h-72 overflow-y-auto">
                  {cart.map((it) => (
                    <div key={it.id} className="flex justify-between items-start pb-4 border-b border-gray-200">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm">{it.nombre}</p>
                        <p className="text-xs text-gray-500">{it.marca}</p>
                        <p className="text-xs text-gray-600 mt-1">x{it.quantity ?? 1}</p>
                      </div>
                      <p className="font-bold text-gray-900 text-right">
                        ${(it.precio * (it.quantity ?? 1)).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-6 border-t-2 border-gray-200">
                  <div className="flex justify-between items-center text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-semibold">${subtotal.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg px-4">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-[#5D2A71]">${subtotal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-xs text-green-700 flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    <span><strong>Pago seguro</strong> con MercadoPago</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
