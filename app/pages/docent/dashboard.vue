<script setup>
import RadarChart from '~/components/RadarChart.vue'
import NavigatieBalk from '~/components/NavigatieBalk.vue'

const route = useRoute()
const { themaKleur, themaKleurDonker } = useDocentThema()

const studentId = computed(() => {
    const q = route.query.student
    return q ? Number(q) : null
})

const student = ref(null)
const latest = ref({ teacher: null, customer: null })
const actieveTab = ref('docent')
const reviewTekst = ref('')
const projectNaam = ref('')
const bezig = ref(false)
const foutmelding = ref('')

const onderdelen = [
    { label: 'Presenteren', key: 'present' },
    { label: 'Organiseren', key: 'organise' },
    { label: 'Zelfstandigheid', key: 'independence' },
    { label: 'Samenwerken', key: 'collaborate' },
    { label: 'Communiceren', key: 'communicate' }
]

const scores = reactive({
    present: 0,
    organise: 0,
    independence: 0,
    collaborate: 0,
    communicate: 0
})

const volledigeNaam = computed(() =>
    student.value ? `${student.value.first_name} ${student.value.last_name}`.trim() : ''
)

const initialen = computed(() => {
    if (!student.value) return ''
    const a = (student.value.first_name || '').charAt(0)
    const b = (student.value.last_name || '').charAt(0)
    return (a + b).toUpperCase()
})

const radarScores = computed(() => {
    if (actieveTab.value === 'docent') {
        return [scores.present, scores.organise, scores.independence, scores.collaborate, scores.communicate]
    }
    const r = latest.value.customer
    return r ? [r.present, r.organise, r.independence, r.collaborate, r.communicate] : [0, 0, 0, 0, 0]
})

async function laadStudent() {
    if (!studentId.value) return
    try {
        const data = await $fetch(`/api/students/${studentId.value}`)
        student.value = data.student
    } catch {
        student.value = null
    }
}

async function laadLatest() {
    if (!studentId.value) return
    try {
        const data = await $fetch('/api/reviews/latest', {
            params: { student: studentId.value }
        })
        latest.value = data
        const t = data.teacher
        if (t) {
            scores.present = t.present
            scores.organise = t.organise
            scores.independence = t.independence
            scores.collaborate = t.collaborate
            scores.communicate = t.communicate
            reviewTekst.value = t.review || ''
            projectNaam.value = t.project_name || ''
        }
    } catch {
        latest.value = { teacher: null, customer: null }
    }
}

onMounted(async () => {
    await Promise.all([laadStudent(), laadLatest()])
})

function gaTerug() {
    navigateTo('/docent')
}

async function verstuurReview() {
    if (!studentId.value) return
    foutmelding.value = ''
    bezig.value = true
    try {
        await $fetch('/api/reviews', {
            method: 'POST',
            body: {
                student_id: studentId.value,
                role: 'teacher',
                present: scores.present,
                organise: scores.organise,
                independence: scores.independence,
                collaborate: scores.collaborate,
                communicate: scores.communicate,
                review: reviewTekst.value,
                project_name: projectNaam.value || null
            }
        })
        await laadLatest()
        alert('Review opgeslagen')
    } catch (e) {
        foutmelding.value = e?.data?.message || 'Opslaan mislukt'
    } finally {
        bezig.value = false
    }
}
</script>

