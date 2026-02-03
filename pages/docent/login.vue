<script setup>
const { loginDocent } = useDocenten();

async function handleSubmit(event) {
    const formData = new FormData(event.target)

    const username = formData.get("username");
    const password = formData.get("password");

    try {
        await loginDocent(username, password);
        // Redirect or show success message
        console.log("Login successful");
    } catch (error) {
        console.error("Login failed:", error);
        // Show error message to user
    }
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