<template>
  <div class="confirmar-presenca">
    <div class="container">
      <h1>Confirmar Presença</h1>
      
      <div class="content">
        <div v-if="!guestFound" class="search-section">
          <p class="intro-text">Por favor, informe seu nome para confirmar sua presença em nosso casamento.</p>
          
          <form @submit.prevent="searchGuest" class="search-form">
            <div class="form-group">
              <label for="guestName">Seu Nome:</label>
              <input
                v-model="searchName"
                type="text"
                id="guestName"
                placeholder="Digite seu nome completo"
                required
              />
            </div>
            <button type="submit" class="btn btn-primary">Buscar</button>
          </form>

          <div v-if="notFound" class="error-message">
            <p>😔 Desculpe, não localizamos seu nome em nossa lista de convidados.</p>
            <p>Se acredita que isso é um erro, por favor entre em contato conosco pelo WhatsApp.</p>
          </div>
        </div>

        <div v-else class="confirmation-section">
          <div class="guest-info">
            <h2>Olá, {{ currentGuest.name }}!</h2>
            <p class="status-text" :class="currentGuest.status">
              Status atual: <strong>{{ getStatusText(currentGuest.status) }}</strong>
            </p>
          </div>

          <div v-if="currentGuest.status === 'pending'" class="confirmation-options">
            <p class="question">Você poderá comparecer ao nosso casamento?</p>
            
            <div class="options">
              <button @click="confirmAttendance" class="btn btn-primary btn-large">
                ✓ Sim, vou comparecer
              </button>
              <button @click="declineAttendance" class="btn btn-secondary btn-large">
                ✗ Não vou poder comparecer
              </button>
            </div>

            <div v-if="showAccompaniantsForm" class="accompanists-form">
              <h3>Quantos acompanhantes você terá?</h3>
              <div class="form-group">
                <label for="adults">Adultos(a partir de 7 anos):</label>
                <input
                  v-model.number="accompanists.adults"
                  type="number"
                  id="adults"
                  min="0"
                  :max="currentGuest.adultsCount"
                  placeholder="0"
                />
                <small v-if="currentGuest">Máximo permitido: {{ currentGuest.adultsCount }}</small>
              </div>
              <div v-for="n in accompanists.adults" :key="'adult-'+n" class="form-group">
                <label :for="'adultName'+n">Nome do Adulto {{ n }}:</label>
                <input v-model="accompanists.adultNames[n-1]" :id="'adultName'+n" type="text" required />
              </div>
              <div class="form-group">
                <label for="children">Crianças(até 6 anos):</label>
                <input
                  v-model.number="accompanists.children"
                  type="number"
                  id="children"
                  min="0"
                  :max="currentGuest.childrenCount"
                  placeholder="0"
                />
                <small v-if="currentGuest">Máximo permitido: {{ currentGuest.childrenCount }}</small>
              </div>
              <div v-for="n in accompanists.children" :key="'child-'+n" class="form-group">
                <label :for="'childName'+n">Nome da Criança {{ n }}:</label>
                <input v-model="accompanists.childNames[n-1]" :id="'childName'+n" type="text" required />
              </div>
              <button @click="submitConfirmation" class="btn btn-primary">
                Confirmar Presença
              </button>
            </div>
          </div>

          <div v-else class="confirmation-status">
            <div v-if="currentGuest.status === 'confirmed'" class="success-message">
              <h3>✓ Presença Confirmada!</h3>
              <p>Obrigado por confirmar sua presença! Estamos ansiosos para vê-lo(a) no grande dia.</p>
              <div class="guest-details">
                <p><strong>Acompanhantes:</strong></p>
                <p>Adultos(a partir de 7 anos): {{ currentGuest.adultsCount }}</p>
                <p>Crianças(até 6 anos): {{ currentGuest.childrenCount }}</p>
              </div>
            </div>
            <div v-else class="decline-message">
              <h3>✗ Presença Não Confirmada</h3>
              <p>Entendemos que você não poderá comparecer, mas agradecemos pelo feedback. Sentiremos sua falta!</p>
            </div>
          </div>

          <button @click="resetForm" class="btn btn-outline mt-4">
            Buscar Outro Convidado
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useWeddingStore, type Guest } from '../stores/weddingStore'

const store = useWeddingStore()

const searchName = ref('')
const guestFound = ref(false)
const notFound = ref(false)
const currentGuest = ref<Guest | null>(null)
const showAccompaniantsForm = ref(false)
const accompanists = ref({
  adults: 1,
  children: 0,
  adultNames: [''],
  childNames: ['']
})

const searchGuest = () => {
  notFound.value = false
  const guest = store.getGuestByName(searchName.value)
  
  if (guest) {
    currentGuest.value = guest
    guestFound.value = true
  } else {
    notFound.value = true
  }
}

const confirmAttendance = () => {
  showAccompaniantsForm.value = true
}

