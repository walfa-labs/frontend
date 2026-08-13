import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useUiStore } from '../../app/stores/ui'

describe('useUiStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with sidebarOpen set to true', () => {
    const store = useUiStore()
    expect(store.sidebarOpen).toBe(true)
  })

  it('toggles sidebar state', () => {
    const store = useUiStore()
    store.toggleSidebar()
    expect(store.sidebarOpen).toBe(false)
    store.toggleSidebar()
    expect(store.sidebarOpen).toBe(true)
  })
})
