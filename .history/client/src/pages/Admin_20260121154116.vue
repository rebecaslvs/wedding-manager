<template>
        <!-- Modal de edição de convidado -->
        <div v-if="editingGuest" class="modal-overlay" @click="closeEditGuestModal">
          <div class="modal-content" @click.stop>
            <h3>Editar Convidado</h3>
            <form @submit.prevent="saveEditGuest" class="form">
              <div class="form-group">
                <label>Nome:</label>
                <input v-model="editingGuestData.name" type="text" required />
              </div>
              <div class="form-group">
                <label>WhatsApp:</label>
                <input v-model="editingGuestData.whatsapp" type="tel" required />
              </div>
              <div class="form-group">
                <label>Limite de Adultos:</label>
                <input v-model.number="editingGuestData.adultsCount" type="number" min="0" required />
              </div>
              <div class="form-group">
                <label>Limite de Crianças:</label>
                <input v-model.number="editingGuestData.childrenCount" type="number" min="0" required />
              </div>
              <div class="form-group">
                <label>Status:</label>
                <select v-model="editingGuestData.status">
                  <option value="pending">Aguardando</option>
                  <option value="confirmed">Confirmado</option>
                  <option value="declined">Recusado</option>
                </select>
              </div>
              <div class="modal-actions">
                <button type="submit" class="btn btn-primary">Salvar</button>
                <button type="button" class="btn btn-cancel" @click="closeEditGuestModal">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
  <div class="admin">
    <div class="admin-container">
      <h1>Painel Administrativo</h1>

      <div class="admin-tabs">
        <button v-for="tab in tabs" :key="tab" @click="activeTab = tab"
          :class="['tab-btn', { active: activeTab === tab }]">
          {{ tab }}
        </button>
      </div>

      <!-- Wedding Info Tab -->
      <div v-if="activeTab === 'Informações'" class="tab-content">
        <h2>Informações do Casamento</h2>
        <form @submit.prevent="updateWeddingInfo" class="form">
          <div class="form-group">
            <label for="coupleNames">Nomes dos Noivos:</label>
            <input v-model="weddingForm.coupleNames" type="text" id="coupleNames" />
          </div>
          <div class="form-group">
            <label for="date">Data:</label>
            <input v-model="weddingForm.date" type="text" id="date" />
          </div>
          <div class="form-group">
            <label for="time">Horário:</label>
            <input v-model="weddingForm.time" type="text" id="time" />
          </div>
          <div class="form-group">
            <label for="location">Local:</label>
            <input v-model="weddingForm.location" type="text" id="location" />
          </div>
          <div class="form-group">
            <label for="address">Endereço:</label>
            <input v-model="weddingForm.address" type="text" id="address" />
          </div>
          <div class="form-group">
            <label for="pixKey">Chave Pix:</label>
            <input v-model="weddingForm.pixKey" type="text" id="pixKey" placeholder="CPF, email ou telefone" />
          </div>
          <button type="submit" class="btn btn-primary">Salvar Alterações</button>
        </form>
      </div>

      <!-- Guests Tab -->
      <div v-if="activeTab === 'Convidados'" class="tab-content">
        <h2>Gerenciar Convidados</h2>

        <div class="section">
          <h3>Adicionar Novo Convidado</h3>
          <form @submit.prevent="addNewGuest" class="form">
            <div class="form-row">
              <div class="form-group">
                <label for="newGuestName">Nome:</label>
                <input v-model="newGuest.name" type="text" id="newGuestName" required />
              </div>
              <div class="form-group">
                <label for="newGuestWhatsapp">WhatsApp:</label>
                <input v-model="newGuest.whatsapp" type="tel" id="newGuestWhatsapp" required />
              </div>
              <div class="form-group">
                <label for="newGuestAdultsCount">Limite de Adultos:</label>
                <input v-model.number="newGuest.adultsCount" type="number" id="newGuestAdultsCount" min="0" required />
              </div>
              <div class="form-group">
                <label for="newGuestChildrenCount">Limite de Crianças:</label>
                <input v-model.number="newGuest.childrenCount" type="number" id="newGuestChildrenCount" min="0" required />
              </div>
            </div>
            <button type="submit" class="btn btn-primary">Adicionar Convidado</button>
          </form>
        </div>

        <div class="section">
          <h3>Lista de Convidados</h3>

          <div class="stats">
            <div class="stat-card">
              <span class="stat-label">Total</span>
              <span class="stat-number">{{ store.guests.length }}</span>
            </div>
            <div class="stat-card confirmed">
              <span class="stat-label">Confirmados</span>
              <span class="stat-number">{{ store.confirmedGuests.length }}</span>
            </div>
            <div class="stat-card pending">
              <span class="stat-label">Pendentes</span>
              <span class="stat-number">{{ store.pendingGuests.length }}</span>
            </div>
            <div class="stat-card declined">
              <span class="stat-label">Recusados</span>
              <span class="stat-number">{{ store.declinedGuests.length }}</span>
            </div>
          </div>

          <div class="guests-table">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>WhatsApp</th>
                  <th>Status</th>
                  <th>Adultos</th>
                  <th>Nomes dos Adultos</th>
                  <th>Crianças</th>
                  <th>Nomes das Crianças</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="guest in store.guests" :key="guest.id" :class="['guest-row', guest.status]">
                  <td>{{ guest.name }}</td>
                  <td>{{ guest.whatsapp }}</td>
                  <td>
                    <span :class="['status-badge', guest.status]">
                      {{ getStatusText(guest.status) }}
                    </span>
                  </td>
                  <td>{{ guest.adultsCount }}</td>
                  <td>
                    <ul v-if="guest.adultNames && guest.adultNames.length">
                      <li v-for="(name, idx) in guest.adultNames" :key="'adult-' + idx">{{ name }}</li>
                    </ul>
                    <span v-else>—</span>
                  </td>
                  <td>{{ guest.childrenCount }}</td>
                  <td>
                    <ul v-if="guest.childNames && guest.childNames.length">
                      <li v-for="(name, idx) in guest.childNames" :key="'child-' + idx">{{ name }}</li>
                    </ul>
                    <span v-else>—</span>
                  </td>
                  <td>
                    <button @click="editGuest(guest)" class="btn-edit">Editar</button>
                    <button @click="deleteGuest(guest.id)" class="btn-delete">Deletar</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Gifts Tab -->
      <div v-if="activeTab === 'Presentes'" class="tab-content">
        <h2>Gerenciar Presentes</h2>

        <div class="section">
          <h3>Adicionar Novo Presente</h3>
          <form @submit.prevent="addNewGift" class="form">
            <div class="form-row">
              <div class="form-group">
                <label for="newGiftTitle">Título:</label>
                <input v-model="newGift.title" type="text" id="newGiftTitle" required />
              </div>
              <div class="form-group">
                <label for="newGiftValue">Valor (R$):</label>
                <input v-model.number="newGift.value" type="number" id="newGiftValue" step="0.01" required />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="newGiftCategory">Categoria:</label>
                <input v-model="newGift.category" type="text" id="newGiftCategory" placeholder="Ex: Cama e Banho"
                  required />
              </div>
              <div class="form-group">
                <label for="newGiftDescription">Descrição:</label>
                <input v-model="newGift.description" type="text" id="newGiftDescription" />
              </div>
            </div>
            <button type="submit" class="btn btn-primary">Adicionar Presente</button>
          </form>
        </div>

        <div class="section">
          <h3>Lista de Presentes</h3>
          <div class="gifts-table">
            <table>
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Categoria</th>
                  <th>Valor</th>
                  <th>Descrição</th>
                  <th>Links de Pagamento</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="gift in store.gifts" :key="gift.id">
                  <td>{{ gift.title }}</td>
                  <td>{{ gift.category }}</td>
                  <td>R$ {{ formatPrice(gift.value) }}</td>
                  <td>{{ gift.description || '—' }}</td>
                  <td>
                    <span class="link-count">{{ gift.paymentLinks?.length || 0 }} link(s)</span>
                    <button @click="editGiftLinks(gift.id)" class="btn-edit">Editar</button>
                  </td>
                  <td>
                    <button @click="deleteGift(gift.id)" class="btn-delete">Deletar</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Edit Links Modal -->
        <div v-if="editingGiftId" class="modal-overlay" @click="editingGiftId = null">
          <div class="modal-content" @click.stop>
            <h3>Gerenciar Links de Pagamento</h3>
            <p class="modal-subtitle">{{ getSelectedGift()?.title }}</p>

            <div class="links-list">
              <div v-for="(link, index) in giftPaymentLinks" :key="index" class="link-item">
                <label>Unidade {{ index + 1 }}:</label>
                <input v-model="giftPaymentLinks[index]" type="url" placeholder="https://..." />
                <button @click="removePaymentLink(index)" class="btn-remove">✕</button>
              </div>
            </div>

            <div class="modal-actions">
              <button @click="addPaymentLink" class="btn btn-secondary">+ Adicionar Link</button>
              <button @click="savePaymentLinks" class="btn btn-primary">Salvar</button>
              <button @click="editingGiftId = null" class="btn btn-cancel">Cancelar</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Purchases Tab -->
      <div v-if="activeTab === 'Compras'" class="tab-content">
        <h2>Compras e Reservas</h2>

        <div class="stats">
          <div class="stat-card">
            <span class="stat-label">Total de Compras</span>
            <span class="stat-number">{{ store.purchases.length }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">Valor Total</span>
            <span class="stat-number">R$ {{ formatPrice(totalPurchasesValue) }}</span>
          </div>
        </div>

        <div class="purchases-table">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>WhatsApp</th>
                <th>Presente</th>
                <th>Quantidade</th>
                <th>Valor</th>
                <th>Método</th>
                <th>Link</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="purchase in store.purchases" :key="purchase.id">
                <td>{{ purchase.guestName }}</td>
                <td>{{ purchase.guestWhatsapp }}</td>
                <td>{{ purchase.giftTitle }}</td>
                <td>{{ purchase.quantity }}</td>
                <td>R$ {{ formatPrice(purchase.totalValue) }}</td>
                <td>{{ purchase.paymentMethod === 'pix' ? 'Pix' : purchase.paymentMethod === 'link' ? 'Link' : 'Loja' }}
                </td>
                <td>
                  <a v-if="purchase.paymentLink" :href="purchase.paymentLink" target="_blank" class="link-badge">Ver
                    Link</a>
                  <span v-else class="no-link">—</span>
                </td>
                <td>
                  <span :class="['status-badge', purchase.status]">
                    {{ purchase.status === 'pending' ? 'Pendente' : 'Concluído' }}
                  </span>
                </td>
                <td>
                  <button @click="deletePurchase(purchase.id)" class="btn-delete">Deletar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { useWeddingStore } from '../stores/weddingStore'
import { useAuthStore } from '../stores/authStore'

const store = useWeddingStore()
const router = useRouter()
const authStore = useAuthStore()

const tabs = ['Informações', 'Convidados', 'Presentes', 'Compras']
const activeTab = ref('Informações')
const editingGiftId = ref<string | null>(null)
const giftPaymentLinks = ref<string[]>([])

const weddingForm = ref({
  coupleNames: '',
  date: '',
  time: '',
  location: '',
  address: '',
  pixKey: ''
})

const newGuest = ref({
  name: '',
  whatsapp: '',
  adultsCount: 0,
  childrenCount: 0,
  status: 'pending' as const
})
const editingGuest = ref(null)
const editingGuestData = ref(null)

const editGuest = (guest) => {
  editingGuest.value = guest
  editingGuestData.value = { ...guest }
}

const closeEditGuestModal = () => {
  editingGuest.value = null
  editingGuestData.value = null
}

const saveEditGuest = () => {
  if (editingGuest.value && editingGuestData.value) {
    store.updateGuest(editingGuest.value.id, editingGuestData.value)
    closeEditGuestModal()
    alert('Convidado atualizado com sucesso!')
  }
}



const newGift = ref({
  title: '',
  value: 0,
  category: '',
  description: ''
})

const totalPurchasesValue = computed(() => {
  return store.purchases.reduce((total, p) => total + p.totalValue, 0)
})

onMounted(() => {
  authStore.checkAdminLogin()
  weddingForm.value = { ...store.weddingInfo }
  watchEffect(() => {
    if (!authStore.isAdminLoggedIn) {
      if (router.currentRoute.value.path !== '/login-admin') {
        router.push('/login-admin')
      }
    }
  })
})

const formatPrice = (value: number) => {
  return value.toFixed(2).replace('.', ',')
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: 'Aguardando',
    confirmed: 'Confirmado',
    declined: 'Recusado'
  }
  return statusMap[status] || status
}

