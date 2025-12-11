<template>
  <div class="home-page">
    <!-- Header -->
    <header class="home-header">
      <h1 class="header-title">WAARDERINGSAPP</h1>
    </header>

    <!-- Main Content -->
    <div class="home-content">
      <div class="selection-form">
        <h2 class="form-question">Ben je een student of docent?</h2>

        <div class="role-grid">
          <router-link class="role-card" to="/student">
            <div class="role-icon">👨‍🎓</div>
            <p class="role-name">Student</p>
            <p class="role-description">Bekijk je waarderingen</p>
          </router-link>

          <router-link class="role-card" to="/docent">
            <div class="role-icon">👨‍🏫</div>
            <p class="role-name">Docent</p>
            <p class="role-description">Beoordeel studenten</p>
          </router-link>

          <router-link class="role-card" to="/klant">
            <div class="role-icon">👤</div>
            <p class="role-name">Klant</p>
            <p class="role-description">Geef feedback</p>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.home-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 20px;
  background: rgba(0, 0, 0, 0.1);
}

.header-title {
  font-size: 18px;
  font-weight: bold;
  color: white;
  margin: 0;
  letter-spacing: 1px;
}

.home-content {
  padding: 24px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 70px);
}

.selection-form {
  background: white;
  border-radius: 12px;
  padding: 32px 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
}

.form-question {
  font-size: 18px;
  color: #374151;
  margin: 0 0 32px 0;
  font-weight: 500;
  text-align: center;
}

.role-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
}

.role-card {
  cursor: pointer;
  text-align: center;
  border: 1px solid #e5e7eb;
  padding: 20px 16px;
  border-radius: 12px;
  transition: all 0.2s ease;
  background-color: #fff;
  text-decoration: none;
  color: inherit;
}

.role-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: #f97316;
}

.role-icon {
  font-size: 40px;
  margin: 0 0 12px 0;
}

.role-name {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 6px 0;
  line-height: 1.2;
}

.role-description {
  font-size: 12px;
  font-weight: 400;
  color: #6b7280;
  margin: 0;
  line-height: 1.2;
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
@media (max-width: 480px) {
  .home-content {
    padding: 20px 16px;
  }

  .selection-form {
    padding: 24px 16px;
  }

  .role-grid {
    grid-template-columns: repeat(1, 1fr);
    gap: 12px;
  }

  .form-question {
    font-size: 16px;
  }

  .role-icon {
    font-size: 32px;
  }

  .role-name {
    font-size: 14px;
  }

  .role-description {
    font-size: 11px;
  }
}
</style>
