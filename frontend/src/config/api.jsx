export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

// Headers for authenticated requests (admin writes require the JWT)
export const authHeaders = (extra = {}) => ({
  ...extra,
  'Authorization': `Bearer ${localStorage.getItem('token')}`
})
