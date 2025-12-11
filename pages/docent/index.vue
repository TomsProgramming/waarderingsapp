<script setup>
import DocentForm from "~/components/DocentForm.vue";
import NumberInput from "~/components/NumberInput.vue";
import PencilIcon from "~/components/icons/PencilIcon.vue";

const {
  students,
  loading,
  error,
  fetchStudents,
  fetchStudent,
  fetchStudentSkills,
  updateStudentSkill,
} = useStudents();

// Fetch students when component mounts
onMounted(async () => {
  try {
    await fetchStudents();
  } catch (err) {
    console.error("Error loading students:", err);
  }
});

const ws = new WebSocket("ws://localhost:3000/_ws");

ws.addEventListener("open", () => {
  console.log("test");
});

ws.addEventListener("message", (event) => {
  console.log(event);
});

const edit = ref(false);
const editLoading = ref(false);
let currStudent = reactive({
  id: null,
  name: "",
  skills: [],
});

async function setSkill(i, level) {
  if (!currStudent.id || !currStudent.skills[i]) return;

  try {
    await updateStudentSkill(currStudent.id, currStudent.skills[i].id, level);
    currStudent.skills[i].level = level;
    currStudent.skills[i].assessedAt = new Date().toISOString();
  } catch (err) {
    console.error("Error updating skill:", err);
  }
}

async function editStudent(studentId) {
  edit.value = true;
  editLoading.value = true;

  try {
    const student = await fetchStudent(studentId);
    const skills = await fetchStudentSkills(studentId);

    currStudent.id = student.id;
    currStudent.name = student.name;
    currStudent.skills = skills;

    ws.send({ type: "get", number: student.studentNumber });
  } catch (err) {
    console.error("Error loading student for editing:", err);
  } finally {
    editLoading.value = false;
  }
}
</script>

<template>
  <div class="docent-page">
    <!-- <DocentForm /> -->

    <div class="fade-in">
      <!-- Header -->
      <header class="docent-header">
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
        <h1 class="header-title">DOCENT DASHBOARD</h1>
        <div class="header-spacer"></div>
      </header>

      <!-- Main Content -->
      <div class="docent-content">
        <div class="main-container">
          <div class="content-slider" :class="{ 'show-edit': edit }">
            <!-- Student List View -->
            <div class="student-list-section">
              <div class="search-section">
                <h2 class="section-title">Studenten Beheer</h2>
                <div class="search-input-container">
                  <input
                    class="search-input"
                    type="text"
                    placeholder="Zoek student..."
                  />
                </div>
              </div>

              <!-- Loading State -->
              <div v-if="loading" class="text-center py-8">
                <div
                  class="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto"
                ></div>
                <p class="mt-4 text-white">Students aan het laden...</p>
              </div>

              <!-- Error State -->
              <div v-else-if="error" class="text-center py-8">
                <div class="text-white text-4xl mb-4">⚠️</div>
                <p class="text-white text-lg">{{ error }}</p>
                <button
                  @click="fetchStudents()"
                  class="mt-4 px-4 py-2 bg-white text-orange-500 rounded-lg hover:bg-gray-100"
                >
                  Opnieuw proberen
                </button>
              </div>

              <!-- Students Grid -->
              <div v-else class="students-grid">
                <div
                  v-for="student in students"
                  :key="student.id"
                  class="student-card"
                >
                  <div class="student-info">
                    <h3 class="student-name">{{ student.name }}</h3>
                    <p class="student-number">{{ student.studentNumber }}</p>
                  </div>
                  <div class="student-actions">
                    <button
                      @click="
                        navigateTo(
                          `/review?studentId=${student.id}&reviewerType=docent`
                        )
                      "
                      class="review-button"
                      aria-label="Review student"
                      title="Review afgeven"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11 5H6C4.89543 5 4 5.89543 4 7V18C4 19.1046 4.89543 20 6 20H17C18.1046 20 19 19.1046 19 18V13M17.5858 3.58579C18.3668 2.80474 19.6332 2.80474 20.4142 3.58579C21.1953 4.36683 21.1953 5.63316 20.4142 6.41421L11.8284 15H9L9 12.1716L17.5858 3.58579Z"
                          stroke="white"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </button>
                    <button
                      @click="editStudent(student.id)"
                      class="edit-button"
                      aria-label="Bewerk student"
                      title="Vaardigheden beoordelen"
                    >
                      <PencilIcon class="edit-icon" />
                    </button>
                  </div>
                </div>

                <!-- No students found -->
                <div
                  v-if="students.length === 0"
                  class="col-span-full text-center py-8"
                >
                  <p class="text-white">Geen studenten gevonden</p>
                </div>
              </div>
            </div>

            <!-- Student Edit View -->
            <div class="student-edit-section">
              <div class="edit-header">
                <button @click="edit = false" class="back-to-list-button">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15 18L9 12L15 6"
                      stroke="#374151"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
                <h2 class="edit-title">{{ currStudent.name }}</h2>
              </div>

              <div class="skills-container">
                <!-- Loading State -->
                <div v-if="editLoading" class="text-center py-8">
                  <div
                    class="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto"
                  ></div>
                  <p class="mt-4 text-gray-600">Student gegevens laden...</p>
                </div>

                <!-- Skills List -->
                <div v-else>
                  <div
                    v-for="(skill, i) in currStudent.skills"
                    :key="skill.id"
                    class="skill-item"
                  >
                    <h3 class="skill-title">{{ skill.name }}</h3>
                    <p v-if="skill.description" class="skill-description">
                      {{ skill.description }}
                    </p>
                    <div class="skill-input-wrapper">
                      <NumberInput
                        :length="10"
                        :value="skill.level || 0"
                        @change="(e) => setSkill(i, e)"
                      />
                    </div>
                    <p v-if="skill.assessedAt" class="skill-assessed">
                      Laatst beoordeeld:
                      {{
                        new Date(skill.assessedAt).toLocaleDateString("nl-NL")
                      }}
                    </p>
                  </div>

                  <!-- No skills found -->
                  <div
                    v-if="currStudent.skills.length === 0"
                    class="text-center py-8"
                  >
                    <p class="text-gray-600">
                      Geen vaardigheden gevonden voor deze student
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.docent-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.docent-header {
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

.docent-content {
  padding: 24px 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: calc(100vh - 70px);
}

.main-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  height: 600px;
  overflow: hidden;
}

