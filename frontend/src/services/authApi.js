import api from './api'

// Al login accettiamo sia username che email come identificatore (vedi AuthService lato BE).
export const login = (identifier, password) =>
  api.post('/api/auth/login', { username: identifier, password })

export const register = (nome, cognome, email, username, password, balance) =>
  api.post('/api/users', { nome, cognome, username, email, password, balance })

export const verifyCode = (code) => api.post('/api/users/confirm', null, { params: { token: code } })

export const resendCode = (email) => api.post('/api/auth/resend-code', { email })

export const forgotPassword = (email) =>
  api.post('/api/auth/forgot-password', { email })

export const resetPassword = (email, code, newPassword) =>
  api.post('/api/auth/reset-password', { email, code, newPassword })

export const getMe = () => api.get('/api/users/me')

export const deleteAccount = (id) => api.delete(`/api/users/${id}`)
