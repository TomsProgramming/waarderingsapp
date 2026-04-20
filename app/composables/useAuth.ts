export interface AuthUser {
  id: number
  role: 'student' | 'teacher'
  first_name: string
  last_name: string
  email: string
  profile_picture: string
  theme_color: string
  student_number?: number
  abbreviation_teacher?: string
}

export type VerifyMode = 'register' | 'login'

export interface VerifyChallenge {
  token: string
  mode: VerifyMode
  role: 'student' | 'teacher'
}

export function useAuthUser() {
  return useState<AuthUser | null>('auth:user', () => null)
}

export async function fetchMe(): Promise<AuthUser | null> {
  const user = useAuthUser()
  try {
    const data = await $fetch<{ user: AuthUser | null }>('/api/auth/me')
    user.value = data.user
    return data.user
  } catch {
    user.value = null
    return null
  }
}

export function useAuth() {
  const user = useAuthUser()

  async function login(email: string, password: string, role: 'student' | 'teacher'): Promise<VerifyChallenge> {
    const res = await $fetch<{ ok: true; token: string; mode: 'login'; role: 'student' | 'teacher' }>(
      '/api/auth/login',
      { method: 'POST', body: { email, password, role } }
    )
    return { token: res.token, mode: res.mode, role: res.role }
  }

  async function logout() {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
    await navigateTo('/')
  }

  async function registerStudent(formData: FormData): Promise<VerifyChallenge> {
    const res = await $fetch<{ ok: true; token: string; mode: 'register'; role: 'student' }>(
      '/api/auth/register-student',
      { method: 'POST', body: formData }
    )
    return { token: res.token, mode: res.mode, role: res.role }
  }

  async function registerTeacher(formData: FormData): Promise<VerifyChallenge> {
    const res = await $fetch<{ ok: true; token: string; mode: 'register'; role: 'teacher' }>(
      '/api/auth/register-teacher',
      { method: 'POST', body: formData }
    )
    return { token: res.token, mode: res.mode, role: res.role }
  }

  async function verify(token: string, code: string, mode: VerifyMode): Promise<'student' | 'teacher'> {
    const res = await $fetch<{ ok: true; role: 'student' | 'teacher' }>(
      '/api/auth/verify',
      { method: 'POST', body: { token, code, mode } }
    )
    await fetchMe()
    return res.role
  }

  async function resend(token: string, mode: VerifyMode): Promise<void> {
    await $fetch('/api/auth/resend', { method: 'POST', body: { token, mode } })
  }

  return { user, login, logout, registerStudent, registerTeacher, verify, resend, refresh: fetchMe }
}
