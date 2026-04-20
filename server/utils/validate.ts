import { z } from 'zod'

// Alleen het domein wordt gecontroleerd — wat voor @ staat mag vrij zijn
// zolang het een geldig mail-lokaal-deel is (geen spaties of @).
export const STUDENT_EMAIL_REGEX = /^[^\s@]+@student\.glu\.nl$/i
export const TEACHER_EMAIL_REGEX = /^[^\s@]+@glu\.nl$/i

const score = z.coerce.number().int().min(1).max(5)

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().max(255),
  password: z.string().min(1).max(200),
  role: z.enum(['student', 'teacher'])
})

export const registerStudentSchema = z
  .object({
    first_name: z.string().trim().min(1).max(100),
    last_name: z.string().trim().min(1).max(100),
    email: z.string().trim().toLowerCase().regex(STUDENT_EMAIL_REGEX, 'Gebruik een @student.glu.nl adres'),
    student_number: z.coerce.number().int().min(10000).max(9999999),
    password: z.string().min(8, 'Wachtwoord minimaal 8 tekens').max(200),
    password_confirm: z.string()
  })
  .refine((d) => d.password === d.password_confirm, { path: ['password_confirm'], message: 'Wachtwoorden komen niet overeen' })

export const registerTeacherSchema = z
  .object({
    first_name: z.string().trim().min(1).max(100),
    last_name: z.string().trim().min(1).max(100),
    email: z.string().trim().toLowerCase().regex(TEACHER_EMAIL_REGEX, 'Gebruik een @glu.nl adres'),
    abbreviation_teacher: z.string().trim().toLowerCase().min(2).max(10).regex(/^[a-z]+$/, 'Alleen letters'),
    password: z.string().min(8).max(200),
    password_confirm: z.string()
  })
  .refine((d) => d.password === d.password_confirm, { path: ['password_confirm'], message: 'Wachtwoorden komen niet overeen' })

export const teacherReviewSchema = z.object({
  student_id: z.coerce.number().int().positive(),
  project_name: z.string().trim().max(30).nullish(),
  present: score,
  organise: score,
  independence: score,
  collaborate: score,
  communicate: score,
  review: z.string().trim().max(2000).default('')
})

export const customerReviewSchema = z.object({
  student_id: z.coerce.number().int().positive(),
  customer_name: z.string().trim().min(1).max(20),
  project_name: z.string().trim().min(1).max(30),
  present: score,
  organise: score,
  independence: score,
  collaborate: score,
  communicate: score,
  review: z.string().trim().max(2000).default('')
})

export const themeSchema = z.object({
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Ongeldige kleurcode')
})

export const searchQuerySchema = z.object({
  q: z.string().trim().max(100).optional()
})

export const verifySchema = z.object({
  token: z.string().regex(/^[a-f0-9]{64}$/, 'Ongeldig token'),
  code: z.string().regex(/^\d{6}$/, 'Code moet 6 cijfers zijn'),
  mode: z.enum(['register', 'login'])
})

export const resendSchema = z.object({
  token: z.string().regex(/^[a-f0-9]{64}$/, 'Ongeldig token'),
  mode: z.enum(['register', 'login'])
})
