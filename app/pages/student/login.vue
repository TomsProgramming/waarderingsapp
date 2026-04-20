<script setup>
const { login } = useAuth()

const email = ref('')
const password = ref('')
const fout = ref('')
const bezig = ref(false)

const STUDENT_RE = /^[^\s@]+@student\.glu\.nl$/i

async function onSubmit() {
    fout.value = ''
    const e = email.value.trim().toLowerCase()
    if (!STUDENT_RE.test(e)) {
        fout.value = 'Gebruik een @student.glu.nl adres'
        return
    }
    if (!password.value) {
        fout.value = 'Vul je wachtwoord in'
        return
    }
    bezig.value = true
    try {
        const { token } = await login(e, password.value, 'student')
        await navigateTo({ path: '/verify', query: { mode: 'login', token, role: 'student' } })
    } catch (err) {
        fout.value = err?.statusMessage || err?.data?.statusMessage || 'Inloggen mislukt'
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

            <input v-model="email" type="email" placeholder="Schoolmail (@student.glu.nl)" class="input-field" autocomplete="email" required />

            <input v-model="password" type="password" placeholder="Wachtwoord" class="input-field" autocomplete="current-password" required />

            <p v-if="fout" class="fout">{{ fout }}</p>

            <button type="submit" class="login-button" :disabled="bezig">{{ bezig ? 'Bezig…' : 'Log in' }}</button>

            <p class="register-link">
                Nog geen account?
                <NuxtLink to="/nieuwaccount/student">Registreer</NuxtLink>
            </p>
        </div>
    </form>
</template>

<style scoped>
.login-leerling {
    font-family: Arial, sans-serif;
    width: 100vw;
    height: 95vh;

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

    margin-top: 70px;
}

.glulogo {
    width: 160px;
    position: absolute;
    top: 40px;
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

.register-link {
    margin-top: 18px;
    font-size: 14px;
    color: #444;
}

.register-link a {
    color: #FF9408;
    text-decoration: none;
    font-weight: 600;
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

    appearance: none;
    -webkit-appearance: none;
    -webkit-tap-highlight-color: transparent;
}

.login-button[disabled] {
    opacity: 0.7;
    cursor: wait;
}

.login-button:focus,
.login-button:active,
.login-button:focus-visible {
    background-color: #b76904 !important;
    outline: none !important;
    box-shadow: none !important;
}

button {
    outline: none !important;
}
</style>
