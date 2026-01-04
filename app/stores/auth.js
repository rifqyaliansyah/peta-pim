import { defineStore } from 'pinia';

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

        logout() {
            this.clearAuth();
        },
    },
});