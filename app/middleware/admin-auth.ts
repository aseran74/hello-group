export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path.includes('/admin/login')) return

  if (!hasInsforgeConfig()) {
    return navigateTo('/admin/login')
  }

  const { ensureSession, user } = useAdminAuth()
  await ensureSession()

  if (!user.value) {
    return navigateTo('/admin/login')
  }
})
