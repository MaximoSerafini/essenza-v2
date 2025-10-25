# Integración de MercadoPago (Essenza)

Este archivo explica cómo configurar la integración de MercadoPago para el checkout Pro, usando variables de entorno y desplegando en Netlify.

Variables de entorno (no subirlas a Git):


Ejemplo `.env.local` (nunca commitear):
MP_PUBLIC_KEY=APP_USR-<tu_public_key_aqui>
MP_ACCESS_TOKEN=APP_USR-<tu_access_token_aqui>
MP_CLIENT_ID=<tu_client_id_aqui>
MP_CLIENT_SECRET=<tu_client_secret_aqui>
APP_BASE_URL=https://tu-sitio.netlify.app
APP_BASE_URL=https://tu-sitio.netlify.app

Configuración en Netlify:

1. En el panel de Netlify, ve a Site settings → Build & deploy → Environment.
2. Agrega las variables arriba (MP_ACCESS_TOKEN, MP_PUBLIC_KEY, MP_CLIENT_ID, MP_CLIENT_SECRET, APP_BASE_URL).
3. Haz deploy.

Uso en el frontend:

Se incluyó un componente `components/ui/mercado-checkout.tsx` que hace POST a `/api/mercadopago/create-preference` y redirige al `init_point` devuelto.

Notas de seguridad:

- Mantén el access token en el server (variables de entorno) y nunca lo expongas en el cliente.
- Revisa las reglas de CORS si integras con otras APIs.
