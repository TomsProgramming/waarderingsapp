export default defineNuxtRouteMiddleware(async (to) => {
  const user = useAuthUser()

  // Fetch user once on first navigation (server or client).
  if (user.value === null) {
    await fetchMe()
  }

  const path = to.path
  const isPublic =
    path === '/' ||
    path === '/student/login' ||
    path === '/docent/login' ||
    path === '/verify' ||
    path.startsWith('/nieuwaccount') ||
    path.startsWith('/klant/')

  if (!user.value) {
    if (isPublic) return
    if (path.startsWith('/docent')) return navigateTo('/docent/login')
    if (path.startsWith('/student')) return navigateTo('/student/login')
    return navigateTo('/')
  }

  // Logged in: bounce away from the landing & auth pages (behalve /verify — dat kan relevant zijn tijdens re-auth)
  if (path === '/' || path === '/student/login' || path === '/docent/login' || path.startsWith('/nieuwaccount')) {
    return navigateTo(user.value.role === 'teacher' ? '/docent' : '/student')
  }

  if (user.value.role === 'student' && path.startsWith('/docent')) return navigateTo('/student')
  if (user.value.role === 'teacher' && path.startsWith('/student')) return navigateTo('/docent')
})
