export const useDocentThema = () => {
    const themaKleur = useState<string>('docentThemaKleur', () => '#39dea1')

    const themaKleurDonker = computed(() =>
        themaKleur.value === '#39dea1' ? '#2aab78' : '#cb7504'
    )

    const themaKleurKaart = computed(() =>
        themaKleur.value === '#39dea1' ? '#3fcf9a' : '#e07d00'
    )

    return { themaKleur, themaKleurDonker, themaKleurKaart }
}
