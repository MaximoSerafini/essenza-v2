"use client"

import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function SuccessContent() {
  const searchParams = useSearchParams()
  const collectionId = searchParams.get('collection_id')
  const collectionStatus = searchParams.get('collection_status')

  React.useEffect(() => {
    // Cuando la página carga, abrir WhatsApp automáticamente
    const phoneNumber = '549' + '3794222701'
    const message = `Hola! 👋 He completado mi pago en Essenza.%0A%0ADetalles de la compra:%0AID de transacción: ${collectionId || 'N/A'}%0AEstado: ${collectionStatus || 'aprobado'}%0A%0APor favor, confirmar la compra y coordinar los detalles del envío/retiro. ¡Gracias!`
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`
    
    // Abrir WhatsApp después de 1 segundo
    const timer = setTimeout(() => {
      window.open(whatsappUrl, '_blank')
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [collectionId, collectionStatus])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Pago aprobado!</h1>
        <p className="text-gray-600 mb-6">Tu pago fue procesado correctamente</p>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-700">
            <strong>Se abrirá WhatsApp automáticamente</strong> para confirmar tu compra. Si no abre, haz clic en el botón abajo.
          </p>
        </div>

        <button
          onClick={() => {
            const phoneNumber = '549' + '3794222701'
            const message = `Hola! 👋 He completado mi pago en Essenza.%0A%0ADetalles de la compra:%0AID de transacción: ${collectionId || 'N/A'}%0AEstado: ${collectionStatus || 'aprobado'}%0A%0APor favor, confirmar la compra y coordinar los detalles del envío/retiro. ¡Gracias!`
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`
            window.open(whatsappUrl, '_blank')
          }}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-300 mb-3"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-5.031 1.378c-3.055 2.2-5.027 5.97-5.027 9.869 0 3.479 1.311 6.707 3.72 9.114 2.4 2.4 5.631 3.72 9.111 3.72h.003c3.479 0 6.709-1.32 9.11-3.72 2.4-2.407 3.72-5.635 3.72-9.114 0-3.894-1.968-7.664-5.025-9.869a9.870 9.87 0 00-5.479-1.378M2.25 0C1.009 0 0 1.009 0 2.25v19.5C0 22.991 1.009 24 2.25 24H24c1.241 0 2.25-1.009 2.25-2.25V2.25C26.25 1.009 25.241 0 24 0H2.25z" />
          </svg>
          Abrir WhatsApp
        </button>

        <a
          href="/"
          className="w-full text-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors duration-300"
        >
          Volver al inicio
        </a>

        {collectionId && (
          <p className="text-center text-sm text-gray-500 mt-4">
            ID de transacción: {collectionId}
          </p>
        )}
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
          <p className="text-xl text-gray-600">Cargando...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
