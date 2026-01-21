import { Guest, Gift } from '../stores/weddingStore'

export const initialGuests: Omit<Guest, 'id' | 'createdAt'>[] = [
  {
    name: 'João Silva',
    whatsapp: '(11) 98765-4321',
    email: 'joao@email.com',
    adultsCount: 1,
    childrenCount: 0,
    status: 'pending'
  },
  {
    name: 'Maria Santos',
    whatsapp: '(11) 99876-5432',
    email: 'maria@email.com',
    adultsCount: 1,
    childrenCount: 1,
    status: 'pending'
  },
  {
    name: 'Carlos Oliveira',
    whatsapp: '(11) 97654-3210',
    email: 'carlos@email.com',
    adultsCount: 2,
    childrenCount: 0,
    status: 'pending'
  },
  {
    name: 'Ana Costa',
    whatsapp: '(11) 96543-2109',
    email: 'ana@email.com',
    adultsCount: 1,
    childrenCount: 0,
    status: 'pending'
  },
  {
    name: 'Pedro Ferreira',
    whatsapp: '(11) 95432-1098',
    email: 'pedro@email.com',
    adultsCount: 1,
    childrenCount: 2,
    status: 'pending'
  }
]

export const initialGifts: Omit<Gift, 'id' | 'createdAt'>[] = [
  {
    title: 'Jogo de Cama 200 Fios',
    value: 250.00,
    category: 'Cama e Banho',
    description: 'Jogo de cama queen size 200 fios 100% algodão'
  },
  {
    title: 'Toalhas de Banho Premium',
    value: 150.00,
    category: 'Cama e Banho',
    description: 'Conjunto com 4 toalhas de banho premium'
  },
  {
    title: 'Jogo de Panelas Antiaderente',
    value: 300.00,
    category: 'Cozinha',
    description: 'Jogo com 5 panelas antiaderente com tampas'
  },
  {
    title: 'Jogo de Talheres Inox',
    value: 180.00,
    category: 'Cozinha',
    description: 'Jogo de talheres inox 24 peças'
  },
  {
    title: 'Jogo de Pratos Porcelana',
    value: 220.00,
    category: 'Mesa e Banho',
    description: 'Jogo de pratos porcelana 12 peças'
  },
  {
    title: 'Cortinas Blackout',
    value: 280.00,
    category: 'Quarto',
    description: 'Par de cortinas blackout 2,80m x 2,40m'
  },
  {
    title: 'Luminária de Cabeceira',
    value: 120.00,
    category: 'Quarto',
    description: 'Luminária de cabeceira com 3 níveis de iluminação'
  },
  {
    title: 'Tapete Persa',
    value: 350.00,
    category: 'Sala',
    description: 'Tapete persa 2,5m x 3,5m'
  },
  {
    title: 'Espelho Decorativo',
    value: 200.00,
    category: 'Sala',
    description: 'Espelho decorativo com moldura em madeira'
  },
  {
    title: 'Almofadas Decorativas',
    value: 100.00,
    category: 'Sala',
    description: 'Conjunto com 4 almofadas decorativas'
  }
]

export const initializeData = () => {
  const existingGuests = localStorage.getItem('guests')
  const existingGifts = localStorage.getItem('gifts')

  if (!existingGuests || JSON.parse(existingGuests).length === 0) {
    localStorage.setItem('guests', JSON.stringify(initialGuests.map((g, i) => ({
      ...g,
      id: `guest-${i}`,
      createdAt: new Date().toISOString()
    }))))
  }

  if (!existingGifts || JSON.parse(existingGifts).length === 0) {
    localStorage.setItem('gifts', JSON.stringify(initialGifts.map((g, i) => ({
      ...g,
      id: `gift-${i}`,
      createdAt: new Date().toISOString()
    }))))
  }
}
