<script setup>
import NavigatieBalk from '~/components/NavigatieBalk.vue'

const { themaKleur } = useDocentThema()
const route = useRoute()

const studentId = computed(() => {
    const q = route.query.student
    return q ? Number(q) : null
})

const student = ref(null)
const actieveTab = ref('docent')
const reviews = ref([])
const laden = ref(false)

async function laadStudent() {
    if (!studentId.value) return
    try {
        const data = await $fetch(`/api/students/${studentId.value}`)
        student.value = data.student
    } catch {
        student.value = null
    }
}

async function laadReviews() {
    if (!studentId.value) return
    laden.value = true
    try {
        const data = await $fetch('/api/reviews', {
            params: {
                student: studentId.value,
                role: actieveTab.value === 'docent' ? 'teacher' : 'customer'
            }
        })
        reviews.value = data.reviews
    } finally {
        laden.value = false
    }
}

onMounted(async () => {
    await Promise.all([laadStudent(), laadReviews()])
})
watch(actieveTab, laadReviews)

const teVerwijderenId = ref(null)
const toonPopup = ref(false)

function openVerwijderPopup(id) {
    teVerwijderenId.value = id
    toonPopup.value = true
}

function annuleer() {
    teVerwijderenId.value = null
    toonPopup.value = false
}

async function bevestigVerwijder() {
    const id = teVerwijderenId.value
    if (!id) return
    try {
        await $fetch(`/api/reviews/${id}`, { method: 'DELETE' })
        reviews.value = reviews.value.filter(r => r.id !== id)
    } catch (e) {
        alert(e?.data?.message || 'Verwijderen mislukt')
    } finally {
        teVerwijderenId.value = null
        toonPopup.value = false
    }
}

const studentNaam = computed(() =>
    student.value ? `${student.value.first_name} ${student.value.last_name}`.trim() : ''
)
</script>

<template>
    <div class="pagina">

        <header class="paginaHoofd">
            <span class="feedbackTitel">FEEDBACK</span>
            <span class="docentNaam">{{ studentNaam }}</span>
        </header>

        <div class="tabs">
            <button :class="{ actief: actieveTab === 'docent' }" @click="actieveTab = 'docent'">Docent</button>
            <button :class="{ actief: actieveTab === 'klant' }" @click="actieveTab = 'klant'">Klant</button>
        </div>

        <div class="paginaWit">
            <main class="paginaInhoud">
                <p v-if="laden" class="leeg">Laden…</p>
                <p v-else-if="!reviews.length" class="leeg">Geen reviews.</p>
                <div v-else v-for="item in reviews" :key="item.id" class="feedbackKaart"
                    :class="{ klantWeergave: actieveTab === 'klant' }">
                    <div class="kaartKop">
                        <span class="projectNaam">{{ item.project_name || 'Project' }}</span>
                        <span class="klantNaam">
                            {{ actieveTab === 'klant' ? (item.customer_name || 'Klant') : 'Docent' }}
                        </span>
                    </div>
                    <p class="kaartTekst">{{ item.review || '-' }}</p>
                    <button class="verwijderKnop" aria-label="Verwijder feedback" @click="openVerwijderPopup(item.id)">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                            <path d="M3 6h18v2H3V6zm2 3h14l-1.5 12h-11L5 9zm5-6h4v2h-4V3z" />
                        </svg>
                    </button>
                </div>
            </main>

            <NavigatieBalk />
        </div>

        <Transition name="verwijderFade">
            <div v-if="toonPopup" class="overlay" @click.self="annuleer">
                <Transition name="verwijderOmhoog">
                    <div v-if="toonPopup" class="verwijderPopup">
                        <p class="popupTitel">Feedback verwijderen</p>
                        <p class="popupTekst">Weet je zeker dat je deze feedback wilt verwijderen?</p>
                        <div class="popupKnoppen">
                            <button class="annuleerKnop" @click="annuleer">Annuleren</button>
                            <button class="verwijderBevestigKnop" @click="bevestigVerwijder">Verwijderen</button>
                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>

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
    position: relative;
}

