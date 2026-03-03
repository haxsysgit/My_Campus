const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

class ApiClient {
  private token: string | null = null

  setToken(token: string) {
    this.token = token
    localStorage.setItem('token', token)
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('token')
    }
    return this.token
  }

  clearToken() {
    this.token = null
    localStorage.removeItem('token')
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
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
      window.location.href = '/'
      throw new Error('Unauthorized')
    }

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: 'Request failed' }))
      throw new Error(error.detail || `API Error: ${res.status}`)
    }

    return res.json()
  }

  // Auth
  async login(email: string, password: string) {
    const data = await this.request<{ user: any; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    this.setToken(data.token)
    return data
  }

  async register(email: string, name: string, password: string) {
    const data = await this.request<{ user: any; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, name, password }),
    })
    this.setToken(data.token)
    return data
  }

  async getMe() {
    return this.request<any>('/api/auth/me')
  }

  // Classes
  async getTodaysClasses() {
    return this.request<any[]>('/api/classes/today')
  }

  async getClassDetail(id: string) {
    return this.request<any>(`/api/classes/${id}`)
  }

  // Check-in
  async checkInWithQR(qrCode: string) {
    return this.request<any>('/api/checkin/qr', {
      method: 'POST',
      body: JSON.stringify({ qr_code: qrCode }),
    })
  }

  // Location
  async updateLocation(lat: number, lng: number, buildingId?: string) {
    return this.request<any>('/api/location/update', {
      method: 'POST',
      body: JSON.stringify({ lat, lng, building_id: buildingId }),
    })
  }

  async getFriendsLocations() {
    return this.request<{ friends: any[] }>('/api/location/friends')
  }

  // Emergency
  async sendEmergencyAlert(lat: number, lng: number, message?: string) {
    return this.request<any>('/api/emergency/alert', {
      method: 'POST',
      body: JSON.stringify({ lat, lng, message }),
    })
  }
}

export const api = new ApiClient()
