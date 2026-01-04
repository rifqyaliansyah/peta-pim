const getApiBaseUrl = () => {
    const config = useRuntimeConfig();
    return config.public.apiBaseUrl;
};

export const authService = {
    async login(credentials) {
        const API_BASE_URL = getApiBaseUrl();
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login gagal');
            }

            if (!data.success) {
                throw new Error(data.message || 'Login gagal');
            }

            return data;
        } catch (error) {
            throw error;
        }
    },

    async register(userData) {
        const API_BASE_URL = getApiBaseUrl();
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registrasi gagal');
            }

            if (!data.success) {
                throw new Error(data.message || 'Registrasi gagal');
            }

            return data;
        } catch (error) {
            throw error;
        }
    },

    async getProfile() {
        return await this.authenticatedRequest('/auth/me', {
            method: 'GET'
        });
    },

    async updateProfile(name) {
        return await this.authenticatedRequest('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify({ name })
        });
    },

    async authenticatedRequest(url, options = {}) {
        const API_BASE_URL = getApiBaseUrl();
        const token = localStorage.getItem('token');

        const response = await fetch(`${API_BASE_URL}${url}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                ...options.headers,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Request gagal');
        }

        return data;
    },
};