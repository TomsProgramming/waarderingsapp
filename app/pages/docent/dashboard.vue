<script setup>
import RadarChart from '~/components/RadarChart.vue'
import NavigatieBalk from '~/components/NavigatieBalk.vue'
</script>

<template>
    <div class="pagina">

        <header class="paginaHoofd">
            <span class="dashboardTitel">DASHBOARD</span>
            <div class="zoekBalkWrapper">
                <svg class="zoekIcoon" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="6.5" cy="6.5" r="5.5" stroke="#8b8b8b" stroke-width="1.5" />
                    <line x1="10.5" y1="10.5" x2="14" y2="14" stroke="#8b8b8b" stroke-width="1.5"
                        stroke-linecap="round" />
                </svg>
                <input class="zoekBalk" type="search" placeholder="Zoek naar student" />
            </div>
        </header>

        <div class="paginaWit">
            <main class="paginaInhoud">

                <div class="studentKaart">
                    <div class="studentFotoRond">
                        <span class="studentInitialen">JG</span>
                    </div>
                    <div class="studentInfo">
                        <span class="studentNaam">Jorden Gielen</span>
                        <span class="studentRichting">webdesign</span>
                    </div>
                </div>

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

            </main>

            <NavigatieBalk kleur-actief="#2be6b9" />
        </div>

    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Montserrat:wght@400&display=swap');

/* ===== Pagina layout ===== */
.pagina {
    display: flex;
    flex-direction: column;
    height: 100dvh;
    overflow: hidden;
    background-color: #39dea1;
}

/* ===== Header ===== */
.paginaHoofd {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: clamp(20px, 6vw, 32px);
    padding: 4vh 10% 4vh;
}

.dashboardTitel {
    color: #ffffff;
    font-family: 'Inter', sans-serif;
    font-size: clamp(16px, 5.3vw, 20px);
    font-weight: 400;
    text-transform: uppercase;
}

/* ===== Zoekbalk ===== */
.zoekBalkWrapper {
    display: flex;
    align-items: center;
    gap: 10px;
    background-color: #ffffff;
    border-radius: 18px;
    padding: 0 16px;
    height: 35px;
    width: 100%;
    margin-top: auto;
}

.zoekIcoon {
    flex-shrink: 0;
    width: 14px;
    height: 14px;
}

.zoekBalk {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-family: 'Inter', sans-serif;
    font-size: clamp(11px, 3.5vw, 13px);
    color: #313131;
}

.zoekBalk::placeholder {
    color: #8b8b8b;
}

.zoekBalk::-webkit-search-cancel-button {
    display: none;
}

/* ===== Witte kaart ===== */
.paginaWit {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    border-radius: 16px 16px 0 0;
    overflow: hidden;
    min-height: 0;
}

/* ===== Inhoud ===== */
.paginaInhoud {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-height: 0;
    padding-top: 5%;
}

/* ===== Student kaart ===== */
.studentKaart {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 0 6%;
    flex-shrink: 0;
}

.studentFotoRond {
    flex-shrink: 0;
    width: clamp(56px, 18vw, 68px);
    height: clamp(56px, 18vw, 68px);
    border-radius: 50%;
    background-color: #39dea1;
    display: flex;
    align-items: center;
    justify-content: center;
}

.studentInitialen {
    color: #ffffff;
    font-family: 'Inter', sans-serif;
    font-size: clamp(16px, 5vw, 20px);
    font-weight: 600;
    text-transform: uppercase;
}

.studentInfo {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.studentNaam {
    color: #000000;
    font-family: 'Inter', sans-serif;
    font-size: clamp(13px, 4vw, 15px);
    font-weight: 400;
}

.studentRichting {
    color: #000000;
    font-family: 'Inter', sans-serif;
    font-size: clamp(10px, 3.2vw, 12px);
    font-weight: 400;
}

/* ===== Radar grafiek ===== */
.grafiekWrapper {
    align-self: center;
    width: 72%;
    max-width: 280px;
    aspect-ratio: 1;
    flex-shrink: 0;
    margin: 6% 0;
    position: relative;
}

.grafiekWrapper :deep(canvas) {
    width: 100% !important;
    height: 100% !important;
}

/* ===== Aandacht sectie ===== */
.aandachtSectie {
    background-color: #f5f6f7;
    padding: 5% 6%;
    margin-top: auto;
    flex-shrink: 0;
    overflow-y: auto;
}

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
</style>
