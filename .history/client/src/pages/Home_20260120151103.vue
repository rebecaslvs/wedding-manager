<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-bg"></div>
      <div class="hero-content">
        <h1 class="hero-title">Rebeca & Marcos</h1>
        <p class="hero-subtitle">14 de Junho de 2026</p>
        <div class="countdown">
          <div class="countdown-item">
            <span class="countdown-number">{{ days }}</span>
            <span class="countdown-label">Dias</span>
          </div>
          <div class="countdown-item">
            <span class="countdown-number">{{ hours }}</span>
            <span class="countdown-label">Horas</span>
          </div>
          <div class="countdown-item">
            <span class="countdown-number">{{ minutes }}</span>
            <span class="countdown-label">Minutos</span>
          </div>
          <div class="countdown-item">
            <span class="countdown-number">{{ seconds }}</span>
            <span class="countdown-label">Segundos</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Welcome Section -->
    <section class="welcome">
      <div class="container">
        <h2>Sejam bem-vindos ao nosso site!</h2>
        <p>O nosso melhor presente é compartilhar esse novo capítulo da nossa história com vocês.</p>
      </div>
    </section>

    <!-- Ceremony Section -->
    <section class="ceremony">
      <div class="container">
        <h2>Cerimônia</h2>
        <div class="ceremony-info">
          <div class="info-card">
            <h3>📅 Data</h3>
            <p>{{ store.weddingInfo.date }}</p>
          </div>
          <div class="info-card">
            <h3>🕐 Horário</h3>
            <p>{{ store.weddingInfo.time }}</p>
          </div>
          <div class="info-card">
            <h3>📍 Local</h3>
            <p>{{ store.weddingInfo.location }}</p>
          </div>
          <div class="info-card">
            <h3>🗺️ Endereço</h3>
            <p>{{ store.weddingInfo.address }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Guest Guide Section -->
    <section class="guide guide-romantic">
      <div class="container">
        <h2 class="romantic-title">
          Guia do Convidado
        </h2>
        <div class="romantic-divider"></div>
        <p class="romantic-note">Para que tudo ocorra como sonhamos e para que vocês aproveitem a festa ao máximo, separamos essas informações com carinho!</p>
        <br>
        <div class="romantic-info">
          <ul>
            <li><span class="romantic-bullet">•</span> Pedimos gentilmente que não utilize <b>vestido Branco, Off-White, Marfim ou Pérola</b>, pois são as cores reservadas para a noiva.</li>
            <li><span class="romantic-bullet">•</span> A cor <b>Lavanda</b> foi reservada exclusivamente para o cortejo das madrinhas. Fiquem à vontade para usar qualquer outra cor que amarem!</li>
            <li><span class="romantic-bullet">•</span> A <b>confirmação de presença</b> é indispensável para a nossa organização com o buffet e assentos. Por favor, confirmem através do site até o dia <b>15 de abril</b>. Caso não possam comparecer, avisem-nos o quanto antes; sentiremos sua falta, mas entenderemos perfeitamente.</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta">
      <div class="container">
        <h2>Vamos começar?</h2>
        <div class="cta-buttons">
          <router-link to="/confirmar-presenca" class="btn btn-primary">Confirmar Presença</router-link>
          <router-link to="/presentes" class="btn btn-outline">Ver Presentes</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useWeddingStore } from '../stores/weddingStore'
import { RouterLink } from 'vue-router'

const store = useWeddingStore()

const days = ref(0)
const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)

let countdownInterval: NodeJS.Timeout

const updateCountdown = () => {
  const weddingDate = new Date('2026-06-14T18:00:00').getTime()
  const now = new Date().getTime()
  const distance = weddingDate - now

  if (distance < 0) {
    days.value = 0
    hours.value = 0
    minutes.value = 0
    seconds.value = 0
    return
  }

  days.value = Math.floor(distance / (1000 * 60 * 60 * 24))
  hours.value = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  minutes.value = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
  seconds.value = Math.floor((distance % (1000 * 60)) / 1000)
}

onMounted(() => {
  store.loadData()
  updateCountdown()
  countdownInterval = setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
  if (countdownInterval) clearInterval(countdownInterval)
})
</script>

<style scoped>
.home {
  width: 100%;
}

.hero {
  position: relative;
  min-height: 720px;
  width: 100%;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
}
.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('/src/components/images/capa.jpg') center center/cover no-repeat;
  z-index: 1;
  filter: brightness(0.65) blur(0.5px);
}
.hero-content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 9rem 2rem 5rem 2rem;
  color: #fff;
  text-shadow: 0 2px 16px rgba(80, 40, 120, 0.18);
}

.hero-content {
  animation: fadeInUp 1s ease-out;
}

.hero-title {
  font-size: 4rem;
  margin-bottom: 1rem;
  font-family: 'Playfair Display', serif;
  letter-spacing: 2px;
}

