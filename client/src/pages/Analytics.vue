<template>
  <div class="analytics">
    <div class="container">
      <h1>📊 Análise do Casamento</h1>
      <p class="subtitle">Visualize as tendências e dados do seu casamento de forma intuitiva</p>

      <div class="analytics-grid">
        <!-- Overview Cards -->
        <div class="overview-section">
          <h2>Resumo Geral</h2>
          <div class="cards-grid">
            <div class="card primary">
              <div class="card-icon">👥</div>
              <div class="card-content">
                <p class="card-label">Total de Convidados</p>
                <p class="card-value">{{ store.guests.length }}</p>
              </div>
            </div>

            <div class="card success">
              <div class="card-icon">✓</div>
              <div class="card-content">
                <p class="card-label">Confirmados</p>
                <p class="card-value">{{ store.confirmedGuests.length }}</p>
              </div>
            </div>

            <div class="card warning">
              <div class="card-icon">⏳</div>
              <div class="card-content">
                <p class="card-label">Pendentes</p>
                <p class="card-value">{{ store.pendingGuests.length }}</p>
              </div>
            </div>

            <div class="card danger">
              <div class="card-icon">✕</div>
              <div class="card-content">
                <p class="card-label">Recusados</p>
                <p class="card-value">{{ store.declinedGuests.length }}</p>
              </div>
            </div>

            <div class="card info">
              <div class="card-icon">🎁</div>
              <div class="card-content">
                <p class="card-label">Presentes Cadastrados</p>
                <p class="card-value">{{ store.gifts.length }}</p>
              </div>
            </div>

            <div class="card secondary">
              <div class="card-icon">🛒</div>
              <div class="card-content">
                <p class="card-label">Compras Realizadas</p>
                <p class="card-value">{{ store.purchases.length }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts Section -->
        <div class="charts-section">
          <h2>Visualizações</h2>

          <!-- Attendance Chart -->
          <div class="chart-container">
            <h3>Status de Confirmação</h3>
            <div class="chart">
              <div class="pie-chart">
                <div class="pie-slice confirmed" :style="{ 'transform': `rotate(${confirmedAngle}deg)` }"></div>
                <div class="pie-slice pending" :style="{ 'transform': `rotate(${confirmedAngle + pendingAngle}deg)` }"></div>
                <div class="pie-slice declined"></div>
                <div class="pie-center"></div>
              </div>
              <div class="chart-legend">
                <div class="legend-item">
                  <span class="legend-color confirmed"></span>
                  <span>Confirmados: {{ store.confirmedGuests.length }}</span>
                </div>
                <div class="legend-item">
                  <span class="legend-color pending"></span>
                  <span>Pendentes: {{ store.pendingGuests.length }}</span>
                </div>
                <div class="legend-item">
                  <span class="legend-color declined"></span>
                  <span>Recusados: {{ store.declinedGuests.length }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Gifts by Category -->
          <div class="chart-container">
            <h3>Presentes por Categoria</h3>
            <div class="category-chart">
              <div v-for="(count, category) in giftsByCategory" :key="category" class="category-bar">
                <div class="category-label">{{ category }}</div>
                <div class="bar-container">
                  <div class="bar" :style="{ width: (count / maxGiftsInCategory * 100) + '%' }">
                    <span class="bar-value">{{ count }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Revenue Chart -->
          <div class="chart-container" v-if="store.purchases.length > 0">
            <h3>Valor Total de Compras: R$ {{ formatPrice(totalPurchasesValue) }}</h3>
            <div class="revenue-breakdown">
              <div class="revenue-item">
                <span class="revenue-label">Pagamentos via Pix:</span>
                <span class="revenue-value">R$ {{ formatPrice(pixPurchasesValue) }}</span>
              </div>
              <div class="revenue-item">
                <span class="revenue-label">Compras em Loja:</span>
                <span class="revenue-value">R$ {{ formatPrice(manualPurchasesValue) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Guests Details -->
        <div class="details-section">
          <h2>Detalhes dos Convidados</h2>
          
          <div class="details-grid">
            <div class="detail-card">
              <h3>👨‍👩‍👧‍👦 Acompanhantes Confirmados</h3>
              <div class="detail-content">
                <p><strong>Adultos (Pagantes):</strong> {{ totalConfirmedAdults }}</p>
                <p><strong>Crianças (até 6 anos):</strong> {{ totalConfirmedChildren }}</p>
                <p><strong>Total:</strong> {{ totalConfirmedAdults + totalConfirmedChildren }}</p>
              </div>
            </div>

            <div class="detail-card">
              <h3>📍 Informações do Casamento</h3>
              <div class="detail-content">
                <p><strong>Data:</strong> {{ store.weddingInfo.date }}</p>
                <p><strong>Horário:</strong> {{ store.weddingInfo.time }}</p>
                <p><strong>Local:</strong> {{ store.weddingInfo.location }}</p>
              </div>
            </div>

            <div class="detail-card">
              <h3>🎁 Presente Mais Popular</h3>
              <div class="detail-content">
                <p v-if="mostPopularGift">
                  <strong>{{ mostPopularGift.title }}</strong><br>
                  Categoria: {{ mostPopularGift.category }}<br>
                  Valor: R$ {{ formatPrice(mostPopularGift.value) }}<br>
                  Compras: {{ giftPurchaseCount(mostPopularGift.id) }}
                </p>
                <p v-else>Nenhuma compra registrada ainda</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Export Section -->
        <div class="export-section">
          <h2>📥 Exportar Dados</h2>
          <p>Baixe um relatório completo em JSON com todos os dados do seu casamento</p>
          <button @click="exportData" class="btn btn-primary">
            ⬇️ Baixar Relatório JSON
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useWeddingStore } from '../stores/weddingStore'
import { useAuthStore } from '../stores/authStore'

const store = useWeddingStore()
const router = useRouter()
const authStore = useAuthStore()

onMounted(() => {
  authStore.checkAdminLogin()
  if (!authStore.isAdminLoggedIn) {
    router.push('/login-admin')
  }
})

const confirmedAngle = computed(() => {
  const total = store.guests.length
  return total > 0 ? (store.confirmedGuests.length / total) * 360 : 0
})

const pendingAngle = computed(() => {
  const total = store.guests.length
  return total > 0 ? (store.pendingGuests.length / total) * 360 : 0
})

const giftsByCategory = computed(() => {
  const categories: Record<string, number> = {}
  store.gifts.forEach(gift => {
    categories[gift.category] = (categories[gift.category] || 0) + 1
  })
  return categories
})

const maxGiftsInCategory = computed(() => {
  const values = Object.values(giftsByCategory.value)
  return values.length > 0 ? Math.max(...values) : 1
})

const totalPurchasesValue = computed(() => {
  return store.purchases.reduce((total, p) => total + p.totalValue, 0)
})

const pixPurchasesValue = computed(() => {
  return store.purchases
    .filter(p => p.paymentMethod === 'pix')
    .reduce((total, p) => total + p.totalValue, 0)
})

const manualPurchasesValue = computed(() => {
  return store.purchases
    .filter(p => p.paymentMethod === 'manual')
    .reduce((total, p) => total + p.totalValue, 0)
})

const totalConfirmedAdults = computed(() => {
  return store.confirmedGuests.reduce((total, g) => total + g.adultsCount, 0)
})

const totalConfirmedChildren = computed(() => {
  return store.confirmedGuests.reduce((total, g) => total + g.childrenCount, 0)
})

const mostPopularGift = computed(() => {
  if (store.purchases.length === 0) return null
  
  const giftCounts: Record<string, { gift: any; count: number }> = {}
  
  store.purchases.forEach(purchase => {
    if (!giftCounts[purchase.giftId]) {
      const gift = store.gifts.find(g => g.id === purchase.giftId)
      giftCounts[purchase.giftId] = { gift, count: 0 }
    }
    giftCounts[purchase.giftId].count++
  })

  let mostPopular = null
  let maxCount = 0
  
  Object.values(giftCounts).forEach(item => {
    if (item.count > maxCount) {
      maxCount = item.count
      mostPopular = item.gift
    }
  })

  return mostPopular
})

const formatPrice = (value: number) => {
  return value.toFixed(2).replace('.', ',')
}

const giftPurchaseCount = (giftId: string) => {
  return store.purchases.filter(p => p.giftId === giftId).length
}

const exportData = () => {
  const data = {
    wedding: store.weddingInfo,
    guests: store.guests,
    gifts: store.gifts,
    purchases: store.purchases,
    statistics: {
      totalGuests: store.guests.length,
      confirmedGuests: store.confirmedGuests.length,
      pendingGuests: store.pendingGuests.length,
      declinedGuests: store.declinedGuests.length,
      totalPresents: store.gifts.length,
      totalPurchases: store.purchases.length,
      totalRevenue: totalPurchasesValue.value,
      pixRevenue: pixPurchasesValue.value,
      manualRevenue: manualPurchasesValue.value,
      confirmedAdults: totalConfirmedAdults.value,
      confirmedChildren: totalConfirmedChildren.value
    },
    exportedAt: new Date().toISOString()
  }

  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `casamento-${store.weddingInfo.date}-dados.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.analytics {
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #f5f5f5 0%, #fafafa 100%);
  min-height: calc(100vh - 200px);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  margin-bottom: 0.5rem;
  color: var(--text-dark);
  font-size: 2.5rem;
}

.subtitle {
  text-align: center;
  color: #999;
  margin-bottom: 3rem;
  font-size: 1.1rem;
}

h2 {
  color: var(--text-dark);
  margin-bottom: 2rem;
  font-size: 1.8rem;
  border-bottom: 2px solid var(--primary);
  padding-bottom: 1rem;
}

h3 {
  color: var(--text-dark);
  margin-bottom: 1.5rem;
}

.analytics-grid {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

/* Overview Cards */
.overview-section {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  border-radius: 12px;
  color: white;
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.card.primary {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
}

.card.success {
  background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
}

.card.warning {
  background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
}

.card.danger {
  background: linear-gradient(135deg, #f44 0%, #d32f2f 100%);
}

.card.info {
  background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
}

.card.secondary {
  background: linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%);
}

.card-icon {
  font-size: 2.5rem;
}

.card-content {
  flex: 1;
}

.card-label {
  font-size: 0.9rem;
  opacity: 0.9;
  margin-bottom: 0.5rem;
}

.card-value {
  font-size: 2rem;
  font-weight: 700;
}

/* Charts Section */
.charts-section {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.chart-container {
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.chart-container:last-child {
  border-bottom: none;
}

.chart {
  display: flex;
  gap: 3rem;
  align-items: center;
}

.pie-chart {
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    #4caf50 0deg,
    #4caf50 calc(var(--confirmed-angle, 0deg)),
    #ffc107 calc(var(--confirmed-angle, 0deg)),
    #ffc107 calc(var(--confirmed-angle, 0deg) + var(--pending-angle, 0deg)),
    #f44 calc(var(--confirmed-angle, 0deg) + var(--pending-angle, 0deg)),
    #f44 360deg
  );
  display: flex;
  align-items: center;
  justify-content: center;
}

.pie-center {
  position: absolute;
  width: 120px;
  height: 120px;
  background: white;
  border-radius: 50%;
}

.pie-slice {
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
}

.chart-legend {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 4px;
}

.legend-color.confirmed {
  background: #4caf50;
}

.legend-color.pending {
  background: #ffc107;
}

.legend-color.declined {
  background: #f44;
}

.category-chart {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.category-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.category-label {
  min-width: 150px;
  font-weight: 600;
  color: var(--text-dark);
}

.bar-container {
  flex: 1;
  height: 40px;
  background: #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
}

.bar {
  height: 100%;
  background: linear-gradient(90deg, var(--primary) 0%, var(--primary-dark) 100%);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 1rem;
  color: white;
  font-weight: 600;
  transition: all 0.3s ease;
}

.bar:hover {
  box-shadow: 0 0 10px rgba(212, 165, 116, 0.3);
}

.bar-value {
  font-size: 0.9rem;
}

.revenue-breakdown {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.revenue-item {
  background: linear-gradient(135deg, var(--accent) 0%, rgba(245, 230, 211, 0.5) 100%);
  padding: 1.5rem;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.revenue-label {
  font-weight: 600;
  color: var(--text-dark);
}

.revenue-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
}

/* Details Section */
.details-section {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.detail-card {
  background: linear-gradient(135deg, var(--accent) 0%, rgba(245, 230, 211, 0.5) 100%);
  padding: 2rem;
  border-radius: 12px;
  border-left: 4px solid var(--primary);
}

.detail-card h3 {
  color: var(--primary);
  margin-bottom: 1.5rem;
}

.detail-content {
  color: #666;
  line-height: 1.8;
}

.detail-content p {
  margin-bottom: 0.75rem;
}

.detail-content strong {
  color: var(--text-dark);
}

/* Export Section */
.export-section {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.export-section p {
  color: #666;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
}

.btn-primary {
  background-color: var(--primary);
  color: white;
}

.btn-primary:hover {
  background-color: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(212, 165, 116, 0.3);
}

@media (max-width: 768px) {
  .analytics {
    padding: 2rem 1rem;
  }

  h1 {
    font-size: 1.8rem;
  }

  h2 {
    font-size: 1.4rem;
  }

  .cards-grid {
    grid-template-columns: 1fr;
  }

  .chart {
    flex-direction: column;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }
}
</style>
