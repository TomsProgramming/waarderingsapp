<script setup>
import NavigatieBalk from '~/components/NavigatieBalk.vue'
</script>

<template>
    <div class="dashboard-docenten">

        <div class="header">
            <h1>DASHBOARD</h1>

            <div class="search-bar">
                <span class="search-icon"></span>
                <input type="text" placeholder="Zoek naar student" />
            </div>
        </div>

        <div class="body">
            <h2>STUDENTEN</h2>
            <div class="student-cards">
                <div class="student-card">
                    <img src="/img/glulogo.png" class="student-photo" />

                    <div class="student-info">
                        <h3>Mariska Rooth</h3>
                        <p>Webdesign</p>
                        <span>402974</span>
                    </div>
                </div>
                <div class="student-card">
                    <img src="/img/glulogo.png" class="student-photo" />

                    <div class="student-info">
                        <h3>Mariska Rooth</h3>
                        <p>Webdesign</p>
                        <span>402974</span>
                    </div>
                </div>
                <div class="student-card">
                    <img src="/img/glulogo.png" class="student-photo" />

                    <div class="student-info">
                        <h3>Mariska Rooth</h3>
                        <p>Webdesign</p>
                        <span>402974</span>
                    </div>
                </div>
                <div class="student-card">
                    <img src="/img/glulogo.png" class="student-photo" />

                    <div class="student-info">
                        <h3>Mariska Rooth</h3>
                        <p>Webdesign</p>
                        <span>402974</span>
                    </div>
                </div>
                <div class="student-card">
                    <img src="/img/glulogo.png" class="student-photo" />

                    <div class="student-info">
                        <h3>Mariska Rooth</h3>
                        <p>Webdesign</p>
                        <span>402974</span>
                    </div>
                </div>
                <div class="student-card">
                    <img src="/img/glulogo.png" class="student-photo" />

                    <div class="student-info">
                        <h3>Mariska Rooth</h3>
                        <p>Webdesign</p>
                        <span>402974</span>
                    </div>
                </div>
                <div class="student-card">
                    <img src="/img/glulogo.png" class="student-photo" />

                    <div class="student-info">
                        <h3>Mariska Rooth</h3>
                        <p>Webdesign</p>
                        <span>402974</span>
                    </div>
                </div>
                <div class="student-card">
                    <img src="/img/glulogo.png" class="student-photo" />

                    <div class="student-info">
                        <h3>Mariska Rooth</h3>
                        <p>Webdesign</p>
                        <span>402974</span>
                    </div>
                </div>
                <div class="student-card">
                    <img src="/img/glulogo.png" class="student-photo" />

                    <div class="student-info">
                        <h3>Mariska Rooth</h3>
                        <p>Webdesign</p>
                        <span>402974</span>
                    </div>
                </div>
            </div>

        </div>

        <div class="footer">
            <NavigatieBalk />
        </div>
    </div>
</template>

<style scoped>
.dashboard-docenten {
    display: flex;
    flex-direction: column;

    background-color: #39c58d;

    height: 100vh;
    width: 100vw;

    font-family: Arial, sans-serif;
    overflow: hidden;
}

/* header */
.header {
    height: 180px;
    padding: 30px 25px;
    color: white;
}

.header h1 {
    font-weight: 300;
    font-size: 22px;
}

.search-bar {
    margin-top: 20px;
    background-color: #ffffff;
    border-radius: 25px;
    padding: 10px 15px;
    display: flex;
    align-items: center;
}

.search-bar input {
    border: none;
    outline: none;
    background: transparent;
    margin-left: 10px;
    font-size: 14px;
    width: 100%;
    font-weight: 400;
}

.search-icon {
    font-size: 16px;
    opacity: 0.6;
}

/* einde header */

/* body */
.body {
    flex: 1;
    background-color: #f4f4f4;
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
    padding: 25px;
    margin-top: -40px;
    overflow-y: auto;
}

.body h2 {
    font-weight: 400;
    font-size: 20px;
}

.student-cards {
    display: flex;
    flex-direction: column;

    overflow-y: auto;

    flex: 1;

    margin-top: 20px;
    gap: 10px;
    padding-bottom: 20px;
}

.student-card {
    display: flex;
    align-items: center;

    width: 100%;
    max-width: 435px;
    height: 98px;

    background-color: #3fcf9a;

    border-radius: 25px;
    padding: 5px 10px;
    gap: 20px;
}

/* Profielfoto */
.student-photo {
    object-fit: cover;

    width: 70px;
    height: 70px;

    border-radius: 50%;
}

/* Tekst */
.student-info h3 {
    margin: 0;
    font-size: 20px;
    font-weight: 400;
    color: black;
}

.student-info p {
    margin: 5px 0 0 0;
    font-size: 18px;
    color: black;
}

.student-info span {
    font-size: 18px;
    color: black;
}

.glulogo {
    width: 120px;
}

/* einde body */

/* footer */
.footer {
    background-color: #f4f4f4;
}
</style>