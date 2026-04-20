<script setup>
import NavigatieBalk from '~/components/NavigatieBalk.vue'

const { user } = useAuth()
const { themaKleur } = useThema()

const actieveTab = ref('docent')
const reviews = ref([])
const laden = ref(false)

async function laad() {
    if (!user.value) return
    laden.value = true
    try {
        const data = await $fetch('/api/reviews', {
            params: { student: user.value.id, role: actieveTab.value === 'docent' ? 'teacher' : 'customer' }
        })
        reviews.value = data.reviews
    } finally {
        laden.value = false
    }
}

onMounted(laad)
watch(actieveTab, laad)

const volledigeNaam = computed(() =>
    user.value ? `${user.value.first_name} ${user.value.last_name}`.trim() : ''
)
</script>

<template>
    <div class="pagina">

        <header class="paginaHoofd">
            <span class="feedbackTitel">FEEDBACK</span>
            <span class="docentNaam">{{ volledigeNaam }}</span>
        </header>

        <div class="tabs">
            <button :class="{ actief: actieveTab === 'docent' }" @click="actieveTab = 'docent'">Docent</button>
            <button :class="{ actief: actieveTab === 'klant' }" @click="actieveTab = 'klant'">Klant</button>
        </div>

        <div class="paginaWit">
            <main class="paginaInhoud">
                <p v-if="laden" class="leeg">Laden…</p>
                <p v-else-if="!reviews.length" class="leeg">Nog geen reviews.</p>
                <div v-else v-for="item in reviews" :key="item.id" class="feedbackKaart"
                    :class="{ klantWeergave: actieveTab === 'klant' }">
                    <div class="kaartKop">
                        <span class="projectNaam">{{ item.project_name || 'Project' }}</span>
                        <span class="klantNaam">{{ actieveTab === 'klant' ? (item.customer_name || 'Klant') : 'Docent' }}</span>
                    </div>
                    <p class="kaartTekst">{{ item.review || '-' }}</p>
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
    margin: 0;
}
</style>
