<script setup>
definePageMeta({ auth: false })

const route = useRoute()

const studentId = computed(() => {
    const q = route.query.student
    return q ? Number(q) : null
})

const student = ref(null)
const laden = ref(true)
const fout = ref('')

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

const form = reactive({
    customer_name: '',
    project_name: '',
    review: ''
})

const showPopup = ref(false)
const bezig = ref(false)

async function laadStudent() {
    if (!studentId.value) {
        fout.value = 'Ongeldige link'
        laden.value = false
        return
    }
    try {
        const data = await $fetch(`/api/students/public/${studentId.value}`)
        student.value = data.student
    } catch {
        fout.value = 'Student niet gevonden'
    } finally {
        laden.value = false
    }
}

onMounted(laadStudent)

const studentNaam = computed(() =>
    student.value ? `${student.value.first_name} ${student.value.last_name}`.trim() : ''
)

async function verstuur() {
    if (!form.customer_name.trim() || !form.project_name.trim()) {
        alert('Vul alle velden in')
        return
    }
    if (onderdelen.some(o => !scores[o.key])) {
        alert('Geef voor alle onderdelen een beoordeling')
        return
    }
    bezig.value = true
    try {
        await $fetch('/api/reviews', {
            method: 'POST',
            body: {
                student_id: studentId.value,
                role: 'customer',
                customer_name: form.customer_name,
                project_name: form.project_name,
                review: form.review,
                present: scores.present,
                organise: scores.organise,
                independence: scores.independence,
                collaborate: scores.collaborate,
                communicate: scores.communicate
            }
        })
        showPopup.value = true
        setTimeout(() => {
            showPopup.value = false
            form.customer_name = ''
            form.project_name = ''
            form.review = ''
            onderdelen.forEach(o => { scores[o.key] = 0 })
        }, 5000)
    } catch (e) {
        alert(e?.data?.message || 'Versturen mislukt')
    } finally {
        bezig.value = false
    }
}
</script>

<template>
    <div class="rating">

        <header class="paginaHoofd">
            <img src="/img/glulogo.png" alt="Profielfoto" class="profilepicture" />

            <div class="headerText">
                <h1>{{ studentNaam || (laden ? 'Laden…' : 'Onbekend') }}</h1>
                <p v-if="fout" class="fout">{{ fout }}</p>
                <p v-else>Laat een review achter</p>
            </div>
        </header>

        <main v-if="student" class="card">
            <div class="field">
                <label>Wat is uw naam <span class="required">*</span></label>
                <input v-model="form.customer_name" type="text" placeholder="Bijv Tom" />
            </div>

            <div class="field">
                <label>Wat is het project naam <span class="required">*</span></label>
                <input v-model="form.project_name" type="text" placeholder="Bijv Waarderingsapp" />
            </div>

            <div class="ratingSection">
                <p>
                    Wat was uw ervaring met {{ studentNaam }}
                    <span class="required">*</span>
                </p>

                <div class="ratingRow" v-for="o in onderdelen" :key="o.key">
                    <span>{{ o.label }}</span>

                    <div class="circles">
                        <span v-for="i in 5" :key="i" class="circle"
                            :class="{ filled: i <= scores[o.key] }"
                            @click="scores[o.key] = i" />
                    </div>
                </div>
            </div>

            <textarea v-model="form.review" placeholder="Laat een berichtje achter" />
            <button class="sendBtn" :disabled="bezig" @click="verstuur">➤</button>
        </main>

        <div v-if="showPopup" class="overlay">
            <div class="popup">

                <div class="logoCircle">
                    <img src="/img/glulogo.png" alt="logo">
                </div>

                <p>
                    👍 Bedankt voor jouw review <br>
                    we zien u graag nog eens langskomen
                </p>

            </div>
        </div>

    </div>
</template>

<style scoped>
.rating {
    width: 100vw;
    min-height: 100vh;
    background-color: #FF9408;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 40px;
    font-family: 'Inter', sans-serif;
}

.paginaHoofd {
    display: flex;
    align-items: center;
    gap: 15px;
    color: white;
    margin-bottom: 30px;
}

.profilepicture {
    width: 70px;
    height: 70px;
    border-radius: 50%;
}

.headerText h1 {
    margin: 0;
    font-size: 22px;
}

.headerText p {
    margin: 0;
    font-size: 14px;
}

.headerText .fout {
    color: #ffdada;
}

.card {
    background: #f2f2f2;
    width: 85%;
    max-width: 400px;
    border-radius: 6px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 18px;
    min-height: 570px;
    position: relative;
    margin-bottom: 40px;
}

input {
    padding: 14px;
    border: none;
    border-radius: 10px;
    background: #e6e6e6;
}

.ratingSection p {
    margin-bottom: 10px;
}

.ratingRow {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.circles {
    display: flex;
    gap: 6px;
}

.circle {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 2px solid #FF9408;
    cursor: pointer;
    transition: 0.2s;
}

.circle.filled {
    background: #FF9408;
}

.circle:hover {
    transform: scale(1.2);
}

textarea {
    height: 130px;
    border: none;
    border-radius: 8px;
    padding: 10px;
    background: #ddd;
    resize: none;
}

.sendBtn {
    position: absolute;
    bottom: -25px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: none;
    background: #FF9408;
    color: white;
    font-size: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
    cursor: pointer;
}

.sendBtn:disabled { opacity: 0.6; cursor: default; }

.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
}

.popup {
    background: white;
    width: 80%;
    max-width: 320px;
    padding: 30px 20px;
    border-radius: 6px;
    text-align: center;
    position: relative;
}

.logoCircle {
    position: absolute;
    top: -40px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.logoCircle img {
    width: 60px;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

label {
    font-size: 13px;
}

.required {
    color: red;
    font-weight: bold;
}
</style>
