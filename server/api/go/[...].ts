import { proxyRequest } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // event.path = '/api/go/api/auth/login?...'
  // Eliminamos el prefijo '/api/go' para obtener el path real del backend
  const backendPath = event.path.replace(/^\/api\/go/, '')
  const target = `${config.backendBase}${backendPath}`

  // proxyRequest reenvía todas las cabeceras (Cookie → backend, Set-Cookie → browser)
  // Como la respuesta ahora viene del mismo dominio del front, el browser acepta las cookies
  return proxyRequest(event, target)
})
