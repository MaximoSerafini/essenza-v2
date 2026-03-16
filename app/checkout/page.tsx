"use client"

import React from 'react'
import Image from 'next/image'
import { MessageCircle, Package, ArrowLeft, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'

import { perfumes } from '@/lib/data'

type CartItem = {
  id: number
  nombre: string
  marca?: string
  precio: number
  quantity?: number
  imagen?: string
}

export default function CheckoutPage() {
  const [cart, setCart] = React.useState<CartItem[]>([])

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('essenza-cart')
      if (saved) {
        const parsed = JSON.parse(saved) as any[]
        const items: CartItem[] = parsed.map((p) => {
          // Si falta la imagen, buscamos en la base de datos maestra
          let imagen = p.imagen
          if (!imagen) {
            const originalPerfume = perfumes.find(pf => pf.id === p.id)
            if (originalPerfume) {
              imagen = originalPerfume.imagen
            }
          }
          
          return {
            id: p.id,
            nombre: p.nombre,
            marca: p.marca,
            precio: p.precio,
            quantity: p.quantity ?? 1,
            imagen: imagen,
          }
        })
        setCart(items)
      }
    } catch (e) {
      console.error('Error leyendo carrito desde localStorage', e)
    }
  }, [])

  const subtotal = React.useMemo(() => cart.reduce((sum, it) => sum + it.precio * (it.quantity ?? 1), 0), [cart])

  function handleWhatsAppOrder() {
    const cartSummary = cart.map(it => `• *${it.nombre}* x${it.quantity ?? 1}: $${(it.precio * (it.quantity ?? 1)).toLocaleString('es-AR')}`).join('%0A')
    const phoneNumber = '5493794222701'
    const message = `¡Hola! 👋 Me gustaría confirmar mi pedido en *Essenza Perfumes*.%0A%0A*Detalles del pedido:*%0A${cartSummary}%0A%0A💰 *Total a coordinar:* $${subtotal.toLocaleString('es-AR')}%0A%0APor favor, confirmame la disponibilidad y coordinamos los detalles de pago y entrega. ¡Gracias!`
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 font-sans antialiased overflow-x-hidden">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-xl border-b border-purple-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <a href="/" className="flex items-center gap-2 group transition-all shrink-0">
              <div className="bg-purple-100 p-2 rounded-full group-hover:bg-purple-200 transition-colors">
                <ArrowLeft className="h-4 w-4 text-[#5D2A71]" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-[#5D2A71] hidden xs:inline">Volver</span>
            </a>
            <div className="relative w-24 sm:w-32 h-8 sm:h-10">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura_de_pantalla_2025-06-10_210739-removebg-preview-u5U4MnjC9NBIef2Jym8Y8xXxKFGuoa.png"
                alt="Essenza Logo"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          {cart.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-md rounded-2xl sm:rounded-3xl p-8 sm:p-16 text-center shadow-2xl shadow-purple-900/10 border border-white">
              <Package className="h-16 w-16 sm:h-20 sm:w-20 text-purple-200 mx-auto mb-6" />
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4 tracking-tight">Tu carrito está vacío</h2>
              <button className="bg-[#5D2A71] hover:bg-black text-white px-8 sm:px-10 py-4 sm:py-6 rounded-2xl text-base sm:text-lg font-bold shadow-xl shadow-purple-900/20 transform hover:scale-105 transition-all">
                <a href="/">Explorar Catálogo</a>
              </button>
            </div>
          ) : (
            <div className="flex flex-col lg:grid lg:grid-cols-5 gap-6 sm:gap-10">
              {/* Order Details */}
              <div className="lg:col-span-3 space-y-6 sm:space-y-8 order-2 lg:order-1">
                <div className="bg-white/80 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-xl shadow-purple-900/5 border border-white overflow-hidden">
                  <div className="p-6 sm:p-8 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-transparent">
                    <h2 className="text-xl sm:text-2xl font-black text-[#5D2A71] tracking-tight flex items-center gap-3">
                      <Package className="h-5 w-5 sm:h-6 sm:w-6" />
                      Resumen de tu pedido
                    </h2>
                  </div>

                  <div className="p-4 sm:p-8 space-y-4 sm:space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {cart.map((it) => (
                      <div key={it.id} className="flex gap-4 sm:gap-6 items-center group transition-all">
                        <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-100 to-pink-50 p-2 flex-shrink-0 border border-purple-50 group-hover:scale-105 transition-transform relative overflow-hidden">
                          {it.imagen ? (
                            <Image
                              src={it.imagen}
                              alt={it.nombre}
                              fill
                              className="object-contain p-1"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-purple-300">
                              <Package className="h-6 w-6 sm:h-8 sm:w-8" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 leading-tight mb-0.5 group-hover:text-purple-700 transition-colors uppercase tracking-tighter text-[10px] sm:text-xs truncate">{it.marca}</p>
                          <p className="text-xs sm:text-sm font-medium text-gray-600 line-clamp-1">{it.nombre}</p>
                          <p className="inline-block mt-1 px-2 py-0.5 bg-gray-100 rounded-lg text-[10px] font-bold text-gray-500 uppercase tracking-widest">x{it.quantity ?? 1}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-black text-purple-900 text-sm sm:text-lg">
                            ${(it.precio * (it.quantity ?? 1)).toLocaleString('es-AR')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex items-start gap-3 sm:gap-4">
                  <div className="bg-emerald-100 p-2 sm:p-3 rounded-xl sm:rounded-2xl shrink-0">
                    <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-900 tracking-tight text-sm sm:text-base">Atención personalizada</h4>
                    <p className="text-[11px] sm:text-sm text-emerald-700 leading-relaxed">Al confirmar, coordinarás el envío y el método de pago directamente con nosotros por WhatsApp.</p>
                  </div>
                </div>
              </div>

              {/* Action Sidebar */}
              <div className="lg:col-span-2 order-1 lg:order-2">
                <div className="bg-[#5D2A71] text-white rounded-[1.5rem] sm:rounded-[2.5rem] shadow-2xl shadow-purple-900/30 p-6 sm:p-10 lg:sticky lg:top-32 border border-purple-400/20 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-500/10 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2" />

                  <h3 className="text-sm sm:text-lg font-bold mb-6 sm:mb-8 uppercase tracking-[0.2em] text-purple-200">Total del pedido</h3>

                  <div className="space-y-3 sm:space-y-4 mb-8 sm:mb-10 pt-4 sm:pt-6 border-t border-purple-100/10">
                    <div className="flex justify-between items-center text-purple-200 uppercase tracking-widest text-[10px] font-bold">
                      <span>Subtotal</span>
                      <span>${subtotal.toLocaleString('es-AR')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl sm:text-4xl font-black">${subtotal.toLocaleString('es-AR')}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleWhatsAppOrder}
                    className="w-full h-16 sm:h-20 bg-emerald-500 hover:bg-emerald-400 text-white font-black rounded-2xl sm:rounded-3xl text-sm sm:text-xl shadow-xl shadow-emerald-900/20 transform active:scale-95 sm:hover:scale-105 transition-all group flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 relative z-10"
                  >
                    <MessageCircle className="h-5 w-5 sm:h-7 sm:w-7 group-hover:rotate-12 transition-transform shrink-0" />
                    <span className="truncate">Confirmar por WhatsApp</span>
                  </button>

                  <p className="text-center mt-4 sm:mt-6 text-[10px] sm:text-xs text-purple-200/60 font-medium px-2 leading-relaxed">
                    Serás redirigido a WhatsApp.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