.hero-subtitle {
  font-size: 1.5rem;
  margin-bottom: 3rem;
  opacity: 0.9;
}

.countdown {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.countdown-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.2);
  padding: 1.5rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  min-width: 100px;
}

.countdown-number {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1;
}

.countdown-label {
  font-size: 0.9rem;
  margin-top: 0.5rem;
  opacity: 0.9;
}

.welcome {
  padding: 4rem 2rem;
  background-color: white;
  text-align: center;
}

.welcome h2 {
  margin-bottom: 1rem;
  color: var(--text-dark);
}

.welcome p {
  font-size: 1.1rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
}

.ceremony {
  padding: 4rem 2rem;
  background-color: #f9f9f9;
}

.ceremony h2 {
  text-align: center;
  margin-bottom: 3rem;
  color: var(--text-dark);
}

.ceremony-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.info-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.info-card h3 {
  margin-bottom: 1rem;
  color: var(--primary);
  font-size: 1.3rem;
}

.info-card p {
  font-size: 1.1rem;
  color: #666;
}


.guide-romantic {
  padding: 4rem 2rem 3rem 2rem;
  background: linear-gradient(135deg, var(--primary-light) 0%, var(--accent) 100%);
  position: relative;
  overflow: hidden;
}

.romantic-title {
  text-align: center;
  margin-bottom: 1.5rem;
  color: var(--primary-dark);
  font-family: 'Playfair Display', serif;
  font-size: 2.3rem;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.2rem;
}
.romantic-icon {
  font-size: 2rem;
  vertical-align: middle;
}
.romantic-divider {
  width: 120px;
  height: 3px;
  background: linear-gradient(90deg, var(--primary-dark) 0%, var(--primary) 100%);
  border-radius: 2px;
  margin: 0 auto 2.5rem auto;
}
.romantic-info {
  max-width: 900px;
  margin: 0 auto;
  font-size: 1.15rem;
  color: var(--text-dark);
  background: transparent;
  border-radius: 0;
  padding: 0;
  box-shadow: none;
}
.romantic-info ul {
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem 0;
}
.romantic-info li {
  margin-bottom: 1.2rem;
  line-height: 1.8;
  font-size: 1.13rem;
}
.romantic-bullet {
  font-size: 1.15rem;
  margin-right: 0.4em;
  vertical-align: middle;
}
.romantic-bullet {
  font-size: 1.3rem;
  margin-top: 0.1em;
}
.romantic-note {
  color: var(--primary-dark);
  font-size: 1.08rem;
  font-style: italic;
  text-align: center;
  margin-top: 0.5rem;
}

.guide-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.guest-info-box {
  background: linear-gradient(135deg, var(--primary-light) 0%, var(--accent) 100%);
  border-left: 6px solid var(--primary);
  border-radius: 12px;
  padding: 2rem 2rem 1.5rem 2rem;
  margin-bottom: 2.5rem;
  box-shadow: 0 2px 12px rgba(179, 157, 219, 0.08);
}
.guest-info-box h3 {
  color: var(--primary-dark);
  margin-bottom: 1rem;
  font-size: 1.3rem;
}
.guest-info-box ul {
  margin: 0 0 1rem 0;
  padding-left: 1.2rem;
  color: var(--text-dark);
  font-size: 1.08rem;
}
.guest-info-box li {
  margin-bottom: 0.7rem;
  line-height: 1.7;
}
.guest-info-note {
  color: var(--primary-dark);
  font-size: 1rem;
  margin-top: 0.5rem;
  font-style: italic;
}

.guide-item {
  padding: 2rem;
  background: linear-gradient(135deg, var(--accent) 0%, rgba(245, 230, 211, 0.5) 100%);
  border-radius: 12px;
  border-left: 4px solid var(--primary);
}

.guide-item h3 {
  color: var(--primary-dark);
  margin-bottom: 1rem;
}

.guide-item p {
  color: #666;
  line-height: 1.8;
}

.cta {
  padding: 4rem 2rem;
  background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary-dark) 100%);
  color: var(--text-light);
  text-align: center;
  border-top: 2px solid var(--primary);
}
.cta h2 {
  margin-bottom: 2rem;
  color: var(--primary-dark);
}

.cta h2 {
  margin-bottom: 2rem;
  color: white;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.btn {
  padding: 1rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-block;
}

.btn-primary, .btn-outline {
  background-color: var(--primary);
  color: white;
}

.btn-primary:hover {
  background-color: var(--primary-dark);
  transform: translateY(-2px);
}

/* .btn-outline {
  background-color: transparent;
  color: var(--primary);
  border: 2px solid var(--primary);
}

.btn-outline:hover {
  background-color: var(--primary);
  color: white;
} */

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .countdown {
    gap: 1rem;
  }

  .countdown-item {
    min-width: 80px;
    padding: 1rem;
  }

  .countdown-number {
    font-size: 1.8rem;
  }

  .cta-buttons {
    flex-direction: column;
  }
}
</style>
