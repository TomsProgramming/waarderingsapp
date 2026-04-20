<script setup>
import NavigatieBalk from '~/components/NavigatieBalk.vue'
const { themaKleur, themaKleurKaart } = useDocentThema()

const zoekterm = ref('')
const studenten = ref([])

let debounceTimer = null

async function zoek() {
    const { students } = await $fetch('/api/students', {
        params: zoekterm.value ? { q: zoekterm.value } : undefined
    })
    studenten.value = students
}

function onZoekInput() {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(zoek, 250)
}

onMounted(zoek)

function openStudent(id) {
    navigateTo({ path: '/docent/dashboard', query: { student: id } })
}

function initialen(s) {
    return ((s.first_name || '').charAt(0) + (s.last_name || '').charAt(0)).toUpperCase()
}
</script>

<template>
    <div class="dashboard-docenten">

        <div class="header">
            <h1>DASHBOARD</h1>

            <div class="search-bar">
                <span class="search-icon">🔍</span>
                <input v-model="zoekterm" @input="onZoekInput" type="text" placeholder="Zoek naar student" />
            </div>
        </div>

        <div class="body">
            <h2>STUDENTEN</h2>
            <div class="student-cards">
                <p v-if="!studenten.length" class="leeg">Geen studenten gevonden.</p>
                <div v-for="s in studenten" :key="s.id" class="student-card" @click="openStudent(s.id)">
                    <div class="student-photo">
                        <img v-if="s.profile_picture" :src="s.profile_picture" :alt="`${s.first_name} ${s.last_name}`" />
                        <span v-else>{{ initialen(s) }}</span>
                    </div>

                    <div class="student-info">
                        <h3>{{ s.first_name }} {{ s.last_name }}</h3>
                        <p>{{ s.email }}</p>
                        <span>{{ s.student_number }}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="footer">
            <NavigatieBalk />
        </div>
    </div>
</template>

<style scoped>
.dashboard-docenten {
    display: flex;
    flex-direction: column;
    background-color: v-bind(themaKleur);
    height: 100vh;
    width: 100vw;
    font-family: Arial, sans-serif;
    overflow: hidden;
}

.header {
    height: 180px;
    padding: 30px 25px;
    color: white;
}

.header h1 {
    font-weight: 300;
    font-size: 22px;
}

.search-bar {
    margin-top: 20px;
    background-color: #ffffff;
    border-radius: 25px;
    padding: 10px 15px;
    display: flex;
    align-items: center;
}

.search-bar input {
    border: none;
    outline: none;
    background: transparent;
    margin-left: 10px;
    font-size: 14px;
    width: 100%;
    font-weight: 400;
}

.search-icon {
    font-size: 16px;
    opacity: 0.6;
}

.body {
    flex: 1;
    background-color: #f4f4f4;
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
    padding: 25px;
    margin-top: -40px;
    overflow-y: auto;
}

.body h2 {
    font-weight: 400;
    font-size: 20px;
}

.leeg {
    color: #666;
    text-align: center;
    padding: 20px;
}

.student-cards {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    flex: 1;
    margin-top: 20px;
    gap: 10px;
    padding-bottom: 20px;
}

.student-card {
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 435px;
    height: 98px;
    background-color: v-bind(themaKleurKaart);
    cursor: pointer;
    border-radius: 25px;
    padding: 5px 10px;
    gap: 20px;
}

.student-photo {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background: white;
    color: v-bind(themaKleur);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 22px;
    overflow: hidden;
    flex-shrink: 0;
}

.student-photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.student-info h3 {
    margin: 0;
    font-size: 20px;
    font-weight: 400;
    color: black;
}

.student-info p {
    margin: 5px 0 0 0;
    font-size: 14px;
    color: black;
}

.student-info span {
    font-size: 16px;
    color: black;
}

.footer {
    background-color: #f4f4f4;
}
</style>
