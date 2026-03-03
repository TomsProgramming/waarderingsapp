<template>
    <div id="beginscherm">
        <div id="logo-box">
            <img src="/img/bureau-logo.png" id="bureau-logo">
        </div>

        <div id="title-box">
            <p>De plek voor <br>creatievelingen.</p>
        </div>

        <div id="inlog-box">
            <P>Hoe wil je inloggen?</P>

            <div class="keuzen-knoppen-box">
                <button class="keuzen-knop">Student</button>
                <button class="keuzen-knop">Docent</button>
                <button class="keuzen-knop">Nieuw account</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
#beginscherm {
    position: fixed;
    inset: 0;

    background-image: linear-gradient(rgba(0, 0, 0, 0.45),
            rgba(0, 0, 0, 0.45)), url(/img/beginscherm-achtergrond.png);

    background-size: cover;
    background-position: center;

    display: flex;
    flex-direction: column;
}

#bureau-logo {
    width: 120px;
    height: max-content;
}

#logo-box {
    width: 100%;
    display: flex;
    justify-content: flex-end;
}

#title-box {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: -58px;
}

#title-box p {
    color: white;
    font-family: "Inter", sans-serif;
    font-size: 45px;
    text-shadow: 0px 3px 6px rgba(0, 0, 0, 0.74902);
}


#inlog-box {
    width: 100%;
    margin-top: 170px;
}

#inlog-box p {
    margin: 0 0 14px 0;
    font-size: 20px;
    font-weight: 700;
    text-align: center;

    color: white;
    font-family: "Inter", sans-serif;
}

.keuzen-knoppen-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
}

.keuzen-knop {
    width: 302px;
    height: 55px;

    border: none;
    border-radius: 999px;
    background: #fff;
    color: #222;

    font-family: "Inter", sans-serif;
    font-size: 15px;
    font-weight: 500;

    box-shadow: 0 10px 18px rgba(0, 0, 0, 0.22);
}

.keuzen-knop:hover {
    box-shadow: 0 12px 22px rgba(0, 0, 0, 0.28);
}

.keuzen-knop:active {
    transform: scale(0.99);
}
</style>