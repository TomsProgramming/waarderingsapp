<script setup>
import RadarChart from '~/components/RadarChart.vue'
</script>

<template>
    <header>
        <h1>voortgang</h1>
        <p>jorden gielen</p>
    </header>

    <main>
        <RadarChart />
        <div class="aandacht">
            <h2>aandacht</h2>
            <p>We zien dat je erg goed bezig bent op het gebied van zelfstandigheid, samenwerken en communiceren. Wel merken we dat er nog enkele aandachtspunten liggen op het gebied van presenteren en organiseren. Hieronder vind je enkele mede- studenten die hierin uitblinken. Mogelijk kun je jezelf door hun te observeren en van hen te leren verder ontwikkelen.
            </p>
        </div>
    </main>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');

:global(html),
:global(body) {
    height: 100%;
    margin: 0;
    padding: 0;
    background-color: #FF9408;

    font-family: "Inter", sans-serif;
}

header {
    display: flex;
    flex-direction: column;
    align-items: flex-start;


    margin-top: 50px;
    margin-left: 10%;

    margin-bottom: 50px;
}

header h1,
header p {
    color: white;
    margin: 0;
    text-transform: uppercase;
}

header h1 {
    font-size: 1.5rem;
    font-weight: normal;
}

header p {
    font-size: 1rem;
}

main {
    background-color: #fff;
    border-radius: 20px;

    padding: 20px;
}

/* set te radar center */
main .radar-chart {
    display: block;
    margin: 0 auto;
}

main .aandacht h2 {
    text-transform: uppercase;
    font-weight: normal;
}

main .aandacht p {
    margin-top: 10px;
}
</style>
