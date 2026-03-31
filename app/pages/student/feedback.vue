<script setup>
import NavigatieBalk from '~/components/NavigatieBalk.vue'
</script>

<template>
    <div id="achtergrond-feedback">
        <p id="feedback-tekst">FEEDBACK</p>
        <p id="leerling-naam-tekst">Naam leerling</p>
        <div id="feedback-witte-vlak">
            <div class="feedback-box">
                <div class="namen-box">
                    <p class="project-naam-tekst">Project naam</p>
                    <p class="Naam-klant">klant naam</p>
                </div>

                <div class="tekst-box">
                    <p class="mening-project">Lorem Ipsum is simply dummy text of the
                        printing and typesetting industry. Lorem Ipsum
                        has been the industry's standard dummy text
                        ever since the 1500s</p>
                </div>
            </div>

            <div class="feedback-box">
                <div class="namen-box">
                    <p class="project-naam-tekst">Project naam</p>
                    <p class="Naam-klant">klant naam</p>
                </div>

                <div class="tekst-box">
                    <p class="mening-project">Lorem Ipsum is simply dummy text of the
                        printing and typesetting industry. Lorem Ipsum
                        has been the industry's standard dummy text
                        ever since the 1500s</p>
                </div>
            </div>
        </div>

        <div class="footer">
            <NavigatieBalk />
        </div>
    </div>
</template>

<style scoped>
#achtergrond-feedback {
    position: fixed;
    inset: 0;
    height: 100%;

    background-color: #FF9408;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
}

#feedback-tekst {
    margin: 60px 0 0 40px;
    font-size: 24px;
    font-weight: bold;
    color: white;
}

#leerling-naam-tekst {
    margin: 5px 0 0 40px;
    font-size: 16px;
    color: white;
}

#feedback-witte-vlak {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 141px;

    background: #FFFFFF;
    border-radius: 20px 20px 0px 0px;
    padding: 15px 25px;

    justify-content: center;
    align-items: flex-start;
    flex-wrap: wrap;
    align-content: flex-start;
}

.namen-box {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    height: 30px;
}

.feedback-box {
    width: 100%;
    min-height: 125px;
    height: auto;
    padding: 0px 10px;
    margin-bottom: 20px;

    background-color: #F5F6F7;
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.4);
    border-radius: 7px;
    font-family: 'Inter', sans-serif;
}

.footer {
    position: fixed;
    width: 100%;
    height: 66px;
    bottom: 0;
}
</style>