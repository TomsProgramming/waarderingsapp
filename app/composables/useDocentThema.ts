export const useDocentThema = () => {
  const user = useAuthUser()
  const fallback = '#39dea1'

  const themaKleur = computed<string>({
    get: () => user.value?.theme_color || fallback,
    set: (v) => {
      if (user.value) user.value.theme_color = v
      void saveTheme(v)
    }
  })

  const themaKleurDonker = computed(() =>
    themaKleur.value === '#39dea1' ? '#2aab78' : '#cb7504'
  )

  const themaKleurKaart = computed(() =>
    themaKleur.value === '#39dea1' ? '#3fcf9a' : '#e07d00'
  )

  async function setKleur(color: string) {
    themaKleur.value = color
  }

  return { themaKleur, themaKleurDonker, themaKleurKaart, setKleur }
}

async function saveTheme(color: string) {
  try {
    await $fetch('/api/user/theme', { method: 'POST', body: { color } })
  } catch {}
}
