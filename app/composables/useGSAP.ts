import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function useGSAP() {
  gsap.registerPlugin(ScrollTrigger)
  return { gsap, ScrollTrigger }
}
