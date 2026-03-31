<template>
    <div class="login-docenten">

        <img src="/img/glulogo.png" class="glulogo" />
        <div class="login-box">

            <input type="volledige naam" placeholder="Uw volledige naam" class="input-field" />
            <input type="uw afkorting" placeholder="Uw afkorting" class="input-field" />
            <input type="School E-mail" placeholder="School E-mail" class="input-field" />
            <input type="password" placeholder="Wachtwoord" class="input-field" />
            <input type="password" placeholder="Herhaal wachtwoord" class="input-field" />

            <button class="login-button">Aanmelden</button>
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

/* .remember {
    display: flex;
    align-items: center;

    width: 100%;

    margin-bottom: 30px;

    font-size: 14px;
}

.remember input {
    margin-right: 8px;
} */

.login-button {
    width: 100%;
    background-color: #39c58d;
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

.login-button:focus,
.login-button:active,
.login-button:focus-visible {
    background-color: #39c58d !important;
    outline: none !important;
    box-shadow: none !important;
}

button {
    outline: none !important;
}
</style>