<template>
  <div class="carrinho">
    <div class="container">
      <h1>Meu Carrinho</h1>

      <div class="content">
        <div v-if="store.cart.length === 0" class="empty-cart">
          <p>Seu carrinho está vazio.</p>
          <router-link to="/presentes" class="btn btn-primary">
            Voltar para Presentes
          </router-link>
        </div>

        <div v-else>
          <div class="cart-items">
            <div v-for="item in cartItems" :key="item.giftId" class="cart-item">
              <div class="item-info">
                <h3>{{ item.title }}</h3>
                <p class="price">R$ {{ formatPrice(item.value) }}</p>
              </div>
              <div class="item-quantity">
                <button @click="decrementQuantity(item.giftId)" class="qty-btn">−</button>
                <span>{{ item.quantity }}</span>
                <button @click="incrementQuantity(item.giftId)" class="qty-btn">+</button>
              </div>
              <div class="item-total">
                <p>R$ {{ formatPrice(item.value * item.quantity) }}</p>
              </div>
              <button @click="removeFromCart(item.giftId)" class="btn-remove">✕</button>
            </div>
          </div>

          <div class="cart-summary">
            <div class="summary-row">
              <span>Subtotal:</span>
              <span>R$ {{ formatPrice(store.cartTotal) }}</span>
            </div>
            <div class="summary-row total">
              <span>Total:</span>
              <span>R$ {{ formatPrice(store.cartTotal) }}</span>
            </div>
          </div>

          <div class="checkout-section">
            <h2>Finalizar Compra</h2>

            <form @submit.prevent="submitCheckout" class="checkout-form">
              <div class="form-group">
                <label for="name">Nome Completo:</label>
                <input v-model="checkoutData.name" type="text" id="name" placeholder="Seu nome completo" required />
              </div>

              <div class="form-group">
                <label for="whatsapp">WhatsApp:</label>
                <input v-model="checkoutData.whatsapp" type="tel" id="whatsapp" placeholder="(11) 99999-9999"
                  required />
              </div>

              <div class="payment-method">
                <h3>Forma de Pagamento</h3>
                <div class="method-options">
                  <label class="method-option">
                    <input v-model="checkoutData.paymentMethod" type="radio" value="pix" />
                    <span>Pix</span>
                  </label>
                  <label class="method-option">
                    <input v-model="checkoutData.paymentMethod" type="radio" value="link" />
                    <span>Link de Pagamento</span>
                  </label>
                  <label class="method-option">
                    <input v-model="checkoutData.paymentMethod" type="radio" value="manual" />
                    <span>Comprar em Loja e Entregar</span>
                  </label>
                </div>
              </div>
              <button type="submit" class="btn btn-primary btn-large">
                Continuar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para Pix -->
    <div v-if="showPixModal" class="modal-overlay" @click="closePixModal">
      <div class="modal" @click.stop>
        <button class="modal-close" @click="closePixModal">✕</button>
        <h2>Pagamento via Pix</h2>
        <div class="pix-content">
          <div class="pix-info">
            <h3>Dados para pagamento via Pix</h3>
            <p><strong>Valor Total:</strong> R$ {{ formatPrice(store.cartTotal) }}</p>
            <p><strong>Chave Pix:</strong> {{ store.weddingInfo.pixKey || 'Não configurada' }}</p>
            <p><strong>Nome:</strong> Rebeca Silva Alves</p>
            <p><strong>Banco:</strong> Nubank</p>
          </div>
          <div class="pix-dados-container">
            <div class="pix-orientacao">
              <p>Após realizar o pagamento, por favor, nos envie o comprovante via WhatsApp.</p>
            </div>
            <div class="pix-botoes" style="margin-top:1.5rem;display:flex;gap:1rem;">
              <a href="https://wa.me/5577988289651" target="_blank" class="btn btn-primary">Enviar comprovante no
                WhatsApp</a>
              <button @click="closePixModal" class="btn btn-outline">Cancelar</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para Links de Pagamento -->
    <div v-if="showLinksModal" class="modal-overlay" @click="closeLinksModal">
      <div class="modal" @click.stop>
        <button class="modal-close" @click="closeLinksModal">✕</button>
        <h2>Pagamento via Link</h2>
        <div class="links-content">
          <p>Agora o pagamento via link é feito diretamente pelo WhatsApp. Clique abaixo para ser redirecionado e
            finalizar sua compra.</p>
          <div class="modal-actions">
            <a href="https://wa.me/5577988289651" target="_blank" class="btn btn-primary">
              Ir para o WhatsApp
            </a>
            <button @click="closeLinksModal" class="btn btn-outline">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Sucesso -->
    <div v-if="showSuccessModal" class="modal-overlay" @click="closeSuccessModal">
      <div class="modal" @click.stop>
        <h2>✓ Obrigado!</h2>
        <div class="success-content">
          <p>Obrigado por escolher nossos presentes! Estamos muito felizes com sua contribuição.</p>
          <p v-if="checkoutData.paymentMethod === 'pix'" class="pix-instruction">
            Seu pagamento foi registrado. Assim que recebermos a confirmação do banco, enviaremos uma mensagem para
            você.
          </p>
          <p v-else-if="checkoutData.paymentMethod === 'link'" class="link-instruction">
            Você será redirecionado para o WhatsApp para finalizar o pagamento. Muito obrigado!
          </p>
          <p v-else class="manual-instruction">
            Você receberá um contato nosso para combinar a entrega do presente. Muito obrigado!
          </p>
          <router-link to="/" class="btn btn-primary">
            Voltar ao Início
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useWeddingStore } from '../stores/weddingStore'
import { RouterLink } from 'vue-router'

