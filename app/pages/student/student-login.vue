<template>
    <div class="login-leerling">
        <div id="logo-box">
            <img src="/img/glulogo.png" class="glulogo" />
        </div>

        <div class="login-box">

            <input type="email" placeholder="Docenten mail" class="input-field" />

            <input type="password" placeholder="Wachtwoord" class="input-field" />

            <div class="remember">
                <input type="checkbox" id="remember">
                <label for="remember">Onthoud mij</label>
            </div>

            <button class="login-button">Log in</button>
        </div>
    </div>
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

.remember {
    display: flex;
    align-items: center;

    width: 100%;

    margin-bottom: 30px;

    font-size: 14px;
}

.remember input {
    margin-right: 8px;
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