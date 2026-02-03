<script setup>
function handleSubmit(event) {
    const formData = new FormData(event.target)

    console.log('Username:', formData.get('username'))
    console.log('Password:', formData.get('password'))
}
</script>
<template>
    <div>
        <form @submit.prevent="handleSubmit">
            <label for="username">Username</label><br>
            <input type="text" id="username" name="username" /><br>
            <label for="password">Password</label><br>
            <input type="password" id="password" name="password" /><br>
            <button type="submit">Login</button>
        </form>
    </div>
</template>