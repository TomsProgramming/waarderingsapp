<script setup>
import NavigatieBalk from '~/components/NavigatieBalk.vue'

const naam = "JORDEN GIELEN"
const rol = "Web dev"
</script>

<template>
    <div class="pagina">

        <div class="header">
            <h1>PROFIEL</h1>
            <h2>Student</h2>
        </div>
        <div class="oranje-vlak">
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

                <div class="thema-blok">
                    <p>THEMA</p>

                    <div class="thema-opties">
                        <div class="kleur oranje"></div>
                        <div class="kleur wit"></div>
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
    color: #FF9408;
    font-size: 18px;
    margin: 0;
}

.header h2 {
    color: #FF9408;
    font-size: 14px;
    margin: 0;
}

.oranje-vlak {
    flex: 1;
    background: #FF9408;
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
    padding-top: 10px;
}

/* Body inhoud */
.body {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;

    font-family: "Inter", sans-serif;
}

.profielfoto img {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid rgba(255, 255, 255, 0.4);
}

.info-blok {
    width: 220px;
    padding: 12px;
    text-align: center;
    background-color: rgba(146, 99, 7, 0.4);
    border-radius: 8px;
    color: white;
    font-weight: 500;
    letter-spacing: 1px;
}

.thema-blok {
    width: 220px;
    padding-bottom: 15px;
    background-color: rgba(146, 99, 7, 0.4);
    border-radius: 8px;
    text-align: center;
    color: white;
}

.thema-blok p {
    margin-bottom: 15px;
    font-size: 12px;
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
}

.oranje {
    background-color: orange;
}

.wit {
    background-color: #3ccf91;
    border: 2px solid white;
}

.QRcode {
    width: 220px;
    padding: 0px 12px 12px 12px;
    text-align: center;
    background-color: rgba(146, 99, 7, 0.4);
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
    color: #FF9408;
    font-size: 15px;
}

.uitloggen {
    width: 220px;
    padding: 12px;
    border: none;
    border-radius: 10px;
    background-color: rgba(146, 99, 7, 0.4);
    color: white;
    font-weight: bold;
    letter-spacing: 1px;
    cursor: pointer;
}

.uitloggen:hover {
    opacity: 0.9;
}

.footer {
    background-color: #f2f2f2;
    font-family: "Inter", sans-serif;
}
</style>