<template>
    <div class="pagina">

        <header class="paginaHoofd">
            <button class="terugKnop" aria-label="Terug" @click="gaTerug">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2">
                    <path d="M15 5L8 12L15 19" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </button>
            <span class="dashboardTitel">DASHBOARD</span>
        </header>

        <div class="tabFotoRij">
            <button class="tab" :class="{ tabActief: actieveTab === 'docent' }" @click="actieveTab = 'docent'">
                Docent
            </button>

            <div class="middenFoto">
                <div class="studentFotoRond">
                    <img v-if="student?.profile_picture" :src="student.profile_picture" :alt="volledigeNaam" class="studentFotoImg" />
                    <span v-else class="studentInitialen">{{ initialen }}</span>
                </div>
            </div>

            <button class="tab" :class="{ tabActief: actieveTab === 'klant' }" @click="actieveTab = 'klant'">
                Klant
            </button>
        </div>

        <div class="paginaWit">

            <div class="studentKaart">
                <div class="studentInfo">
                    <span class="studentNaam">{{ volledigeNaam }}</span>
                    <span class="studentNummer">{{ student?.student_number }}</span>
                </div>
            </div>

            <main class="paginaInhoud">

                <div v-if="actieveTab === 'docent'" class="paneelInhoud">

                    <div class="grafiekWrapper">
                        <RadarChart :scores="radarScores" :kleur="themaKleur" />
                    </div>

                    <section class="reviewSectie">
                        <label class="reviewTitel">Review</label>
                        <input v-model="projectNaam" class="projectVeld" placeholder="Project (optioneel)" />
                        <textarea v-model="reviewTekst" class="reviewVeld" placeholder="typ hier je review" />
                    </section>

                    <section class="scoreSectie">
                        <div v-for="o in onderdelen" :key="o.key" class="scoreRij">
                            <span class="scoreNaam">{{ o.label }}</span>
                            <div class="cirkels">
                                <button v-for="i in 5" :key="`${o.key}-${i}`" type="button" class="cirkel"
                                    :class="{ gevuld: i <= scores[o.key] }" @click="scores[o.key] = i" />
                            </div>
                        </div>
                    </section>

                    <p v-if="foutmelding" class="fout">{{ foutmelding }}</p>

                    <button class="verstuurKnop" :disabled="bezig" @click="verstuurReview">
                        {{ bezig ? 'Bezig…' : 'Versturen' }}
                    </button>

                </div>

                <div v-else class="paneelInhoud">

                    <div class="grafiekWrapper">
                        <RadarChart :scores="radarScores" :kleur="themaKleur" />
                    </div>

                    <section v-if="latest.customer" class="klantBericht">
                        <h2 class="klantTitel">{{ (latest.customer.customer_name || 'Klant').toUpperCase() }}</h2>
                        <p class="klantTekst">{{ latest.customer.review || 'Geen toelichting.' }}</p>
                    </section>

                    <section v-else class="klantBericht">
                        <h2 class="klantTitel">Nog geen klant-review</h2>
                        <p class="klantTekst">Zodra een klant via de QR-code een review achterlaat verschijnt hij hier.</p>
                    </section>

                </div>

            </main>

            <NavigatieBalk />
        </div>

    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Montserrat:wght@400&display=swap');

.pagina {
    display: flex;
    flex-direction: column;
    height: 100dvh;
    overflow: hidden;
    background-color: v-bind(themaKleur);
}

.paginaHoofd {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4vh 5% 3vh;
}

.dashboardTitel {
    color: #ffffff;
    font-family: 'Inter', sans-serif;
    font-size: clamp(16px, 5.3vw, 20px);
    font-weight: 400;
    text-transform: uppercase;
}

.terugKnop {
    background: none;
    border: none;
    color: #ffffff;
    padding: 0;
    display: grid;
    place-items: center;
    line-height: 0;
    cursor: pointer;
}

.tabFotoRij {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 12%;
    position: relative;
    margin-bottom: -9px;
    min-height: 46px;
}

.middenFoto {
    position: absolute;
    left: 50%;
    top: 6px;
    transform: translateX(-50%);
    z-index: 6;
}

.tab {
    border: none;
    height: 32px;
    min-width: 96px;
    border-radius: 12px 12px 0 0;
    background: #dedede;
    color: #2a2a2a;
    font-family: 'Inter', sans-serif;
    font-size: 18px;
    font-weight: 400;
    cursor: pointer;
}

.tabActief {
    background: #ffffff;
}

