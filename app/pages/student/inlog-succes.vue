<template>
    <div id="achtergrond-inlogsucces">
        <div id="logo-box">
            <img src="/img/bureau-logo.png" id="bureau-logo">
        </div>
        <div id="tekst-box">
            <p>You did it,</p>
            <p>your in.</p>
        </div>
    </div>
</template>

<style scoped>
#achtergrond-inlogsucces {
    position: fixed;
    inset: 0;
    height: 100%;

    background-color: #FF9408;

    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
}

#logo-box {
    display: flex;
    justify-content: flex-end;
}

#bureau-logo {
    width: 250px;
    height: max-content;
}

#tekst-box {
    color: white;
    font-family: "Inter", sans-serif;
    font-size: 40px;
    text-shadow: 0px 3px 6px rgba(0, 0, 0, 0.74902);
}
</style>