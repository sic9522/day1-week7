import api from './api'

export const getTransfers = () => api.get('/api/transfers')

export const createTransfer = (sourceIban, destinationIban, amount) =>
  api.post('/api/transfers', { sourceIban, destinationIban, amount })

export const confirmTransfer = (id, code) => api.post(`/api/transfers/${id}/confirm`, { code })

export const rejectTransfer = (id) => api.post(`/api/transfers/${id}/reject`)
