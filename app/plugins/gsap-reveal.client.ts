import { defineNuxtPlugin } from '#app'
import type { gsap as Gsap } from 'gsap'
import type ScrollTriggerType from 'gsap/ScrollTrigger'

type GsapInstance = typeof Gsap
type ScrollTrigger = typeof ScrollTriggerType

export default defineNuxtPlugin((nuxtApp) => {
  if (typeof window === 'undefined') return

  let gsap: GsapInstance
  let ScrollTrigger: ScrollTrigger
  let mm: ReturnType<GsapInstance['matchMedia']>
  let initialized = false

  function setupReveals() {
    if (!gsap || !ScrollTrigger) return

    if (mm) mm.revert()

    mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
        const rect = el.getBoundingClientRect()
        if (rect.top > window.innerHeight) {
          gsap.fromTo(el,
            { autoAlpha: 0, y: 24 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.5,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                once: true,
              },
            },
          )
        }
      })
    })

    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set('.reveal', { autoAlpha: 1, y: 0 })
    })
  }

  import('gsap').then((g) => {
    gsap = g.gsap
    import('gsap/ScrollTrigger').then((st) => {
      ScrollTrigger = st.ScrollTrigger
      gsap.registerPlugin(ScrollTrigger)
      initialized = true
      setupReveals()
    })
  })

  nuxtApp.hook('page:finish', () => {
    if (initialized) {
      setTimeout(() => {
        setupReveals()
        ScrollTrigger?.refresh()
      }, 100)
    }
  })
})