const getSelectedGift = () => {
  return store.gifts.find(g => g.id === editingGiftId.value)
}

const updateWeddingInfo = () => {
  store.updateWeddingInfo(weddingForm.value)
  alert('Informações atualizadas com sucesso!')
}

const addNewGuest = () => {
  if (newGuest.value.name && newGuest.value.whatsapp) {
    store.addGuest(newGuest.value)
    newGuest.value = {
      name: '',
      whatsapp: '',
      adultsCount: 0,
      childrenCount: 0,
      status: 'pending'
    }
    alert('Convidado adicionado com sucesso!')
  }
}

const deleteGuest = (id: string) => {
  if (confirm('Tem certeza que deseja deletar este convidado?')) {
    store.deleteGuest(id)
  }
}

const addNewGift = () => {
  if (newGift.value.title && newGift.value.value > 0 && newGift.value.category) {
    store.addGift(newGift.value)
    newGift.value = {
      title: '',
      value: 0,
      category: '',
      description: ''
    }
    alert('Presente adicionado com sucesso!')
  }
}

const deleteGift = (id: string) => {
  if (confirm('Tem certeza que deseja deletar este presente?')) {
    store.deleteGift(id)
  }
}

const editGiftLinks = (giftId: string) => {
  editingGiftId.value = giftId
  const gift = store.gifts.find(g => g.id === giftId)
  giftPaymentLinks.value = gift?.paymentLinks ? [...gift.paymentLinks] : []
}

