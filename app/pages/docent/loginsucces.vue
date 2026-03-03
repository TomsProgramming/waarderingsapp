<template>
    <div id="achtergrond-inlogsucces">
        <div id="logo-box">
            <img src="/img/bureau-logo.png" id="bureau-logo">
        </div>
        <div id="tekst-box">
            <p>You did it,</p>
            <p>you're in.</p>
        </div>
    </div>
</template>

<style scoped>
#achtergrond-inlogsucces {
    position: fixed;
    inset: 0;
    height: 100%;

    background-color: #39c58d;

    display: flex;
    align-items: center;
    flex-direction: column;
}

#logo-box {
    padding-top: 35vw;
}

#bureau-logo {
    width: 250px;
    height: max-content;
}

#tekst-box {
    color: white;
    font-family: "Inter", sans-serif;
    font-size: 40px;
    line-height: 10px;
    padding-top: 40px;
}
</style>