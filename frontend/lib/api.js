const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

class ApiClient {
  constructor() {
    this.token = null
  }

  setToken(token) {
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token)
    }
  }

  getToken() {
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem('token')
    }
    return this.token
  }

  clearToken() {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
    }
  }

  async request(endpoint, options = {}) {
    const token = this.getToken()

    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    })

    if (res.status === 401) {
      this.clearToken()
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
      throw new Error('Unauthorized')
    }

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: 'Request failed' }))
      throw new Error(error.detail || `API Error: ${res.status}`)
    }

    return res.json()
  }

  // Auth
  async login(email, password) {
    const data = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    this.setToken(data.token)
    return data
  }

  async register(email, name, password) {
    const data = await this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, name, password }),
    })
    this.setToken(data.token)
    return data
  }

  async getMe() {
    return this.request('/api/auth/me')
  }

  // Classes
  async getTodaysClasses() {
    return this.request('/api/classes/today')
  }

  async getAllClasses() {
    return this.request('/api/classes/')
  }

  async getClassDetail(id) {
    return this.request(`/api/classes/${id}`)
  }

  async getHeadcount(classId) {
    return this.request(`/api/classes/${classId}/headcount`)
  }

  // Check-in
  async checkInWithQR(qrCode) {
    return this.request('/api/checkin/qr', {
      method: 'POST',
      body: JSON.stringify({ qr_code: qrCode }),
    })
  }

  async getCheckinStatus(classId) {
    return this.request(`/api/checkin/status/${classId}`)
  }

  // Location
  async updateLocation(lat, lng, buildingId) {
    return this.request('/api/location/update', {
      method: 'POST',
      body: JSON.stringify({ lat, lng, building_id: buildingId }),
    })
  }

  async getFriendsLocations() {
    return this.request('/api/location/friends')
  }

  async getBuildingOccupancy() {
    return this.request('/api/location/buildings')
  }

  // Emergency
  async sendEmergencyAlert(lat, lng, message) {
    return this.request('/api/emergency/alert', {
      method: 'POST',
      body: JSON.stringify({ lat, lng, message }),
    })
  }

  async getEmergencyContacts() {
    return this.request('/api/emergency/contacts')
  }
}

export const api = new ApiClient()
