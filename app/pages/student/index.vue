<script setup>
import RadarChart from '~/components/RadarChart.vue'
import NavigatieBalk from '~/components/NavigatieBalk.vue'

const actieveTab = ref('docent')
const klantBericht = ref("De student werkte goed samen en communiceerde duidelijk. Fijne samenwerking!")

const { themaKleur, themaKleurDonker } = useThema()

const onderdelen = [
    'Presenteren',
    'Organiseren',
    'Zelfstandigheid',
    'Samenwerken',
    'Communiceren'
]

const scores = reactive({
    Presenteren: 2,
    Organiseren: 1,
    Zelfstandigheid: 4,
    Samenwerken: 4,
    Communiceren: 4
})

const reviewTekst = ref('')

const gaTerug = () => {
    navigateTo('/docent')
}

const gaNaarKlant = () => {
    navigateTo('/klant/rating')
}

const verstuurReview = () => {
    console.log('Review verstuurd', {
        review: reviewTekst.value,
        scores: { ...scores }
    })
}
</script>

<template>
    <div class="pagina">

        <header class="paginaHoofd">
            <h2>VOORTGANG</h2>
        </header>

        <!-- Tabs -->
        <div class="tabFotoRij">
            <button class="tab" :class="{ tabActief: actieveTab === 'docent' }" @click="actieveTab = 'docent'">
                Docent
            </button>

            <div class="middenFoto">
                <div class="studentFotoRond">
                    <span class="studentInitialen">JG</span>
                </div>
            </div>

            <button class="tab" :class="{ tabActief: actieveTab === 'klant' }" @click="actieveTab = 'klant'">
                Klant
            </button>
        </div>

        <div class="paginaWit">

            <!-- Student info -->
            <div class="studentKaart">
                <div class="studentInfo">
                    <span class="studentNaam">Jorden Gielen</span>
                    <span class="studentNummer">210055</span>
                    <span class="studentRichting">webdesign</span>
                </div>
            </div>

            <!-- MAIN CONTENT -->
            <main class="paginaInhoud">

                <!-- DOCENT VIEW -->
                <div v-if="actieveTab === 'docent'" class="paneelInhoud">

                    <div class="grafiekWrapper">
                        <RadarChart />
                    </div>

                    <section class="aandachtSectie">
                        <h2 class="aandachtTitel">AANDACHT</h2>
                        <p class="aandachtTekst">
                            Er zijn wat aandacht punten voor deze student. Dit zijn namelijk
                            zelfstandigheid, communiceren en samenwerken.
                            <br /><br />
                            Mogelijk kan je het met een van deze studenten laten werken.
                        </p>
                    </section>

                </div>

                <!-- KLANT VIEW -->
                <div v-else class="paneelInhoud">

                    <div class="grafiekWrapper">
                        <RadarChart />
                    </div>

                    <section class="klantBericht">
                        <h2 class="klantTitel">JAN</h2>
                        <p class="klantTekst">
                            {{ klantBericht }}
                        </p>
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
    display: flex;
    align-items: center;

    flex-shrink: 0;

    gap: 8px;

    padding: 4vh 5% 3vh;
}

.paginaHoofd h2{
    color: white;

    font-family: 'inter', sans-serif;
    font-weight: 400;
    text-transform: uppercase;  
}

.dashboardTitel {
    color: #ffffff;
    font-family: 'Inter', sans-serif;
    font-size: clamp(16px, 5.3vw, 20px);
    font-weight: 400;
    text-transform: uppercase;
}

.terugKnop {
    display: grid;
    place-items: center;

    background: none;

    border: none;

    color: #ffffff;

    padding: 0;
    line-height: 0;
    cursor: pointer;
}

.tabFotoRij {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;

    padding: 0 12%;
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

.paginaInhoud::-webkit-scrollbar {
    width: 4px;
}

.paginaInhoud::-webkit-scrollbar-thumb {
    background-color: v-bind(themaKleur);
    border-radius: 10px;
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
    margin-top: 0;
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

.studentRichting {
    color: #000000;
    font-family: 'Inter', sans-serif;
    font-size: clamp(12px, 3.6vw, 15px);
    font-weight: 400;
}

/* ===== Radar grafiek ===== */
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

.aandachtSectie {
    background-color: #f5f6f7;
    padding: 20px 18px;
    border-radius: 14px;
    flex-shrink: 0;
}

.klantTitel,
.aandachtTitel {
    font-family: 'Inter', sans-serif;
    font-size: clamp(16px, 5.3vw, 20px);
    font-weight: 400;
    text-transform: uppercase;
    margin: 0 0 10px;
    color: #000000;
}

.aandachtTekst {
    font-family: 'Montserrat', sans-serif;
    font-size: clamp(13px, 4vw, 15px);
    color: #313131;
    line-height: 1.65;
    margin: 0;
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
    border: 1.7px solid #39dea1;
    background: transparent;
    cursor: pointer;
}

.cirkel.gevuld {
    background: #39dea1;
}
</style>
