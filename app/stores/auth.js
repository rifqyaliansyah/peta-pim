import { defineStore } from 'pinia';
import { authService } from '~/services/authService';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: null,
        isAuthenticated: false,
    }),

    getters: {
        getUser: (state) => state.user,
        getToken: (state) => state.token,
        isLoggedIn: (state) => state.isAuthenticated,
    },

    actions: {
        initAuth() {
            if (process.client) {
                const token = localStorage.getItem('token');
                const user = localStorage.getItem('user');

                if (token && user) {
                    this.token = token;
                    this.user = JSON.parse(user);
                    this.isAuthenticated = true;
                }
            }
        },

        setAuth(data) {
            this.user = data.user;
            this.token = data.token;
            this.isAuthenticated = true;

            if (process.client) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
            }
        },

        clearAuth() {
            this.user = null;
            this.token = null;
            this.isAuthenticated = false;

            if (process.client) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        },

        async fetchProfile() {
            try {
                const response = await authService.getProfile();
                if (response.success) {
                    this.user = response.data.user;

                    if (process.client) {
                        localStorage.setItem('user', JSON.stringify(response.data.user));
                    }
                }
                return response;
            } catch (error) {
                console.error('Error fetching profile:', error);
                throw error;
            }
        },

        async updateProfile(name, oldPassword = null, newPassword = null) {
            try {
                const response = await authService.updateProfile(name, oldPassword, newPassword);
                if (response.success) {
                    this.user = response.data.user;

                    if (process.client) {
                        localStorage.setItem('user', JSON.stringify(response.data.user));
                    }
                }
                return response;
            } catch (error) {
                console.error('Error updating profile:', error);
                throw error;
            }
        },

        logout() {
            this.clearAuth();
        },
    },
});