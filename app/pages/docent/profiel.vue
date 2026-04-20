<script setup>
import NavigatieBalk from '~/components/NavigatieBalk.vue'

const { user, logout } = useAuth()
const { themaKleur, themaKleurDonker, setKleur } = useDocentThema()

const volledigeNaam = computed(() =>
    user.value ? `${user.value.first_name} ${user.value.last_name}`.trim().toUpperCase() : ''
)
</script>

<template>
    <div class="pagina">

        <div class="header">
            <h1>PROFIEL</h1>
            <h2>DOCENT</h2>
        </div>
        <div class="groen-vlak">
            <div class="body">

                <div class="profielfoto">
                    <img :src="user?.profile_picture || '/img/glulogo.png'" alt="Profielfoto" />
                </div>

                <div class="info-blok">{{ volledigeNaam }}</div>
                <div class="info-blok">DOCENT</div>
                <div class="info-blok">{{ user?.abbreviation_teacher }}</div>

                <div id="thema-blok-outline">
                    <div class="thema-blok">
                        <p>THEMA</p>

                        <div class="thema-opties">
                            <div class="kleur groen" @click="setKleur('#39dea1')"></div>
                            <div class="kleur oranje" @click="setKleur('#FF9408')"></div>
                        </div>
                    </div>
                </div>

                <button class="uitloggen" @click="logout">UITLOGGEN</button>

            </div>
        </div>

        <div class="footer">
            <NavigatieBalk />
        </div>

    </div>
</template>

<style scoped>
.pagina {
    min-height: 100vh;
    background-color: #f2f2f2;
    display: flex;
    flex-direction: column;
}

.header {
    padding: 25px 20px;
    font-family: "Inter", sans-serif;
}

.header h1 {
    color: v-bind(themaKleurDonker);
    font-size: 22px;
    margin: 0;
}

.header h2 {
    color: v-bind(themaKleur);
    font-size: 17px;
    margin: 0;
}

.groen-vlak {
    flex: 1;
    display: flex;
    background: linear-gradient(180deg, v-bind(themaKleur), v-bind(themaKleur));
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
    padding-top: 40px;
}

.body {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    font-family: "Inter", sans-serif;
    min-height: 100%;
    width: 100%;
}

.profielfoto {
    display: flex;
    justify-content: center;
    width: 100%;
}

.profielfoto img {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: 4px solid rgba(255, 255, 255, 0.4);
    object-fit: cover;
}

.info-blok {
    width: 220px;
    padding: 14px;
    background-color: v-bind(themaKleurDonker);
    color: white;
    border-radius: 8px;
    letter-spacing: 1px;
    text-align: center;
    font-size: 20px;
}

.info-blok,
.thema-blok {
    margin-left: auto;
    margin-right: auto;
}

#thema-blok-outline {
    display: flex;
    justify-content: center;
}

.thema-blok {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    width: 220px;
    padding: 15px;
    background-color: v-bind(themaKleurDonker);
    border-radius: 8px;
    text-align: center;
    color: white;
}

.thema-blok p {
    margin-bottom: 15px;
    font-size: 19px;
    letter-spacing: 2px;
}

.thema-opties {
    display: flex;
    justify-content: center;
    gap: 15px;
}

.kleur {
    width: 25px;
    height: 25px;
    border-radius: 8px;
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.kleur:hover {
    transform: scale(1.15);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.groen { background-color: #39dea1; }
.oranje { background-color: #FF9408; }

.uitloggen {
    width: 220px;
    margin-top: auto;
    margin-bottom: 20px;
    padding: 12px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    background-color: v-bind(themaKleurDonker);
    color: white;
    font-weight: lighter;
    letter-spacing: 2px;
    font-size: 19px;
}

.uitloggen:hover { opacity: 0.9; }

.footer {
    background-color: #f2f2f2;
    font-family: "Inter", sans-serif;
}
</style>
