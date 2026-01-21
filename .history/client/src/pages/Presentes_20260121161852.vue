<template>
  <div class="presentes">
    <div class="container">
      <h1>Lista de Presentes</h1>
      
      <div class="content">
        <div class="filters">
          <div class="search-box">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar presentes..."
              class="search-input"
            />
          </div>
          
          <div class="category-filter">
            <button
              v-for="cat in categories"
              :key="cat"
              @click="selectedCategory = selectedCategory === cat ? '' : cat"
              :class="['category-btn', { active: selectedCategory === cat }]"
            >
              {{ cat }}
            </button>
          </div>
        </div>
      

        <div v-if="filteredGifts.length === 0" class="no-gifts">
          <p>Nenhum presente encontrado. Volte mais tarde!</p>
        </div>

        <div v-else class="gifts-grid">
          <div v-for="gift in filteredGifts" :key="gift.id" class="gift-card">
            <div class="gift-image">
              <img v-if="gift.image" :src="gift.image" :alt="gift.title" />
              <div v-else class="no-image">
                <span>🎁</span>
              </div>
            </div>
            <div class="gift-info">
              <h3>{{ gift.title }}</h3>
              <p class="category">{{ gift.category }}</p>
              <p v-if="gift.description" class="description">{{ gift.description }}</p>
              <p class="value">R$ {{ formatPrice(gift.value) }}</p>
            </div>
            <div class="gift-actions">
              <div class="quantity-selector">
                <button @click="decrementQuantity(gift.id)" class="qty-btn">−</button>
                <input
                  v-model.number="quantities[gift.id]"
                  type="number"
                  min="0"
                  class="qty-input"
                />
                <button @click="incrementQuantity(gift.id)" class="qty-btn">+</button>
              </div>
              <button
                @click="addToCart(gift.id)"
                :disabled="quantities[gift.id] === 0"
                class="btn btn-primary"
              >
                Adicionar ao Carrinho
              </button>
              <button v-if="auth.isAdminLoggedIn" @click="openEditGift(gift)" class="btn btn-outline" style="margin-top:8px;">Editar</button>
            </div>
          </div>
        </div>
        <button v-if="auth.isAdminLoggedIn" @click="openEditGift(null)" class="btn btn-primary" style="margin-bottom:2rem;">Adicionar Presente</button>
        <div v-if="showGiftModal" class="modal-overlay">
          <div class="modal gift-modal">
            <h2 class="modal-title">{{ editingGift && editingGift.id ? 'Editar Presente' : 'Adicionar Presente' }}</h2>
            <form @submit.prevent="saveGift" class="modal-form">
              <div class="modal-fields">
                <div class="form-group">
                  <label>Título</label>
                  <input v-model="giftForm.title" required />
                </div>
                <div class="form-group">
                  <label>Categoria</label>
                  <input v-model="giftForm.category" required />
                </div>
                <div class="form-group">
                  <label>Descrição</label>
                  <textarea v-model="giftForm.description" rows="2"></textarea>
                </div>
                <div class="form-group">
                  <label>Valor (R$)</label>
                  <input v-model.number="giftForm.value" type="number" min="0" required />
                </div>
                <div class="form-group">
                  <label>Imagem</label>
                  <input type="file" accept="image/*" @change="onImageChange" />
                  <div v-if="giftForm.image" class="image-preview">
                    <img :src="giftForm.image" alt="Prévia da imagem" />
                  </div>
                </div>
              </div>
              <div class="modal-actions">
                <button type="submit" class="btn btn-primary">Salvar</button>
                <button type="button" class="btn btn-outline" @click="closeGiftModal">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
        </div>

        <div class="cart-summary">
          <div class="summary-card">
            <h3>Resumo do Carrinho</h3>
            <p>Itens: <strong>{{ store.cartItemsCount }}</strong></p>
            <p>Total: <strong>R$ {{ formatPrice(store.cartTotal) }}</strong></p>
            <router-link to="/carrinho" class="btn btn-primary btn-full">
              Ver Carrinho
            </router-link>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { useWeddingStore } from '../stores/weddingStore'
import { RouterLink } from 'vue-router'

const store = useWeddingStore()

const searchQuery = ref('')
const selectedCategory = ref('')
const quantities = ref<Record<string, number>>({})

const categories = computed(() => {
  const cats = new Set(store.gifts.map(g => g.category))
  return Array.from(cats)
})