.content-slider {
  display: flex;
  width: 200%;
  height: 100%;
  transition: transform 0.3s ease-in-out;
}

.content-slider.show-edit {
  transform: translateX(-50%);
}

.student-list-section,
.student-edit-section {
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 24px;
}

.search-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 16px 0;
  text-align: center;
}

.search-input-container {
  margin-top: 8px;
}

.search-input {
  width: 100%;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  font-family: inherit;
  box-sizing: border-box;
}

.search-input:focus {
  outline: none;
  border-color: #f97316;
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
}

.students-grid {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.student-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.student-card:hover {
  border-color: #f97316;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.student-info {
  flex: 1;
}

.student-name {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 4px 0;
}

.student-number {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}

.student-actions {
  display: flex;
  gap: 8px;
}

.review-button {
  background: #3b82f6;
  border: none;
  border-radius: 6px;
  padding: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.review-button:hover {
  background: #2563eb;
}

.edit-button {
  background: #10b981;
  border: none;
  border-radius: 6px;
  padding: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.edit-button:hover {
  background: #059669;
}

.edit-icon {
  width: 16px;
  height: 16px;
  fill: white;
}

.student-edit-section {
  padding: 24px;
}

.edit-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.back-to-list-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  margin-right: 12px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.back-to-list-button:hover {
  background: #f3f4f6;
}

.edit-title {
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin: 0;
  text-align: center;
  flex: 1;
}

.skills-container {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skill-item {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
}

.skill-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 12px 0;
  text-align: center;
}

.skill-input-wrapper {
  display: flex;
  justify-content: center;
}

.fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .main-container {
    max-width: 100%;
    height: 70vh;
  }

  .docent-content {
    padding: 16px;
  }

  .student-list-section,
  .student-edit-section {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .section-title,
  .edit-title {
    font-size: 16px;
  }

  .student-name {
    font-size: 13px;
  }

  .skill-title {
    font-size: 13px;
  }
}
</style>
