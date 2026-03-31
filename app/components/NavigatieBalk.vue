<script setup>
const route = useRoute()

const isDocent = computed(() => route.path.startsWith('/docent'))
const rolPrefix = computed(() => isDocent.value ? '/docent' : '/student')
const kleurActief = computed(() => isDocent.value ? '#39dea1' : '#ff9408')

const paginas = computed(() => ({
    dashboard: rolPrefix.value,
    feedback: `${rolPrefix.value}/feedbacklist`,
    profiel: `${rolPrefix.value}/profiel`,
}))

const isActief = (type) => {
    if (type === 'dashboard') {
        return route.path === rolPrefix.value || route.path === rolPrefix.value + '/'
    }
    return route.path.startsWith(paginas.value[type])
}
</script>

<template>
    <nav class="navigatieBalk">
        <NuxtLink :to="paginas.dashboard" class="navKnop" :class="{ navKnopActief: isActief('dashboard') }"
            aria-label="Dashboard">
            <svg viewBox="0 0 27 26" width="27" height="26" fill="currentColor">
                <rect x="0" y="0" width="12" height="15" rx="1" />
                <rect x="15" y="0" width="12" height="10" rx="1" />
                <rect x="0" y="17" width="12" height="9" rx="1" />
                <rect x="15" y="12" width="12" height="14" rx="1" />
            </svg>
        </NuxtLink>
        <NuxtLink :to="paginas.feedback" class="navKnop" :class="{ navKnopActief: isActief('feedback') }"
            aria-label="Feedback">
            <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M23.8369 0H2.64855C1.19185 0 0.013243 1.19185 0.013243 2.64855L0 26.4855L5.29709 21.1884H23.8369C25.2936 21.1884 26.4855 19.9965 26.4855 18.5398V2.64855C26.4855 1.19185 25.2936 0 23.8369 0ZM14.567 15.8913H11.9185V13.2427H14.567V15.8913ZM14.567 10.5942H11.9185V5.29709H14.567V10.5942Z"
                    fill="currentColor" />
            </svg>
        </NuxtLink>
        <NuxtLink :to="paginas.profiel" class="navKnop" :class="{ navKnopActief: isActief('profiel') }"
            aria-label="Profiel">
            <svg viewBox="0 0 27 27" width="27" height="27" fill="currentColor">
                <path
                    d="M13.5 13.5c2.97 0 5.4-2.43 5.4-5.4S16.47 2.7 13.5 2.7 8.1 5.13 8.1 8.1s2.43 5.4 5.4 5.4zm0 2.7c-3.6 0-10.8 1.8-10.8 5.4v2.7h21.6v-2.7c0-3.6-7.2-5.4-10.8-5.4z" />
            </svg>
        </NuxtLink>
    </nav>
</template>

<style scoped>
.navigatieBalk {
    flex-shrink: 0;
    height: 66px;
    background-color: #ffffff;
    border-radius: 15px 15px 0 0;
    box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.16);
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 0 4%;
}

.navKnop {
    background: none;
    border: none;
    padding: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 0;
    color: #b4b4b4;
    text-decoration: none;
    -webkit-tap-highlight-color: transparent;
}

.navKnopActief {
    color: v-bind('kleurActief');
}
</style>
