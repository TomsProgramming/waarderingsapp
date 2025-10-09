<script setup lang="ts">
import { ref, watch } from "vue";

const { fetchStudent } = useStudents();

const studentNumber = ref<number>();
const currStudent = ref();
const loading = ref(false);
const error = ref<string | null>(null);

let typingTimer: undefined | ReturnType<typeof setTimeout>;
const TYPE_INTERVAL = 500;

// Define events for parent component
const emit = defineEmits<{
  studentSelected: [student: any];
}>();

watch(studentNumber, () => {
  currStudent.value = undefined;
  error.value = null;

  clearTimeout(typingTimer);
  typingTimer = setTimeout(doneTyping, TYPE_INTERVAL);
});

async function submit() {
  if (!studentNumber.value || !currStudent.value) {
    error.value = "Voer een geldig studentnummer in";
    return;
  }

  // Emit the selected student to parent component
  emit("studentSelected", currStudent.value);
}

async function doneTyping() {
  if (!studentNumber.value) return;

  // Only search for students if the number has at least 3 digits
  // This prevents unnecessary API calls for incomplete inputs like "2"
  if (studentNumber.value.toString().length < 3) {
    currStudent.value = null;
    error.value = null;
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const student = await fetchStudent(studentNumber.value);
    currStudent.value = student;
  } catch (err: any) {
    currStudent.value = null;
    error.value = "Student niet gevonden. Controleer je studentnummer.";
    console.error("Error fetching student:", err);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="student-form-page">
    <!-- Header -->
    <header class="student-form-header">
      <button @click="navigateTo('/')" class="back-button" aria-label="Terug">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 18L9 12L15 6"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      <h1 class="header-title">STUDENT LOGIN</h1>
      <div class="header-spacer"></div>
    </header>

    <!-- Main Content -->
    <div class="student-form-content">
      <div class="login-form-container">
        <form class="login-form" @submit.prevent="submit">
          <h2 class="form-question">Wie ben jij?</h2>

          <div class="input-section">
            <label class="input-label">Studentnummer</label>
            <input
              class="student-input"
              v-model="studentNumber"
              type="number"
              name="student"
              id="student"
              placeholder="Voer je studentnummer in..."
            />
          </div>

          <!-- Loading indicator -->
          <div v-if="loading" class="loading-section">
            <div class="spinner"></div>
            <p class="loading-text">Student zoeken...</p>
          </div>

          <!-- Student confirmation -->
          <div v-if="currStudent && !loading" class="confirmation-section">
            <p class="confirmation-text">
              Ben jij <strong>{{ currStudent.name }}</strong
              >?
            </p>
          </div>

          <!-- Hint for short student numbers -->
          <div
            v-if="
              studentNumber && studentNumber.toString().length < 3 && !loading
            "
            class="hint-section"
          >
            <p class="hint-text">Voer minimaal 3 cijfers in om te zoeken...</p>
          </div>

          <!-- Error message -->
          <div v-if="error && !loading" class="error-section">
            <p class="error-text">{{ error }}</p>
          </div>

          <button
            class="submit-button"
            type="submit"
            :disabled="!studentNumber || loading || !currStudent"
          >
            <span v-if="loading">Zoeken...</span>
            <span v-else>Inloggen</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.student-form-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.student-form-header {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  background: rgba(0, 0, 0, 0.1);
}

.back-button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.header-title {
  flex: 1;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color: white;
  margin: 0;
  letter-spacing: 1px;
}

.header-spacer {
  width: 40px;
}

.student-form-content {
  padding: 24px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 70px);
}

.login-form-container {
  background: white;
  border-radius: 12px;
  padding: 32px 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-question {
  font-size: 18px;
  color: #374151;
  margin: 0;
  font-weight: 500;
  text-align: center;
}

.input-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.student-input {
  width: 100%;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  font-family: inherit;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.student-input:focus {
  outline: none;
  border-color: #f97316;
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
}

.confirmation-section {
  background: #f0f9ff;
  border: 1px solid #0ea5e9;
  border-radius: 8px;
  padding: 16px;
}

.confirmation-text {
  font-size: 14px;
  color: #0c4a6e;
  margin: 0;
  text-align: center;
}

.submit-button {
  background: #f97316;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-button:hover:not(:disabled) {
  background: #ea580c;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.submit-button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.loading-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 16px;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #e5e7eb;
  border-top-color: #f97316;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.hint-section {
  background: #fefbf3;
  border: 1px solid #fbbf24;
  border-radius: 8px;
  padding: 16px;
}

.hint-text {
  font-size: 14px;
  color: #92400e;
  margin: 0;
  text-align: center;
}

.error-section {
  background: #fef2f2;
  border: 1px solid #fca5a5;
  border-radius: 8px;
  padding: 16px;
}

.error-text {
  font-size: 14px;
  color: #dc2626;
  margin: 0;
  text-align: center;
}

/* Mobile responsiveness */
@media (max-width: 480px) {
  .student-form-content {
    padding: 16px;
  }

  .login-form-container {
    padding: 24px 16px;
  }

  .form-question {
    font-size: 16px;
  }
}
</style>
