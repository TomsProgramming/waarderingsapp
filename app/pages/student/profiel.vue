<script setup>
import NavigatieBalk from '~/components/NavigatieBalk.vue'

const naam = "JORDEN GIELEN"
const rol = "STUDENT"

const { themaKleur, themaKleurDonker } = useThema()
</script>

<template>
    <div class="pagina">

        <div class="header">
            <h1>PROFIEL</h1>
            <h2>STUDENT</h2>
        </div>
        <div class="groen-vlak">
            <div class="body">

                <div class="profielfoto">
                    <img src="/img/glulogo.png" alt="Profielfoto" />
                </div>

                <div class="info-blok">
                    {{ naam }}
                </div>

                <div class="info-blok">
                    {{ rol }}
                </div>

                <div class="info-blok">
                    204356
                </div>


                <div id="thema-blok-outline">
                    <div class="thema-blok">
                        <p>THEMA</p>

                        <div class="thema-opties">
                            <div class="kleur oranje" @click="themaKleur = '#FF9408'"></div>
                            <div class="kleur wit" @click="themaKleur = '#3ccf91'"></div>
                        </div>
                    </div>
                </div>

                <div class="QRcode">
                    <p>Net je klantgesprek gehad? Hier is de QR-code voor de beoordeling</p>
                    <button>Haal code op</button>
                </div>

                <button class="uitloggen">
                    UITLOGGEN
                </button>

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

/* Header */
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

/* GROENE CONTAINER */
.groen-vlak {
    flex: 1;
    display: flex;

    background: linear-gradient(180deg, v-bind(themaKleur), v-bind(themaKleur));

    border-top-left-radius: 30px;
    border-top-right-radius: 30px;

    padding-top: 40px;
}

/* Body inhoud */
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
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

.oranje {
    background-color: orange;
}

.wit {
    background-color: #3ccf91;
}

.QRcode {
    width: 220px;
    padding: 0px 12px 12px 12px;
    text-align: center;
    background-color: v-bind(themaKleurDonker);
    border-radius: 8px;
    color: white;
    font-weight: 500;
}

.QRcode button {
    height: 45px;
    width: 130px;
    border-radius: 30px;
    border: 0;
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.4);
    color: v-bind(themaKleur);
    font-size: 15px;
}

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

.uitloggen:hover {
    opacity: 0.9;
}

.footer {
    background-color: #f2f2f2;
    font-family: "Inter", sans-serif;
}
</style>