export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()
  if (!user.value && to.path !== '/admin/login') {
    return navigateTo('/admin/login')
  }
  if (user.value && to.path === '/admin/login') {
    return navigateTo('/admin')
  }
})
