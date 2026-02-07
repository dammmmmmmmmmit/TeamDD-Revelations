import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth APIs
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getMe: () => api.get('/auth/me')
};

// Event APIs
export const eventAPI = {
    getAll: (params) => api.get('/events', { params }),
    getById: (id) => api.get(`/events/${id}`),
    getMy: () => api.get('/events/my'),
    create: (data) => api.post('/events', data),
    updateStatus: (id, status) => api.patch(`/events/${id}/status`, { status }),
    getParticipants: (id) => api.get(`/events/${id}/participants`)
};

// Registration APIs
export const registrationAPI = {
    register: (eventId) => api.post('/registrations', { eventId }),
    getMy: () => api.get('/registrations/my'),
    cancel: (eventId) => api.delete(`/registrations/${eventId}`)
};

// Theme APIs
export const themeAPI = {
    get: () => api.get('/theme'),
    update: (data) => api.patch('/theme', data)
};

export default api;