const addPaymentLink = () => {
  giftPaymentLinks.value.push('')
}

const removePaymentLink = (index: number) => {
  giftPaymentLinks.value.splice(index, 1)
}

const savePaymentLinks = () => {
  if (editingGiftId.value) {
    const validLinks = giftPaymentLinks.value.filter(link => link.trim() !== '')
    store.updateGiftPaymentLinks(editingGiftId.value, validLinks)
    editingGiftId.value = null
    alert('Links de pagamento salvos com sucesso!')
  }
}

const deletePurchase = (id: string) => {
  if (confirm('Tem certeza que deseja deletar esta compra?')) {
    store.deletePurchase(id)
  }
}

onMounted(() => {
  store.loadData()
  weddingForm.value = { ...store.weddingInfo }
})
</script>

<style scoped>
.admin {
  padding: 2rem;
  background: linear-gradient(135deg, #f5f5f5 0%, #fafafa 100%);
  min-height: calc(100vh - 200px);
}

.admin-container {
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  color: var(--text-dark);
  margin-bottom: 2rem;
}

h2 {
  color: var(--text-dark);
  margin-bottom: 1.5rem;
  border-bottom: 2px solid var(--primary);
  padding-bottom: 0.75rem;
}

h3 {
  color: var(--text-dark);
  margin-bottom: 1rem;
}

.admin-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid var(--border-color);
}

