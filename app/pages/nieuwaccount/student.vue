<script setup>
const { registerStudent } = useAuth()

const volledigeNaam = ref('')
const studentnummer = ref('')
const email = ref('')
const wachtwoord = ref('')
const wachtwoordBevestig = ref('')
const fotoFile = ref(null)
const fotoPreview = ref('')
const fout = ref('')
const bezig = ref(false)

const STUDENT_RE = /^[^\s@]+@student\.glu\.nl$/i
const MAX_BYTES = 5 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

function onFileChange(e) {
    const file = e.target.files && e.target.files[0]
    if (!file) {
        fotoFile.value = null
        fotoPreview.value = ''
        return
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
        fout.value = 'Alleen JPG, PNG of WEBP'
        e.target.value = ''
        return
    }
    if (file.size > MAX_BYTES) {
        fout.value = 'Foto is te groot (max 5 MB)'
        e.target.value = ''
        return
    }
    fout.value = ''
    fotoFile.value = file
    fotoPreview.value = URL.createObjectURL(file)
}

async function onSubmit() {
    fout.value = ''
    const naam = volledigeNaam.value.trim()
    if (!naam.includes(' ')) {
        fout.value = 'Vul je voor- en achternaam in'
        return
    }
    const [voornaam, ...rest] = naam.split(/\s+/)
    const achternaam = rest.join(' ')

    const nr = Number(studentnummer.value)
    if (!Number.isInteger(nr) || nr < 10000) {
        fout.value = 'Studentnummer moet een getal zijn (minimaal 5 cijfers)'
        return
    }

    const e = email.value.trim().toLowerCase()
    if (!STUDENT_RE.test(e)) {
        fout.value = 'Gebruik een @student.glu.nl adres'
        return
    }
    if (wachtwoord.value.length < 8) {
        fout.value = 'Wachtwoord moet minstens 8 tekens zijn'
        return
    }
    if (wachtwoord.value !== wachtwoordBevestig.value) {
        fout.value = 'Wachtwoorden komen niet overeen'
        return
    }
    if (!fotoFile.value) {
        fout.value = 'Upload een profielfoto'
        return
    }

    bezig.value = true
    try {
        const fd = new FormData()
        fd.append('first_name', voornaam)
        fd.append('last_name', achternaam)
        fd.append('email', e)
        fd.append('student_number', String(nr))
        fd.append('password', wachtwoord.value)
        fd.append('password_confirm', wachtwoordBevestig.value)
        fd.append('profile_picture', fotoFile.value)

        const { token } = await registerStudent(fd)
        await navigateTo({ path: '/verify', query: { mode: 'register', token, role: 'student' } })
    } catch (err) {
        fout.value = err?.statusMessage || err?.data?.statusMessage || 'Registreren mislukt'
    } finally {
        bezig.value = false
    }
}
</script>

<template>
    <form class="login-leerling" @submit.prevent="onSubmit">
        <div id="logo-box">
            <img src="/img/glulogo.png" class="glulogo" />
        </div>

        <div class="login-box">

            <div class="foto-upload">
                <label class="foto-label">
                    <div class="foto-preview" :class="{ 'heeft-foto': fotoPreview }">
                        <img v-if="fotoPreview" :src="fotoPreview" class="foto-img" />
                        <span v-else class="foto-placeholder">+ foto</span>
                    </div>
                    <input type="file" accept="image/jpeg,image/png,image/webp" class="foto-input" @change="onFileChange" required />
                </label>
                <p class="foto-hint">Profielfoto (verplicht)</p>
            </div>

            <input v-model="volledigeNaam" type="text" placeholder="Uw volledige naam" class="input-field" autocomplete="name" required />
            <input v-model="studentnummer" type="text" inputmode="numeric" pattern="\d*" placeholder="Studenten nummer" class="input-field" required />
            <input v-model="email" type="email" placeholder="Schoolmail (@student.glu.nl)" class="input-field" autocomplete="email" required />
            <input v-model="wachtwoord" type="password" placeholder="Wachtwoord (min. 8 tekens)" class="input-field" autocomplete="new-password" required />
            <input v-model="wachtwoordBevestig" type="password" placeholder="Herhaal wachtwoord" class="input-field" autocomplete="new-password" required />

            <p v-if="fout" class="fout">{{ fout }}</p>

            <button type="submit" class="login-button" :disabled="bezig">{{ bezig ? 'Bezig…' : 'Aanmelden' }}</button>
        </div>
    </form>
</template>

<style scoped>
.login-leerling {
    font-family: Arial, sans-serif;
    width: 100vw;
    min-height: 95vh;

    display: flex;
    align-items: center;
    flex-direction: column;
}

#logo-box {
    background-image: url('/img/student-inlog-achtergrond.png');
    background-size: cover;
    background-position: center;

    width: 100%;
    height: 92vw;

    display: flex;
    justify-content: center;
}

.login-box {
    display: flex;
    flex-direction: column;
    align-items: center;

    width: 280px;

    /* margin-top: 70px; */
    padding-bottom: 30px;
}

.glulogo {
    width: 160px;
    position: absolute;
    top: 40px;
}

.foto-upload {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 24px;
}

.foto-label {
    cursor: pointer;
    display: block;
}

.foto-preview {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    background-color: #f4f4f4;
    border: 2px dashed #bbb;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.foto-preview.heeft-foto {
    border-style: solid;
    border-color: #FF9408;
}

.foto-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.foto-placeholder {
    color: #999;
    font-size: 14px;
}

.foto-input {
    display: none;
}

.foto-hint {
    font-size: 12px;
    color: #777;
    margin: 8px 0 0;
}

.input-field {
    background: transparent;

    width: 100%;

    margin-bottom: 25px;
    padding: 5px 3px;

    border: none;
    border-bottom: 1px solid #999;
    outline: none;

    font-size: 16px;
}

.fout {
    width: 100%;
    margin: 0 0 14px;
    color: #c4554b;
    font-size: 14px;
    text-align: center;
}

.login-button {
    width: 100%;
    background-color: #FF9408;
    color: white;

    padding: 12px;

    border: none;
    border-radius: 25px;
    cursor: pointer;

    font-size: 16px;

    outline: none;
    box-shadow: none;
}

.login-button[disabled] {
    opacity: 0.7;
    cursor: wait;
}

.login-button:focus,
.login-button:active,
.login-button:focus-visible {
    background-color: #b76904 !important;
}
</style>