const declineAttendance = () => {
  if (currentGuest.value) {
    store.updateGuest(currentGuest.value.id, { status: 'declined' })
    currentGuest.value.status = 'declined'
  }
}

const submitConfirmation = () => {
  if (currentGuest.value) {
    // Limite de acompanhantes
    if (
      accompanists.value.adults > currentGuest.value.adultsCount ||
      accompanists.value.children > currentGuest.value.childrenCount
    ) {
      alert('Você não pode adicionar mais acompanhantes do que o permitido.');
      return;
    }
    // Nomes obrigatórios
    if (
      accompanists.value.adultNames.length < accompanists.value.adults ||
      accompanists.value.adultNames.slice(0, accompanists.value.adults).some(n => !n) ||
      accompanists.value.childNames.length < accompanists.value.children ||
      accompanists.value.childNames.slice(0, accompanists.value.children).some(n => !n)
    ) {
      alert('Informe o nome de todos os acompanhantes.');
      return;
    }
    store.updateGuest(currentGuest.value.id, {
      status: 'confirmed',
      adultsCount: accompanists.value.adults,
      childrenCount: accompanists.value.children,
      adultNames: accompanists.value.adultNames.slice(0, accompanists.value.adults),
      childNames: accompanists.value.childNames.slice(0, accompanists.value.children)
    })
    currentGuest.value.adultsCount = accompanists.value.adults
    currentGuest.value.childrenCount = accompanists.value.children
    currentGuest.value.adultNames = accompanists.value.adultNames.slice(0, accompanists.value.adults)
    currentGuest.value.childNames = accompanists.value.childNames.slice(0, accompanists.value.children)
    showAccompaniantsForm.value = false
  }
}

const resetForm = () => {
  searchName.value = ''
  guestFound.value = false
  notFound.value = false
  currentGuest.value = null
  showAccompaniantsForm.value = false
  accompanists.value = { adults: 1, children: 0, adultNames: [''], childNames: [''] }
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: 'Aguardando resposta',
    confirmed: 'Presença confirmada',
    declined: 'Não confirmado'
  }
  return statusMap[status] || status
}
</script>

<style scoped>
.confirmar-presenca {
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #f5f5f5 0%, #fafafa 100%);
  min-height: calc(100vh - 200px);
}

.container {
  max-width: 600px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  margin-bottom: 3rem;
  color: var(--text-dark);
}

.content {
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.intro-text {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.search-form {
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--text-dark);
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
}

input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(212, 165, 116, 0.1);
}

.btn {
  padding: 0.75rem 1.5rem;
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
  width: 100%;
}

.btn-primary:hover {
  background-color: var(--primary-dark);
  transform: translateY(-2px);
}

.btn-secondary {
  background-color: var(--secondary);
  color: white;
}

.btn-secondary:hover {
  background-color: #1a1a1a;
}

.btn-outline {
  background-color: transparent;
  color: var(--primary);
  border: 2px solid var(--primary);
}

.btn-outline:hover {
  background-color: var(--primary);
  color: white;
}

.btn-large {
  padding: 1rem 1.5rem;
  font-size: 1.1rem;
}

.error-message {
  background-color: #fee;
  border-left: 4px solid #f44;
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 2rem;
}

.error-message p {
  color: #c33;
  margin: 0.5rem 0;
}

.guest-info {
  text-align: center;
  margin-bottom: 2rem;
}

.guest-info h2 {
  color: var(--primary);
  margin-bottom: 1rem;
}

.status-text {
  font-size: 1.1rem;
  color: #666;
}

.status-text.confirmed {
  color: #4caf50;
}

.status-text.declined {
  color: #f44;
}

.confirmation-options {
  margin-top: 2rem;
}

.question {
  text-align: center;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 2rem;
  color: var(--text-dark);
}

.options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
}

.accompanists-form {
  background-color: #f9f9f9;
  padding: 2rem;
  border-radius: 8px;
  margin-top: 2rem;
}

.accompanists-form h3 {
  margin-bottom: 1.5rem;
  color: var(--text-dark);
}

.success-message {
  background-color: #efe;
  border-left: 4px solid #4caf50;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
}

.success-message h3 {
  color: #4caf50;
  margin-bottom: 1rem;
}

.success-message p {
  color: #666;
  margin-bottom: 1rem;
}

.guest-details {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  text-align: left;
}

.guest-details p {
  margin: 0.5rem 0;
  color: var(--text-dark);
}

.decline-message {
  background-color: #fee;
  border-left: 4px solid #f44;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
}

.decline-message h3 {
  color: #f44;
  margin-bottom: 1rem;
}

.decline-message p {
  color: #666;
  margin-bottom: 1rem;
}

.mt-4 {
  margin-top: 2rem;
  width: 100%;
}

@media (max-width: 768px) {
  .content {
    padding: 1.5rem;
  }

  .options {
    grid-template-columns: 1fr;
  }

  .btn-large {
    padding: 0.75rem 1rem;
    font-size: 1rem;
  }
}
</style>