.tab-btn {
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  color: #999;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-btn:hover {
  color: var(--primary);
}

.tab-btn.active {
  color: var(--primary);
  border-bottom-color: var(--primary);
}

.tab-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.section {
  margin-bottom: 3rem;
}

.section:last-child {
  margin-bottom: 0;
}

.section-info {
  color: #999;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: var(--text-dark);
}

.form-group input,
.form-group select {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-family: inherit;
  font-size: 1rem;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(212, 165, 116, 0.1);
}

.form-control {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-family: inherit;
  font-size: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
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

.btn-secondary {
  background-color: #f0f0f0;
  color: var(--text-dark);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background-color: #e0e0e0;
}

.btn-cancel {
  background-color: #f0f0f0;
  color: var(--text-dark);
}

.btn-cancel:hover {
  background-color: #e0e0e0;
}

.btn-delete {
  padding: 0.5rem 1rem;
  background-color: #f44;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-delete:hover {
  background-color: #d32f2f;
}

.btn-edit {
  padding: 0.5rem 1rem;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-left: 0.5rem;
}

.btn-edit:hover {
  background-color: var(--primary-dark);
}

.btn-remove {
  padding: 0.5rem 0.75rem;
  background-color: #f44;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-remove:hover {
  background-color: #d32f2f;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: linear-gradient(135deg, var(--accent) 0%, rgba(245, 230, 211, 0.5) 100%);
  padding: 1.5rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-card.confirmed {
  background: linear-gradient(135deg, #4caf50 0%, rgba(76, 175, 80, 0.2) 100%);
}

.stat-card.pending {
  background: linear-gradient(135deg, #ffc107 0%, rgba(255, 193, 7, 0.2) 100%);
}

.stat-card.declined {
  background: linear-gradient(135deg, #f44 0%, rgba(244, 67, 54, 0.2) 100%);
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.stat-number {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-dark);
}

.guests-table,
.gifts-table,
.purchases-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: linear-gradient(135deg, var(--accent) 0%, rgba(245, 230, 211, 0.5) 100%);
}

th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: var(--text-dark);
  border-bottom: 2px solid var(--border-color);
}

td {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  color: #666;
}

tbody tr:hover {
  background-color: #f9f9f9;
}

.status-badge {
  display: inline-block;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.status-badge.pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-badge.confirmed {
  background-color: #d4edda;
  color: #155724;
}

.status-badge.declined {
  background-color: #f8d7da;
  color: #721c24;
}

.link-count {
  display: inline-block;
  background: var(--accent);
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.85rem;
  margin-right: 0.5rem;
}

.link-badge {
  display: inline-block;
  background: var(--primary);
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.85rem;
  text-decoration: none;
  transition: all 0.3s ease;
}

.link-badge:hover {
  background-color: var(--primary-dark);
  text-decoration: underline;
}

.no-link {
  color: #ccc;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-content h3 {
  margin-bottom: 0.5rem;
}

.modal-subtitle {
  color: #999;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.links-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.link-item {
  display: flex;
  gap: 0.5rem;
  align-items: flex-end;
}

.link-item label {
  font-weight: 600;
  color: var(--text-dark);
  min-width: 100px;
}

.link-item input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-family: inherit;
}

.link-item input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(212, 165, 116, 0.1);
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .admin {
    padding: 1rem;
  }

  .admin-tabs {
    flex-wrap: wrap;
  }

  .tab-btn {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }

  .tab-content {
    padding: 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  table {
    font-size: 0.9rem;
  }

  th,
  td {
    padding: 0.75rem;
  }

  .modal-content {
    width: 95%;
    padding: 1.5rem;
  }

  .modal-actions {
    flex-direction: column;
  }

  .modal-actions button {
    width: 100%;
  }
}
</style>
