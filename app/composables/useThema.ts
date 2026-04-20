// Student theme — color lives on the user record, cached in a shared state ref.
// Pages read themaKleur / themaKleurDonker for v-bind(); they call setKleur() on change.
export const useThema = () => {
  const user = useAuthUser()
  const fallback = '#FF9408'

  const themaKleur = computed<string>({
    get: () => user.value?.theme_color || fallback,
    set: (v) => {
      if (user.value) user.value.theme_color = v
      void saveTheme(v)
    }
  })

  const themaKleurDonker = computed(() =>
    themaKleur.value === '#FF9408' ? '#cb7504' : '#2aab78'
  )

  async function setKleur(color: string) {
    themaKleur.value = color
  }

  return { themaKleur, themaKleurDonker, setKleur }
}

async function saveTheme(color: string) {
  try {
    await $fetch('/api/user/theme', { method: 'POST', body: { color } })
  } catch {
    // ignore — user will see the change locally; retry on next change
  }
}
