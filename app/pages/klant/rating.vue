<script setup>
import { ref, reactive } from 'vue'

const items = [
    "Presenteren",
    "Organiseren",
    "Zelfstandigheid",
    "Samenwerken",
    "Communiceren"
]

const ratings = reactive({})

const showPopup = ref(false)

const form = reactive({
    naam: '',
    project: '',
    bericht: ''
})

const rating = reactive({})


function submitForm() {
    if (!form.naam || !form.project) {
        alert("Vul alle velden in!")
        return
    }

    const allRated = items.every(item => ratings[item])
    if (!allRated) {
        alert("Geef voor alle onderdelen een beoordeling!")
        return
    }

    const data = {
        ...form,
        ratings
    }

    console.log("VERSTUURD:", data)

    // Popup tonen
    showPopup.value = true

    // Automatisch sluiten na 7 seconden en form resetten
    setTimeout(() => {
        showPopup.value = false

        // Formulier leegmaken
        form.naam = ''
        form.project = ''
        form.bericht = ''

        // Ratings resetten
        items.forEach(item => {
            ratings[item] = 0
        })
    }, 7000)
}
</script>

<template>
    <div class="rating">

        <header class="paginaHoofd">
            <img src="/img/glulogo.png" alt="Profielfoto" class="profilepicture" />

            <div class="headerText">
                <h1>Jorden Gielen</h1>
                <p>webdesign</p>
            </div>
        </header>

        <main class="card">
            <div class="field">
                <label>Wat is uw naam <span class="required">*</span></label>
                <input v-model="form.naam" type="text" placeholder="Bijv Tom"/>
            </div>

            <div class="field">
                <label>Wat is het project naam <span class="required">*</span></label>
                <input v-model="form.project" type="text" placeholder="Bijv Waarderingsapp"/>
            </div>

            <div class="ratingSection">
                <p>
                    Wat was uw ervaring met Jorden Gielen
                    <span class="required">*</span>
                </p>

                <div class="ratingRow" v-for="item in items" :key="item">
                    <span>{{ item }}</span>

                    <div class="circles">
                        <span v-for="i in 5" :key="i" class="circle" :class="{ filled: i <= (ratings[item] || 0) }"
                            @click="ratings[item] = i"></span>
                    </div>
                </div>
            </div>

            <textarea v-model="form.bericht" placeholder="Laat een berichtje achter"></textarea>
            <button class="sendBtn" @click="submitForm">➤</button>
        </main>

        <div v-if="showPopup" class="overlay">
            <div class="popup">

                <div class="logoCircle">
                    <img src="/img/glulogo.png" alt="logo">
                </div>

                <p>
                    👍 Bedankt voor jou review <br>
                    we zien uw graag nog een keer langs komen
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

/* CARD */
.card {
    background: #f2f2f2;
    width: 85%;
    max-width: 400px;
    border-radius: 6px;
    padding: 20px;

    display: flex;
    flex-direction: column;
    gap: 18px;

    height: 570px;
    position: relative;
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
}

/* popup na verstuur knop */
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