.paginaHoofd {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 7vh 10% 5vh;
}

.tabs {
    display: flex;
    justify-content: center;
    gap: 8px;
    height: 33px;
}

.tabs button {
    padding: 10px 20px;
    border: none;
    border-radius: 12px 12px 0 0;
    background: #e5e5e5;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
}

.tabs button.actief {
    background: #ffffff;
    font-weight: 600;
}

.klantWeergave {
    background-color: #f1f2f3;
    border-radius: 10px;
    padding: 16px;
}

.feedbackTitel {
    color: #ffffff;
    font-family: 'Inter', sans-serif;
    font-size: clamp(22px, 7vw, 28px);
    font-weight: 300;
    text-transform: uppercase;
}

.docentNaam {
    color: #ffffff;
    font-family: 'Inter', sans-serif;
    font-size: clamp(11px, 3.7vw, 14px);
    font-weight: 400;
    letter-spacing: 2px;
}

.paginaWit {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    border-radius: 20px 20px 0 0;
    overflow: hidden;
    min-height: 0;
}

.paginaInhoud {
    flex: 1;
    overflow-y: auto;
    padding: 5% 5%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-height: 0;
}

.leeg {
    text-align: center;
    color: #666;
    font-family: 'Inter', sans-serif;
    margin-top: 24px;
}

.feedbackKaart {
    background-color: #f5f6f7;
    padding: 14px 14px 10px;
    position: relative;
    flex-shrink: 0;
}

.kaartKop {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 8px;
}

.projectNaam,
.klantNaam {
    font-family: 'Inter', sans-serif;
    font-size: clamp(15px, 4.5vw, 18px);
    font-weight: 600;
    color: #1a1a1a;
}

.kaartTekst {
    font-family: 'Montserrat', sans-serif;
    font-size: clamp(12px, 3.5vw, 14px);
    color: #313131;
    line-height: 1.5;
    margin: 0 0 28px;
}

.verwijderKnop {
    position: absolute;
    bottom: 10px;
    right: 12px;
    background: none;
    border: none;
    padding: 4px;
    cursor: pointer;
    color: #1a1a1a;
    line-height: 0;
}

.overlay {
    position: absolute;
    inset: 0;
    background-color: rgba(0, 40, 20, 0.72);
    display: flex;
    align-items: flex-end;
    z-index: 100;
}

.verwijderPopup {
    width: 100%;
    background-color: #ffffff;
    border-radius: 20px 20px 0 0;
    padding: 28px 6% 40px;
}

.popupTitel {
    font-family: 'Inter', sans-serif;
    font-size: clamp(16px, 5vw, 19px);
    font-weight: 700;
    color: #1a1a1a;
    margin: 0 0 10px;
}

.popupTekst {
    font-family: 'Montserrat', sans-serif;
    font-size: clamp(13px, 4vw, 15px);
    color: #313131;
    line-height: 1.55;
    margin: 0 0 28px;
}

.popupKnoppen {
    display: flex;
    gap: 12px;
}

.annuleerKnop,
.verwijderBevestigKnop {
    flex: 1;
    height: 46px;
    border: none;
    border-radius: 10px;
    font-family: 'Inter', sans-serif;
    font-size: clamp(13px, 4vw, 15px);
    font-weight: 600;
    cursor: pointer;
}

.annuleerKnop {
    background-color: #f5f6f7;
    color: #313131;
}

.verwijderBevestigKnop {
    background-color: #c4554b;
    color: #ffffff;
}

.verwijderFade-enter-active,
.verwijderFade-leave-active {
    transition: opacity 0.25s ease;
}

.verwijderFade-enter-from,
.verwijderFade-leave-to {
    opacity: 0;
}

.verwijderOmhoog-enter-active,
.verwijderOmhoog-leave-active {
    transition: transform 0.3s ease;
}

.verwijderOmhoog-enter-from,
.verwijderOmhoog-leave-to {
    transform: translateY(100%);
}
</style>