const store = useWeddingStore()

const checkoutData = ref({
  name: '',
  whatsapp: '',
  paymentMethod: 'pix' as 'pix' | 'link' | 'manual'
})

const showPixModal = ref(false)
const showLinksModal = ref(false)
const showSuccessModal = ref(false)
const pixPago = ref(false)
const selectedLinks = ref<Record<number, string>>({})

const cartItems = computed(() => {
  return store.cart.map(item => {
    const gift = store.gifts.find(g => g.id === item.giftId)
    return {
      giftId: item.giftId,
      title: gift?.title || 'Presente',
      value: gift?.value || 0,
      quantity: item.quantity
    }
  })
})

const hasAvailableLinks = computed(() => {
  return cartItems.value.some((item, index) => getAvailableLinksForItem(index).length > 0)
})

const formatPrice = (value: number) => {
  return value.toFixed(2).replace('.', ',')
}

const incrementQuantity = (giftId: string) => {
  store.updateCartItemQuantity(giftId,
    (store.cart.find(item => item.giftId === giftId)?.quantity || 0) + 1
  )
}

const decrementQuantity = (giftId: string) => {
  const item = store.cart.find(item => item.giftId === giftId)
  if (item && item.quantity > 1) {
    store.updateCartItemQuantity(giftId, item.quantity - 1)
  }
}

const removeFromCart = (giftId: string) => {
  store.removeFromCart(giftId)
}



const getAvailableLinksForItem = (itemIndex: number) => {
  const item = cartItems.value[itemIndex]
  const gift = store.gifts.find(g => g.id === item.giftId)
  return gift?.paymentLinks || []
}

const selectPaymentLink = (itemIndex: number, link: string) => {
  selectedLinks.value[itemIndex] = link
}

const submitCheckout = async () => {
  if (checkoutData.value.paymentMethod === 'pix') {
    showPixModal.value = true
  } else if (checkoutData.value.paymentMethod === 'link') {
    showLinksModal.value = true
  } else {
    confirmManualPayment()
  }
}

const confirmManualPayment = () => {
  savePayment()
  showSuccessModal.value = true
}

const savePayment = () => {
  store.cart.forEach(item => {
    const gift = store.gifts.find(g => g.id === item.giftId)
    if (gift) {
      store.addPurchase({
        guestName: checkoutData.value.name,
        guestWhatsapp: checkoutData.value.whatsapp,
        giftId: item.giftId,
        giftTitle: gift.title,
        quantity: item.quantity,
        totalValue: gift.value * item.quantity,
        paymentMethod: checkoutData.value.paymentMethod,
        status: checkoutData.value.paymentMethod === 'pix' ? 'pending' : 'completed'
      })
    }
  })
  store.clearCart()
}

const savePaymentWithLinks = () => {
  store.cart.forEach((item, index) => {
    const gift = store.gifts.find(g => g.id === item.giftId)
    if (gift) {
      store.addPurchase({
        guestName: checkoutData.value.name,
        guestWhatsapp: checkoutData.value.whatsapp,
        giftId: item.giftId,
        giftTitle: gift.title,
        quantity: item.quantity,
        totalValue: gift.value * item.quantity,
        paymentMethod: checkoutData.value.paymentMethod,
        status: 'completed'
      })
    }
  })
  store.clearCart()
}

const closePixModal = () => {
  showPixModal.value = false
}

const closeLinksModal = () => {
  showLinksModal.value = false
  selectedLinks.value = {}
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
  checkoutData.value = {
    name: '',
    whatsapp: '',
    paymentMethod: 'pix'
  }
}