const filteredGifts = computed(() => {
  return store.gifts.filter(gift => {
    const matchesSearch = gift.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                        gift.description?.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = !selectedCategory.value || gift.category === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})

const formatPrice = (value: number) => {
  return value.toFixed(2).replace('.', ',')
}

const incrementQuantity = (giftId: string) => {
  quantities.value[giftId] = (quantities.value[giftId] || 0) + 1
}

const decrementQuantity = (giftId: string) => {
  quantities.value[giftId] = Math.max(0, (quantities.value[giftId] || 0) - 1)
}

const addToCart = (giftId: string) => {
  const quantity = quantities.value[giftId] || 0
  if (quantity > 0) {
    store.addToCart(giftId, quantity)
    quantities.value[giftId] = 0
    alert('Produto adicionado ao carrinho!')
  }
}

onMounted(() => {
  store.loadData()
  // Initialize quantities
  store.gifts.forEach(gift => {
    quantities.value[gift.id] = 0
  })
})

// Modal de edição/cadastro de presente
const showGiftModal = ref(false)
const editingGift = ref<any>(null)
const giftForm = reactive({
  id: '',
  title: '',
  category: '',
  description: '',
  value: 0,
  image: ''
})

function openEditGift(gift) {
  if (gift) {
    editingGift.value = gift
    Object.assign(giftForm, gift)
  } else {
    editingGift.value = null
    Object.assign(giftForm, { id: '', title: '', category: '', description: '', value: 0, image: '' })
  }
  showGiftModal.value = true
}

function closeGiftModal() {
  showGiftModal.value = false
}

function onImageChange(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = ev => {
    giftForm.image = ev.target.result
  }
  reader.readAsDataURL(file)
}

function saveGift() {
  if (editingGift.value && editingGift.value.id) {
    store.updateGift(editingGift.value.id, { ...giftForm })
  } else {
    store.addGift({ ...giftForm })
  }
  showGiftModal.value = false
  store.loadData()
}
</script>

<style scoped>
.presentes {
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #f5f5f5 0%, #fafafa 100%);
  min-height: calc(100vh - 200px);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  margin-bottom: 3rem;
  color: var(--text-dark);
}

.content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.filters {
  margin-bottom: 3rem;
}

.search-box {
  margin-bottom: 1.5rem;
}

.search-input {
  width: 100%;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(212, 165, 116, 0.1);
}

.category-filter {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.category-btn {
  padding: 0.5rem 1rem;
  border: 2px solid var(--border-color);
  background: white;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
}

.category-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.category-btn.active {
  background-color: var(--primary);
  color: white;
  border-color: var(--primary);
}

.no-gifts {
  text-align: center;
  padding: 3rem;
  color: #999;
}

.gifts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.gift-card {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.gift-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-5px);
}

.gift-image {
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, var(--accent) 0%, rgba(245, 230, 211, 0.5) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.gift-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  font-size: 3rem;
}

.gift-info {
  padding: 1.5rem;
  flex: 1;
}

.gift-info h3 {
  margin-bottom: 0.5rem;
  color: var(--text-dark);
  font-size: 1.2rem;
}

.category {
  font-size: 0.9rem;
  color: var(--primary);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.description {
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
}

.gift-actions {
  padding: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  background: #f5f5f5;
  border-radius: 8px;
  padding: 0.5rem;
}

.qty-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.qty-btn:hover {
  background: var(--primary);
  color: white;
}

.qty-input {
  flex: 1;
  border: none;
  background: transparent;
  text-align: center;
  font-weight: 600;
  font-size: 1rem;
}

.qty-input:focus {
  outline: none;
}

.btn {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Poppins', sans-serif;
}

.btn-primary {
  background-color: var(--primary);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--primary-dark);
}

.btn-primary:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
}

.cart-summary {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 2px solid var(--border-color);
}

.summary-card {
  background: linear-gradient(135deg, var(--accent) 0%, rgba(245, 230, 211, 0.5) 100%);
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
}

.summary-card h3 {
  margin-bottom: 1rem;
  color: var(--text-dark);
}

.summary-card p {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: #666;
}

.btn-full {
  margin-top: 1rem;
}

.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal {
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  min-width: 320px;
  max-width: 95vw;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
}


@media (max-width: 768px) {
  .gifts-grid {
    grid-template-columns: 1fr;
  }

  .category-filter {
    flex-direction: column;
  }

  .category-btn {
    width: 100%;
  }
}


</style>
