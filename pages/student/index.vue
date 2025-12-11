<script setup lang="ts">
import StudentForm from "~/components/StudentForm.vue";
import { Chart } from "chart.js/auto";

const { fetchStudentSkills, fetchStudentReviews } = useStudents();

const ws = new WebSocket("ws://localhost:3000/_ws");

const chart = ref<HTMLCanvasElement>();
const currStudent = ref<any>(null);
const studentSkills = ref<any[]>([]);
const studentReviews = ref<any[]>([]);
const loading = ref(false);

let data = {
  labels: ["Stylen", "Front-end", "Back-end"],
  datasets: [
    {
      label: "Eerste seizoen",
      data: [65, 59, 90],
      fill: true,
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: "rgb(255, 99, 132)",
      pointBackgroundColor: "rgb(255, 99, 132)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgb(255, 99, 132)",
    },
  ],
};

ws.addEventListener("message", (e) => {
  console.log(e.data);
});

watch(chart, (canvas) => {
  if (!canvas) return;

  ws.send("test");

  new Chart(canvas, {
    type: "radar",
    data,
  });
});

// Handle student selection from form
const handleStudentSelected = async (student: any) => {
  currStudent.value = student;
  loading.value = true;

  try {
    // Fetch student skills and reviews
    const [skills, reviews] = await Promise.all([
      fetchStudentSkills(student.id),
      fetchStudentReviews(student.id),
    ]);

    studentSkills.value = skills;
    studentReviews.value = reviews;

    // Update chart data based on skills
    updateChartData(skills);
  } catch (error) {
    console.error("Error loading student data:", error);
  } finally {
    loading.value = false;
  }
};

const updateChartData = (skills: any[]) => {
  // Update chart data based on student skills
  const skillLevels = skills.filter((skill) => skill.level > 0);

  if (skillLevels.length > 0) {
    data.labels = skillLevels.map((skill) => skill.name);
    data.datasets[0].data = skillLevels.map((skill) => skill.level);
  }
};
</script>

<template>
  <div class="student-page">
    <StudentForm
      v-if="!currStudent"
      @student-selected="handleStudentSelected"
    />

    <div v-if="currStudent" class="fade-in">
      <!-- Header -->
      <header class="student-header">
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
        <h1 class="header-title">STUDENT DASHBOARD</h1>
        <div class="header-spacer"></div>
      </header>

      <!-- Main Content -->
      <div class="student-content">
        <div class="content-grid">
          <!-- Welcome and Comments Section -->
          <div class="info-section">
            <div class="welcome-card">
              <h2 class="welcome-title">Welkom {{ currStudent?.name }}</h2>
            </div>

            <div class="comments-card">
              <h3 class="section-title">Reviews:</h3>
              <div v-if="loading" class="text-center py-4">
                <div
                  class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"
                ></div>
                <p class="mt-2 text-sm text-gray-600">
                  Reviews aan het laden...
                </p>
              </div>
              <div v-else class="comments-container">
                <div
                  v-for="review in studentReviews"
                  :key="review.id"
                  class="comment-item"
                >
                  <h4 class="comment-title">
                    Review van {{ review.reviewerType }}
                  </h4>
                  <div class="rating-summary mb-2">
                    <span
                      v-for="(rating, category) in review.ratings"
                      :key="category"
                      class="rating-badge"
                    >
                      {{ category }}: {{ rating }}/5
                    </span>
                  </div>
                  <p class="comment-text">
                    {{ review.reviewText || "Geen opmerkingen" }}
                  </p>
                  <p class="comment-date">
                    {{
                      new Date(review.submittedAt).toLocaleDateString("nl-NL")
                    }}
                  </p>
                </div>

                <!-- No reviews message -->
                <div
                  v-if="studentReviews.length === 0"
                  class="text-center py-8"
                >
                  <p class="text-gray-600">Nog geen reviews ontvangen</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Chart Section -->
          <div class="chart-section">
            <div class="chart-card">
              <h3 class="section-title">Voortgang Overzicht</h3>
              <div class="chart-container">
                <canvas ref="chart"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.student-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.student-header {
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

.student-content {
  padding: 24px 20px;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.welcome-card,
.comments-card,
.chart-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.welcome-title {
  font-size: 20px;
  font-weight: bold;
  color: #374151;
  margin: 0;
  text-align: center;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 16px 0;
}

.comments-container {
  max-height: 400px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.comment-item {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  transition: border-color 0.2s;
}

.comment-item:hover {
  border-color: #f97316;
}

.comment-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 8px 0;
}

.comment-text {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;
}

.comment-date {
  font-size: 12px;
  color: #9ca3af;
  margin: 8px 0 0 0;
  font-style: italic;
}

.rating-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}

.rating-badge {
  display: inline-block;
  background: #f3f4f6;
  color: #374151;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

.chart-section {
  display: flex;
  align-items: stretch;
}

.chart-card {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chart-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
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
@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .student-content {
    padding: 20px 16px;
  }
}

@media (max-width: 480px) {
  .welcome-card,
  .comments-card,
  .chart-card {
    padding: 16px;
  }

  .welcome-title {
    font-size: 18px;
  }

  .section-title {
    font-size: 14px;
  }
}
</style>
