import { defineNuxtPlugin } from '#app'
import UmoEditor from '@umoteam/editor'
import UmoViewer from '@umoteam/viewer'
import '@umoteam/editor/style'
import '@umoteam/viewer/style'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(UmoEditor)
  nuxtApp.vueApp.use(UmoViewer)
})
