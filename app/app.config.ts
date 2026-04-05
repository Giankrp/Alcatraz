export default defineAppConfig({
  ui: {
    // Colores base para toda la App
    colors: {
      primary: 'white',
      neutral: 'zinc'
    },
    // Configuración global de Toasts (Estética Ultra-Dark & Cinematic)
    toast: {
      root: 'relative p-5 rounded-2xl bg-black/90 backdrop-blur-2xl border border-white/5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] ring-1 ring-white/10 flex items-start gap-4 transition-all duration-500',
      title: 'text-sm font-semibold text-white tracking-tight',
      description: 'text-xs text-zinc-500 font-medium leading-relaxed',
      icon: 'size-6 shrink-0',
      close: 'text-zinc-600 hover:text-white transition-opacity duration-300',
      
      // Variantes de estado con efecto de "brillo interno"
      variants: {
        color: {
          success: {
            root: 'bg-emerald-950/20 border-emerald-500/20 ring-emerald-500/5',
            icon: 'text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]',
            title: 'text-emerald-50'
          },
          error: {
            root: 'bg-rose-950/20 border-rose-500/20 ring-rose-500/5',
            icon: 'text-rose-400 drop-shadow-[0_0_15px_rgba(251,113,133,0.3)]',
            title: 'text-rose-50'
          },
          warning: {
            root: 'bg-amber-950/20 border-amber-500/20 ring-amber-500/5',
            icon: 'text-amber-400',
            title: 'text-amber-50'
          }
        }
      }
    }
  }
})
