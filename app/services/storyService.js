const getApiBaseUrl = () => {
    const config = useRuntimeConfig();
    return config.public.apiBaseUrl;
};

const getAuthToken = () => {
    if (process.client) {
        return localStorage.getItem('token');
    }
    return null;
};

export const storyService = {
    async getAllStories() {
        try {
            const API_BASE_URL = getApiBaseUrl();
            const response = await fetch(`${API_BASE_URL}/stories/map`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Gagal mengambil data cerita');
            }

            if (!data.success) {
                throw new Error(data.message || 'Gagal mengambil data cerita');
            }

            return data;
        } catch (error) {
            throw error;
        }
    },

    async createStory(storyData) {
        try {
            const API_BASE_URL = getApiBaseUrl();
            const token = getAuthToken();

            if (!token) {
                throw new Error('Anda harus login terlebih dahulu');
            }

            const response = await fetch(`${API_BASE_URL}/stories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(storyData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Gagal menambahkan cerita');
            }

            if (!data.success) {
                throw new Error(data.message || 'Gagal menambahkan cerita');
            }

            return data;
        } catch (error) {
            throw error;
        }
    },

    async incrementView(storyId) {
        try {
            const API_BASE_URL = getApiBaseUrl();
            const response = await fetch(`${API_BASE_URL}/stories/${storyId}/view`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Failed to increment view:', data.message);
                return null;
            }

            return data;
        } catch (error) {
            console.error('Failed to increment view:', error);
            return null;
        }
    },

    async getMyStories() {
        try {
            const API_BASE_URL = getApiBaseUrl();
            const token = getAuthToken();

            if (!token) {
                throw new Error('Anda harus login terlebih dahulu');
            }

            const response = await fetch(`${API_BASE_URL}/stories/my-stories`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Gagal mengambil cerita Anda');
            }

            if (!data.success) {
                throw new Error(data.message || 'Gagal mengambil cerita Anda');
            }

            return data;
        } catch (error) {
            throw error;
        }
    },
    
    async getStats() {
        try {
            const API_BASE_URL = getApiBaseUrl();
            const response = await fetch(`${API_BASE_URL}/stories/stats`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Gagal mengambil statistik');
            }

            if (!data.success) {
                throw new Error(data.message || 'Gagal mengambil statistik');
            }

            return data;
        } catch (error) {
            throw error;
        }
    },

    async deleteStory(storyId) {
        try {
            const API_BASE_URL = getApiBaseUrl();
            const token = getAuthToken();

            if (!token) {
                throw new Error('Anda harus login terlebih dahulu');
            }

            const response = await fetch(`${API_BASE_URL}/stories/${storyId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Gagal menghapus cerita');
            }

            if (!data.success) {
                throw new Error(data.message || 'Gagal menghapus cerita');
            }

            return data;
        } catch (error) {
            throw error;
        }
    },

    async updateStory(storyId, storyData) {
        try {
            const API_BASE_URL = getApiBaseUrl();
            const token = getAuthToken();

            if (!token) {
                throw new Error('Anda harus login terlebih dahulu');
            }

            const response = await fetch(`${API_BASE_URL}/stories/${storyId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(storyData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Gagal mengupdate cerita');
            }

            if (!data.success) {
                throw new Error(data.message || 'Gagal mengupdate cerita');
            }

            return data;
        } catch (error) {
            throw error;
        }
    },
};