onMounted(() => {
  store.loadData()
})
function copyToClipboard(link: string) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(link)
      .then(() => alert('Link copiado!'))
      .catch(() => alert('Não foi possível copiar o link.'))
  } else {
    // Fallback para navegadores antigos
    const tempInput = document.createElement('input')
    tempInput.value = link
    document.body.appendChild(tempInput)
    tempInput.select()
    document.execCommand('copy')
    document.body.removeChild(tempInput)
    alert('Link copiado!')
  }
}
</script>

<style scoped>
.carrinho {
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #f5f5f5 0%, #fafafa 100%);
  min-height: calc(100vh - 200px);
}

.container {
  max-width: 900px;
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

.empty-cart {
  text-align: center;
  padding: 3rem;
  color: #999;
}

.empty-cart p {
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.cart-items {
  margin-bottom: 2rem;
}

.cart-item {
  display: grid;
  grid-template-columns: 1fr auto auto auto 40px;
  gap: 1rem;
  align-items: center;
  padding: 1.5rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  margin-bottom: 1rem;
}

.item-info h3 {
  margin-bottom: 0.5rem;
  color: var(--text-dark);
}

.price {
  color: var(--primary);
  font-weight: 600;
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f5f5f5;
  padding: 0.5rem;
  border-radius: 8px;
}

.qty-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}

.qty-btn:hover {
  background: var(--primary);
  color: white;
}

.item-total {
  text-align: right;
  font-weight: 600;
  color: var(--text-dark);
}

.btn-remove {
  background: #fee;
  color: #f44;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-remove:hover {
  background: #f44;
  color: white;
}

.cart-summary {
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.summary-row.total {
  border-top: 2px solid var(--border-color);
  padding-top: 1rem;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--primary);
}

.checkout-section {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 2px solid var(--border-color);
}

.checkout-section h2 {
  margin-bottom: 2rem;
  color: var(--text-dark);
}

.checkout-form {
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

input[type="text"],
input[type="tel"] {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
}

input[type="text"]:focus,
input[type="tel"]:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(212, 165, 116, 0.1);
}

.payment-method {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f9f9f9;
  border-radius: 8px;
}

.payment-method h3 {
  margin-bottom: 1rem;
  color: var(--text-dark);
}

.method-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.method-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-weight: 500;
}

.method-option input[type="radio"] {
  cursor: pointer;
}

.btn {
  padding: 0.75rem 1.5rem;
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

.btn-primary:hover {
  background-color: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(212, 165, 116, 0.3);
}

.btn-large {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
}

.btn-outline {
  background: transparent;
  border: 2px solid var(--border-color);
  color: var(--text-dark);
}

.btn-outline:hover {
  background: #f9f9f9;
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

.modal {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
}

.modal-close:hover {
  color: var(--text-dark);
}

.modal h2 {
  margin-bottom: 1.5rem;
  color: var(--text-dark);
}

.pix-content,
.links-content,
.success-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.pix-info {
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
}

.pix-info p {
  margin: 0.5rem 0;
  color: var(--text-dark);
}

.qr-code-container {
  text-align: center;
}

.qr-code-container p {
  margin-bottom: 1rem;
  color: #666;
}

.qr-code {
  max-width: 300px;
  width: 100%;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  padding: 1rem;
  background: white;
}

.pix-error,
.links-error {
  background: #fff3cd;
  border: 1px solid #ffc107;
  padding: 1rem;
  border-radius: 8px;
  color: #856404;
}

.links-subtitle {
  color: #666;
  font-weight: 500;
  margin-bottom: 1rem;
}

.links-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.link-item {
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
}

.item-name {
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 0.75rem;
}

.link-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.btn-link {
  padding: 0.5rem 1rem;
  background: white;
  border: 2px solid var(--border-color);
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-link:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.btn-link.selected {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.success-content {
  text-align: center;
}

.success-content p {
  color: #666;
  margin-bottom: 1rem;
}

.pix-instruction,
.link-instruction,
.manual-instruction {
  background: #f0f8ff;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid var(--primary);
  color: var(--text-dark) !important;
}

@media (max-width: 768px) {
  .carrinho {
    padding: 2rem 1rem;
  }

  .cart-item {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .item-quantity,
  .item-total {
    width: 100%;
  }

  .modal {
    width: 95%;
    padding: 1.5rem;
  }

  .modal-actions {
    flex-direction: column;
  }

  .modal-actions .btn {
    width: 100%;
  }

  .link-options {
    justify-content: space-between;
  }

  .btn-link {
    flex: 1;
    min-width: 80px;
  }
}
</style>
