export const useThema = () => {
    const themaKleur = useState<string>('themaKleur', () => '#FF9408')

    const themaKleurDonker = computed(() =>
        themaKleur.value === '#FF9408' ? '#cb7504' : '#2aab78'
    )

    return { themaKleur, themaKleurDonker }
}
