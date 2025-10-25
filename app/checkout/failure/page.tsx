"use client"

import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function FailureContent() {
  const searchParams = useSearchParams()
  const preferenceId = searchParams.get('preference_id')

  const handleContactSupport = () => {
    const phoneNumber = '549' + '3794222701'
    const message = `Hola! 👋 He tenido un problema con mi pago en Essenza.%0A%0ADetalles:%0AID de preferencia: ${preferenceId || 'N/A'}%0A%0APor favor, ayudame a resolver este problema. ¡Gracias!`
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Pago no completado</h1>
          <p className="mt-2 text-gray-600">Hubo un problema al procesar tu pago</p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-700">
            <strong>No te preocupes.</strong> Tu dinero no fue debitado. Puedes intentar nuevamente o contactarnos por WhatsApp para ayudarte.
          </p>
        </div>

        <button
          onClick={handleContactSupport}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-300"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-5.031 1.378c-3.055 2.2-5.027 5.97-5.027 9.869 0 3.479 1.311 6.707 3.72 9.114 2.4 2.4 5.631 3.72 9.111 3.72h.003c3.479 0 6.709-1.32 9.11-3.72 2.4-2.407 3.72-5.635 3.72-9.114 0-3.894-1.968-7.664-5.025-9.869a9.870 9.870 0 00-5.479-1.378M2.25 0C1.009 0 0 1.009 0 2.25v19.5C0 22.991 1.009 24 2.25 24H24c1.241 0 2.25-1.009 2.25-2.25V2.25C26.25 1.009 25.241 0 24 0H2.25z" />
          </svg>
          Contactar por WhatsApp
        </button>

        <a
          href="/checkout"
          className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg text-center transition-colors duration-300"
        >
          Intentar nuevamente
        </a>

        <a
          href="/"
          className="w-full mt-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg text-center transition-colors duration-300"
        >
          Volver al inicio
        </a>

        {preferenceId && (
          <p className="text-center text-sm text-gray-500 mt-4">
            ID de preferencia: {preferenceId}
          </p>
        )}
      </div>
    </div>
  )
}

export default function FailurePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
          <p className="text-xl text-gray-600">Cargando...</p>
        </div>
      </div>
    }>
      <FailureContent />
    </Suspense>
  )
}
