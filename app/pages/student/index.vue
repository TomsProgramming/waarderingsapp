<script setup>
import RadarChart from '~/components/RadarChart.vue'
import NavigatieBalk from '~/components/NavigatieBalk.vue'
</script>

<template>
    <div class="pagina">

        <header class="paginaHoofd">
            <span class="voortgangLabel">VOORTGANG</span>
            <span class="studentNaam">JORDEN GIELEN</span>
        </header>

        <div class="paginaWit">
            <main class="paginaInhoud">

                <button class="infoKnop" aria-label="Meer informatie">
                    <svg viewBox="0 0 30 30" width="28" height="28" fill="none" stroke="#bbb" stroke-width="1.5">
                        <circle cx="15" cy="15" r="13.5" />
                        <circle cx="15" cy="9.5" r="1.2" fill="#bbb" stroke="none" />
                        <line x1="15" y1="13" x2="15" y2="21" stroke-linecap="round" />
                    </svg>
                </button>

                <div class="grafiekWrapper">
                    <RadarChart />
                </div>

                <section class="aandachtSectie">
                    <h2 class="aandachtTitel">AANDACHT</h2>
                    <p class="aandachtTekst">
                        We zien dat je erg goed bezig bent op het gebied van zelfstandigheid,
                        samenwerken en communiceren. Wel merken we dat er nog enkele
                        aandachtspunten liggen op het gebied van presenteren en organiseren.
                        Hieronder vind je enkele medestudenten die hierin uitblinken. Mogelijk
                        kun je jezelf door hun te observeren en van hen te leren verder
                        ontwikkelen.
                    </p>
                </section>

            </main>

            <NavigatieBalk />
        </div>

    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Montserrat:wght@400&display=swap');

:global(html),
:global(body) {
    height: 100%;
    margin: 0;
    padding: 0;
    font-family: 'Inter', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.pagina {
    display: flex;
    flex-direction: column;
    min-height: 100dvh;
    background-color: #ff9408;
}

.paginaHoofd {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 7vh 10% 5vh;
}

.voortgangLabel {
    color: #ffffff;
    font-family: 'Inter', sans-serif;
    font-size: clamp(16px, 5.3vw, 20px);
    font-weight: 400;
    text-transform: uppercase;
}

.studentNaam {
    color: #ffffff;
    font-family: 'Inter', sans-serif;
    font-size: clamp(11px, 3.7vw, 14px);
    font-weight: 400;
    letter-spacing: 2.2px;
    text-transform: uppercase;
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
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    position: relative;
    min-height: 0;
}

.infoKnop {
    position: absolute;
    top: 14px;
    right: 14px;
    background: none;
    border: none;
    padding: 4px;
    cursor: pointer;
    line-height: 0;
    z-index: 1;
    -webkit-tap-highlight-color: transparent;
}

.grafiekWrapper {
    align-self: center;
    width: 72%;
    max-width: 280px;
    aspect-ratio: 1;
    flex-shrink: 0;
    margin: 8% 0;
    position: relative;
}

.grafiekWrapper :deep(canvas) {
    width: 100% !important;
    height: 100% !important;
}

.aandachtSectie {
    background-color: #f5f6f7;
    padding: 5% 6%;
    margin-top: auto;
    flex-shrink: 0;
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
