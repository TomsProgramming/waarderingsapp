<script setup>
const route = useRoute()
const { verify, resend } = useAuth()

const token = ref(String(route.query.token || ''))
const mode = ref(route.query.mode === 'login' ? 'login' : 'register')
const roleHint = ref(route.query.role === 'teacher' ? 'teacher' : 'student')

const code = ref('')
const fout = ref('')
const info = ref('')
const bezig = ref(false)
const cooldown = ref(30)
let cooldownTimer = null

const accentKleur = computed(() => (roleHint.value === 'teacher' ? '#39c58d' : '#FF9408'))

onMounted(() => {
    if (!token.value) {
        fout.value = 'Geen verificatie-sessie gevonden. Begin opnieuw.'
    }
    startCooldown()
})
onBeforeUnmount(() => {
    if (cooldownTimer) clearInterval(cooldownTimer)
})

function startCooldown() {
    cooldown.value = 30
    if (cooldownTimer) clearInterval(cooldownTimer)
    cooldownTimer = setInterval(() => {
        cooldown.value = Math.max(0, cooldown.value - 1)
        if (cooldown.value === 0 && cooldownTimer) {
            clearInterval(cooldownTimer)
            cooldownTimer = null
        }
    }, 1000)
}

function onCodeInput(e) {
    const digitsOnly = String(e.target.value || '').replace(/\D/g, '').slice(0, 6)
    code.value = digitsOnly
    e.target.value = digitsOnly
}

async function onSubmit() {
    fout.value = ''
    info.value = ''
    if (!/^\d{6}$/.test(code.value)) {
        fout.value = 'Voer de 6-cijferige code in'
        return
    }
    if (!token.value) return

    bezig.value = true
    try {
        const role = await verify(token.value, code.value, mode.value)
        await navigateTo(role === 'teacher' ? '/docent' : '/student')
    } catch (err) {
        fout.value = err?.statusMessage || err?.data?.statusMessage || 'Verificatie mislukt'
    } finally {
        bezig.value = false
    }
}

async function onResend() {
    if (cooldown.value > 0 || !token.value) return
    fout.value = ''
    info.value = ''
    try {
        await resend(token.value, mode.value)
        info.value = 'Nieuwe code verstuurd. Controleer je inbox.'
        startCooldown()
    } catch (err) {
        fout.value = err?.statusMessage || err?.data?.statusMessage || 'Opnieuw versturen mislukt'
    }
}
</script>

<template>
    <main class="verify-page">
        <div class="kaart">
            <h1 class="titel">Bevestig je {{ mode === 'register' ? 'registratie' : 'inlog' }}</h1>
            <p class="uitleg">
                We hebben een 6-cijferige code naar je schoolmail gestuurd.<br>
                Vul hem hieronder in om {{ mode === 'register' ? 'je account af te ronden' : 'in te loggen' }}.
            </p>

            <form @submit.prevent="onSubmit">
                <input
                    type="text"
                    inputmode="numeric"
                    autocomplete="one-time-code"
                    maxlength="6"
                    class="code-input"
                    placeholder="• • • • • •"
                    :value="code"
                    @input="onCodeInput"
                    :style="{ '--accent': accentKleur }"
                    required
                />

                <p v-if="fout" class="fout">{{ fout }}</p>
                <p v-if="info" class="info">{{ info }}</p>

                <button
                    type="submit"
                    class="bevestig-knop"
                    :disabled="bezig || code.length !== 6"
                    :style="{ backgroundColor: accentKleur }"
                >
                    {{ bezig ? 'Bezig…' : 'Bevestig' }}
                </button>
            </form>

            <div class="resend">
                <button
                    type="button"
                    class="resend-knop"
                    :disabled="cooldown > 0"
                    @click="onResend"
                >
                    <span v-if="cooldown > 0">Opnieuw versturen ({{ cooldown }}s)</span>
                    <span v-else>Opnieuw versturen</span>
                </button>
            </div>

            <p class="hint">
                Code niet ontvangen? Check ook je spam-folder.<br>
                De code is 10 minuten geldig.
            </p>
        </div>
    </main>
</template>

<style scoped>
.verify-page {
    min-height: 100vh;
    width: 100vw;
    background-color: #f4f4f4;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    font-family: Arial, sans-serif;
}

.kaart {
    background: white;
    width: 100%;
    max-width: 420px;
    padding: 36px 28px;
    border-radius: 14px;
    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.06);
    text-align: center;
}

.titel {
    margin: 0 0 12px;
    font-size: 22px;
    color: #1a1a1a;
}

.uitleg {
    margin: 0 0 28px;
    color: #555;
    font-size: 14px;
    line-height: 1.5;
}

.code-input {
    width: 100%;
    padding: 18px 10px;
    font-size: 28px;
    letter-spacing: 10px;
    text-align: center;
    border: 2px solid #e0e0e0;
    border-radius: 10px;
    font-family: 'Courier New', monospace;
    outline: none;
    transition: border-color 0.15s ease;
}

.code-input:focus {
    border-color: var(--accent, #FF9408);
}

.fout {
    margin: 14px 0 0;
    color: #c4554b;
    font-size: 14px;
}

.info {
    margin: 14px 0 0;
    color: #2c7a3f;
    font-size: 14px;
}

.bevestig-knop {
    width: 100%;
    margin-top: 20px;
    padding: 13px;
    border: none;
    border-radius: 25px;
    color: white;
    font-size: 16px;
    cursor: pointer;
    transition: opacity 0.15s ease;
}

.bevestig-knop[disabled] {
    opacity: 0.55;
    cursor: not-allowed;
}

.resend {
    margin-top: 18px;
}

.resend-knop {
    background: none;
    border: none;
    color: #555;
    font-size: 14px;
    cursor: pointer;
    padding: 6px;
    text-decoration: underline;
}

.resend-knop[disabled] {
    color: #aaa;
    cursor: not-allowed;
    text-decoration: none;
}

.hint {
    margin: 24px 0 0;
    font-size: 12px;
    color: #888;
    line-height: 1.5;
}
</style>
