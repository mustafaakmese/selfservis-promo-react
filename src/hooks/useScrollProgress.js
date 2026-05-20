import { useRef, useState, useEffect } from 'react'

export function useScrollProgress(options = {}) {
  const ref = useRef(null)
  const [progress, setProgress] = useState(0)
  const { offset = 0 } = options

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onScroll = () => {
      const rect = el.getBoundingClientRect()
      const windowH = window.innerHeight
      const elH = el.offsetHeight

      // 0 = element just entered viewport bottom, 1 = element fully scrolled past
      const raw = (windowH - rect.top - offset) / (elH + windowH - offset)
      setProgress(Math.max(0, Math.min(1, raw)))
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [offset])

  return { ref, progress }
}
