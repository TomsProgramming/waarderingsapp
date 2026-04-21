<script setup>
const { login } = useAuth()

const email = ref('')
const password = ref('')
const fout = ref('')
const bezig = ref(false)
const toonWachtwoord = ref(false)

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

            <div class="wachtwoord-veld">
                <input
                    v-model="password"
                    :type="toonWachtwoord ? 'text' : 'password'"
                    placeholder="Wachtwoord"
                    class="input-field wachtwoord-input"
                    autocomplete="current-password"
                    required
                />
                <button
                    type="button"
                    class="oogje"
                    :aria-label="toonWachtwoord ? 'Wachtwoord verbergen' : 'Wachtwoord tonen'"
                    :aria-pressed="toonWachtwoord"
                    @click="toonWachtwoord = !toonWachtwoord"
                >
                    <svg v-if="!toonWachtwoord" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M17.94 17.94A10.5 10.5 0 0 1 12 19c-6.5 0-10-7-10-7a18.5 18.5 0 0 1 4.22-5.19" />
                        <path d="M9.9 4.24A10.5 10.5 0 0 1 12 4c6.5 0 10 7 10 7a18.6 18.6 0 0 1-2.16 3.19" />
                        <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                        <line x1="2" y1="2" x2="22" y2="22" />
                    </svg>
                </button>
            </div>

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

.wachtwoord-veld {
    position: relative;
    width: 100%;
}

.wachtwoord-input {
    padding-right: 34px;
}

.oogje {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 25px;

    display: flex;
    align-items: center;
    justify-content: center;

    width: 34px;

    background: transparent;
    border: none;
    padding: 0;

    color: #999;
    cursor: pointer;

    transition: color 0.15s ease;

    -webkit-tap-highlight-color: transparent;
}

.oogje:hover,
.oogje[aria-pressed="true"] {
    color: #FF9408;
}

.oogje:focus,
.oogje:focus-visible {
    outline: none;
    color: #FF9408;
}

.oogje svg {
    width: 20px;
    height: 20px;
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
