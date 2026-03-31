<template>
    <div class="login-docenten">

        <img src="/img/glulogo.png" class="glulogo" />


        <div id="loginsuccesbox">
            <div id="cirkel">✓</div>

            <div id="tekst-box">
                <h3>Bedankt voor uw aanmelding!</h3>
                <p>We controleren uw gegevens.</p>
                <p>Zodra uw account is goedgekeurd,</p>
                <p>kunt u inloggen.</p>
            </div>
        </div>

    </div>
</template>

<style scoped>
.login-docenten {
    background-image: url('/img/achtergrond-loginpagina.png');
    background-size: cover;
    background-position: center;

    font-family: Arial, sans-serif;

    width: 100vw;
    height: 95vh;

    display: flex;
    justify-content: center;
    align-items: center;
}

#loginsuccesbox{
    display: flex;
    flex-direction: column;
    align-items: center;
}

.login-box {
    display: flex;
    flex-direction: column;
    align-items: center;

    width: 280px;

    margin-top: 235px;
}

.glulogo {
    width: 120px;

    position: absolute;
    top: 40px;
}

#cirkel {
    width: 120px;
    height: 120px;
    border-radius: 60px;
    background-color: #38DDA1;
    margin-top: 115px;

    display: flex;
    justify-content: center;
    align-items: center;

    font-size: 60px;
    color: white;
    font-weight: bold;
}

#tekst-box {
    display: flex;
    color: rgb(0, 0, 0);
    font-family: "Inter", sans-serif;
    font-size: 21px;

    line-height: 1;

    padding-top: 40px;
    flex-direction: column;
    align-items: center;
}

#tekst-box p {
    margin: 0;
}
</style>