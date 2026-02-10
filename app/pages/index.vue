<template>
    <div id="beginscherm">
        <h1>De plek voor <br>creatievelingen.</h1>
        
        <img src="/img/bureau-logo.png" id="bureau-logo">

        <div id="inlog-box">
        <h2>Hoe wil je inloggen?</h2>

        <div class="keuzen-knoppen-box">
            <button class="keuzen-knop">Student</button>
            <button class="keuzen-knop">Docent</button>
            <button class="keuzen-knop">Nieuw account</button>
        </div>
        </div>
    </div>
</template>

<style scoped>
    #beginscherm{
        background-image: linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('/img/beginscherm-achtergrond.png');
        background-size: cover;
        background-position: center;

        display: flex;
        justify-content: center;

        width: 100vw;
        height: 100vh;
    }

    #bureau-logo{
        width: 120px;
        height: max-content;
    }

    h1 {
        color: white;
        font-family: "Inter", sans-serif;
    }

    #inlog-box {
        width: min(320px, 92vw);
        margin-top: 10px;
    }

    #inlog-box h2 {
        margin: 0 0 14px 0;
        font-size: 20px;
        font-weight: 700;

        color: white;
        font-family: "Inter", sans-serif;
    }

    .keuzen-knoppen-box {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .keuzen-knop {
        width: 100%;
        height: 52px;

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