import { proxyRequest } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  // Realizamos el proxy de la petición hacia el backend real, manteniendo cabeceras y cookies
  return proxyRequest(event, `${config.public.apiBase}/**`)
})
