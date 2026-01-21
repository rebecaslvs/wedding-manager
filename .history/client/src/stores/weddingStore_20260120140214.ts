import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Guest {
  id: string
  name: string
  email?: string
  whatsapp: string
  adultsCount: number
  childrenCount: number
  adultNames?: string[]
  childNames?: string[]
  status: 'pending' | 'confirmed' | 'declined'
  createdAt: string
}

export interface Gift {
  id: string
  title: string
  value: number
  category: string
  description?: string
  image?: string
  paymentLinks?: string[] // Links de pagamento para cada unidade
  createdAt: string
}

export interface CartItem {
  giftId: string
  quantity: number
}

export interface Purchase {
  id: string
  guestName: string
  guestWhatsapp: string
  giftId: string
  giftTitle: string
  quantity: number
  totalValue: number
  paymentMethod: 'pix' | 'link' | 'manual'
  paymentLink?: string // Link de pagamento utilizado
  status: 'pending' | 'completed'
  createdAt: string
}

export interface WeddingInfo {
  coupleNames: string
  date: string
  time: string
  location: string
  address: string
  pixKey?: string
}

export const useWeddingStore = defineStore('wedding', () => {
  // State
  const guests = ref<Guest[]>([])
  const gifts = ref<Gift[]>([])
  const purchases = ref<Purchase[]>([])
  const cart = ref<CartItem[]>([])
  const weddingInfo = ref<WeddingInfo>({
    coupleNames: 'Rebeca e Marcos',
    date: '14/06/2026',
    time: '18:00',
    location: 'Local do Casamento',
    address: 'Rua das Flores, 123 - Cidade, Estado',
    pixKey: ''
  })

  // Load data from localStorage
  const loadData = () => {
    const storedGuests = localStorage.getItem('guests')
    const storedGifts = localStorage.getItem('gifts')
    const storedPurchases = localStorage.getItem('purchases')
    const storedWeddingInfo = localStorage.getItem('weddingInfo')

    if (storedGuests) guests.value = JSON.parse(storedGuests)
    if (storedGifts) gifts.value = JSON.parse(storedGifts)
    if (storedPurchases) purchases.value = JSON.parse(storedPurchases)
    if (storedWeddingInfo) weddingInfo.value = JSON.parse(storedWeddingInfo)
  }

  // Save data to localStorage
  const saveData = () => {
    localStorage.setItem('guests', JSON.stringify(guests.value))
    localStorage.setItem('gifts', JSON.stringify(gifts.value))
    localStorage.setItem('purchases', JSON.stringify(purchases.value))
    localStorage.setItem('weddingInfo', JSON.stringify(weddingInfo.value))
  }

  // Guest methods
  const addGuest = (guest: Omit<Guest, 'id' | 'createdAt'>) => {
    const newGuest: Guest = {
      ...guest,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    guests.value.push(newGuest)
    saveData()
    return newGuest
  }

  const updateGuest = (id: string, updates: Partial<Guest>) => {
    const index = guests.value.findIndex(g => g.id === id)
    if (index !== -1) {
      guests.value[index] = { ...guests.value[index], ...updates }
      saveData()
    }
  }

  const deleteGuest = (id: string) => {
    guests.value = guests.value.filter(g => g.id !== id)
    saveData()
  }

  const getGuestByName = (name: string) => {
    return guests.value.find(g => g.name.toLowerCase() === name.toLowerCase())
  }

  // Gift methods
  const addGift = (gift: Omit<Gift, 'id' | 'createdAt'>) => {
    const newGift: Gift = {
      ...gift,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    gifts.value.push(newGift)
    saveData()
    return newGift
  }

  const updateGift = (id: string, updates: Partial<Gift>) => {
    const index = gifts.value.findIndex(g => g.id === id)
    if (index !== -1) {
      gifts.value[index] = { ...gifts.value[index], ...updates }
      saveData()
    }
  }

  const deleteGift = (id: string) => {
    gifts.value = gifts.value.filter(g => g.id !== id)
    saveData()
  }

  const updateGiftPaymentLinks = (id: string, paymentLinks: string[]) => {
    const index = gifts.value.findIndex(g => g.id === id)
    if (index !== -1) {
      gifts.value[index].paymentLinks = paymentLinks
      saveData()
    }
  }

  // Cart methods
  const addToCart = (giftId: string, quantity: number = 1) => {
    const existingItem = cart.value.find(item => item.giftId === giftId)
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.value.push({ giftId, quantity })
    }
  }

  const removeFromCart = (giftId: string) => {
    cart.value = cart.value.filter(item => item.giftId !== giftId)
  }

  const updateCartItemQuantity = (giftId: string, quantity: number) => {
    const item = cart.value.find(item => item.giftId === giftId)
    if (item) {
      item.quantity = Math.max(1, quantity)
    }
  }

  const clearCart = () => {
    cart.value = []
  }

  // Purchase methods
  const addPurchase = (purchase: Omit<Purchase, 'id' | 'createdAt'>) => {
    const newPurchase: Purchase = {
      ...purchase,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    purchases.value.push(newPurchase)
    saveData()
    return newPurchase
  }

  const updatePurchase = (id: string, updates: Partial<Purchase>) => {
    const index = purchases.value.findIndex(p => p.id === id)
    if (index !== -1) {
      purchases.value[index] = { ...purchases.value[index], ...updates }
      saveData()
    }
  }

  const deletePurchase = (id: string) => {
    purchases.value = purchases.value.filter(p => p.id !== id)
    saveData()
  }

  // Wedding info methods
  const updateWeddingInfo = (updates: Partial<WeddingInfo>) => {
    weddingInfo.value = { ...weddingInfo.value, ...updates }
    saveData()
  }

  // Computed properties
  const cartTotal = computed(() => {
    return cart.value.reduce((total, item) => {
      const gift = gifts.value.find(g => g.id === item.giftId)
      return total + (gift ? gift.value * item.quantity : 0)
    }, 0)
  })

  const cartItemsCount = computed(() => {
    return cart.value.reduce((count, item) => count + item.quantity, 0)
  })

  const confirmedGuests = computed(() => {
    return guests.value.filter(g => g.status === 'confirmed')
  })

  const declinedGuests = computed(() => {
    return guests.value.filter(g => g.status === 'declined')
  })

  const pendingGuests = computed(() => {
    return guests.value.filter(g => g.status === 'pending')
  })

  const totalConfirmedPeople = computed(() => {
    return confirmedGuests.value.reduce((total, guest) => {
      return total + guest.adultsCount + (guest.childrenCount > 0 ? 0 : 0)
    }, 0)
  })

  return {
    // State
    guests,
    gifts,
    purchases,
    cart,
    weddingInfo,

    // Methods
    loadData,
    saveData,
    addGuest,
    updateGuest,
    deleteGuest,
    getGuestByName,
    addGift,
    updateGift,
    deleteGift,
    updateGiftPaymentLinks,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    addPurchase,
    updatePurchase,
    deletePurchase,
    updateWeddingInfo,

    // Computed
    cartTotal,
    cartItemsCount,
    confirmedGuests,
    declinedGuests,
    pendingGuests,
    totalConfirmedPeople
  }
})