.paginaWit {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: #ebebeb;
    border-radius: 16px 16px 0 0;
    overflow: hidden;
    min-height: 0;
    position: relative;
}

.klantBericht {
    background: #f5f6f7;
    padding: 20px;
    border-radius: 14px;
}

.klantTitel {
    font-family: 'Inter', sans-serif;
    font-size: 18px;
    margin-bottom: 10px;
}

.klantTekst {
    font-family: 'Montserrat', sans-serif;
    font-size: 14px;
    line-height: 1.6;
    color: #313131;
}

.paginaInhoud {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    min-height: 0;
    padding: 8px 6% 28px;
    gap: 12px;
    scrollbar-width: thin;
    scrollbar-color: v-bind(themaKleur) transparent;
    background-color: white;
}

.paneelInhoud {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.studentKaart {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    width: 100%;
    background: #ffffff;
    padding: 36px 0 10px;
    flex-shrink: 0;
    z-index: 3;
}

.studentFotoRond {
    flex-shrink: 0;
    width: 82px;
    height: 82px;
    border-radius: 50%;
    background-color: v-bind(themaKleur);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 3px solid #f2f2f2;
    overflow: hidden;
}

.studentFotoImg {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.studentInitialen {
    color: #ffffff;
    font-family: 'Inter', sans-serif;
    font-size: clamp(20px, 5vw, 24px);
    font-weight: 600;
    text-transform: uppercase;
}

.studentInfo {
    display: flex;
    flex-direction: column;
    gap: 1px;
    text-align: center;
}

.studentNaam {
    color: #000000;
    font-family: 'Inter', sans-serif;
    font-size: clamp(29px, 6vw, 34px);
    font-weight: 600;
    margin-top: 12px;
}

.studentNummer {
    color: #212121;
    font-family: 'Inter', sans-serif;
    font-size: clamp(15px, 4.2vw, 18px);
    font-weight: 400;
}

.grafiekWrapper {
    width: 80%;
    max-width: 310px;
    aspect-ratio: 1;
    flex-shrink: 0;
    margin: 6px auto 10px;
    position: relative;
}

.grafiekWrapper :deep(canvas) {
    width: 100% !important;
    height: 100% !important;
}

.reviewSectie {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.reviewTitel {
    font-family: 'Inter', sans-serif;
    font-size: clamp(22px, 5vw, 28px);
    color: #1e1e1e;
}

.projectVeld {
    border: none;
    border-radius: 10px;
    background: #ececec;
    padding: 10px 12px;
    font-family: 'Inter', sans-serif;
    color: #212121;
}

.reviewVeld {
    border: none;
    border-radius: 12px;
    min-height: 96px;
    background: #dcdcdc;
    resize: vertical;
    padding: 12px;
    font-family: 'Inter', sans-serif;
    color: #212121;
}

.reviewVeld::placeholder,
.projectVeld::placeholder {
    color: #acacac;
}

.scoreSectie {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding-top: 4px;
}

.scoreRij {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 14px;
}

.scoreNaam {
    font-family: 'Inter', sans-serif;
    font-size: clamp(18px, 5vw, 24px);
    color: #212121;
}

.cirkels {
    display: flex;
    align-items: center;
    gap: 8px;
}

.cirkel {
    width: 17px;
    height: 17px;
    border-radius: 50%;
    border: 1.7px solid v-bind(themaKleur);
    background: transparent;
    cursor: pointer;
}

.cirkel.gevuld {
    background: v-bind(themaKleur);
}

.fout {
    color: #c62828;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    margin: 0;
}

.verstuurKnop {
    margin-top: 14px;
    border: none;
    border-radius: 6px;
    background: v-bind(themaKleur);
    color: #ffffff;
    width: 100%;
    height: 52px;
    display: grid;
    place-items: center;
    cursor: pointer;
}

.verstuurKnop:disabled {
    opacity: 0.6;
    cursor: default;
}
</style>
