<template>
    <dialog id="auth_modal" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box max-w-md no-scrollbar">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-bold">{{ isLoginMode ? 'Login' : 'Daftar Akun' }}</h3>
                <button @click="closeModal" class="btn btn-sm btn-circle btn-ghost">
                    <X :size="20" />
                </button>
            </div>

            <!-- Error Alert -->
            <div v-if="errorMessage" class="alert alert-error mb-4">
                <div class="flex items-center gap-2 w-full">
                    <button @click="clearError" class="p-0 bg-transparent border-none cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                    <span class="flex-1">{{ errorMessage }}</span>
                </div>
            </div>

            <!-- Success Alert -->
            <div v-if="successMessage" class="alert alert-success mb-4">
                <div class="flex items-center gap-2 w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="flex-1">{{ successMessage }}</span>
                </div>
            </div>

            <!-- Login Form -->
            <div v-if="isLoginMode" class="space-y-4">
                <div class="form-control">
                    <label class="label">
                        <span class="label-text font-semibold mb-1">Email</span>
                    </label>
                    <input v-model="loginForm.email" type="email" placeholder="Email anda"
                        class="input input-bordered w-full" @input="clearError" />
                </div>

                <div class="form-control">
                    <label class="label">
                        <span class="label-text font-semibold mb-1">Password</span>
                    </label>
                    <input v-model="loginForm.password" type="password" placeholder="Password anda"
                        class="input input-bordered w-full" @input="clearError" />
                </div>

                <div class="form-control mt-6">
                    <button @click="handleLogin" class="btn btn-primary w-full" :disabled="submitting">
                        <span v-if="submitting" class="loading loading-spinner"></span>
                        {{ submitting ? 'Memproses...' : 'Login' }}
                    </button>
                </div>

                <div class="text-center mt-4">
                    <p class="text-sm">
                        Belum punya akun?
                        <button @click="toggleMode" class="link link-primary font-semibold">
                            Daftar di sini
                        </button>
                    </p>
                </div>
            </div>

            <!-- Register Form -->
            <div v-else class="space-y-4">
                <div class="form-control">
                    <label class="label">
                        <span class="label-text font-semibold mb-1">Nama</span>
                    </label>
                    <input v-model="registerForm.name" type="text" placeholder="Nama lengkap"
                        class="input input-bordered w-full" @input="clearError" />
                </div>

                <div class="form-control">
                    <label class="label">
                        <span class="label-text font-semibold mb-1">Email</span>
                    </label>
                    <input v-model="registerForm.email" type="email" placeholder="Email anda"
                        class="input input-bordered w-full" @input="clearError" />
                </div>

                <div class="form-control">
                    <label class="label">
                        <span class="label-text font-semibold mb-1">Password</span>
                    </label>
                    <input v-model="registerForm.password" type="password" placeholder="Minimal 6 karakter"
                        class="input input-bordered w-full" @input="clearError" />
                </div>

                <div class="form-control">
                    <label class="label">
                        <span class="label-text font-semibold mb-1">Confirm Password</span>
                    </label>
                    <input v-model="registerForm.confirmPassword" type="password" placeholder="Ulangi password"
                        class="input input-bordered w-full" @input="clearError" />
                </div>

                <div class="form-control mt-6">
                    <button @click="handleRegister" class="btn btn-primary w-full" :disabled="submitting">
                        <span v-if="submitting" class="loading loading-spinner"></span>
                        {{ submitting ? 'Memproses...' : 'Daftar' }}
                    </button>
                </div>

                <div class="text-center mt-4">
                    <p class="text-sm">
                        Sudah punya akun?
                        <button @click="toggleMode" class="link link-primary font-semibold">
                            Login di sini
                        </button>
                    </p>
                </div>
            </div>
        </div>
    </dialog>
</template>

<script setup>
import { ref } from 'vue';
import { X } from 'lucide-vue-next';

const isLoginMode = ref(true);
const submitting = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const loginForm = ref({
    email: '',
    password: ''
});

const registerForm = ref({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
});

const toggleMode = () => {
    isLoginMode.value = !isLoginMode.value;
    clearError();
    loginForm.value = { email: '', password: '' };
    registerForm.value = { name: '', email: '', password: '', confirmPassword: '' };
};

const clearError = () => {
    errorMessage.value = '';
};

const showSuccess = (message) => {
    successMessage.value = message;
    setTimeout(() => {
        closeModal();
    }, 1000);
};

const closeModal = () => {
    document.getElementById('auth_modal').close();
    errorMessage.value = '';
    successMessage.value = '';
    isLoginMode.value = true;
    loginForm.value = { email: '', password: '' };
    registerForm.value = { name: '', email: '', password: '', confirmPassword: '' };
};

const handleLogin = () => {
    clearError();

    if (!loginForm.value.email || !loginForm.value.password) {
        errorMessage.value = 'Email dan password harus diisi';
        return;
    }

    submitting.value = true;

    setTimeout(() => {
        submitting.value = false;
        showSuccess('Login berhasil!');
    }, 1000);
};

const handleRegister = () => {
    clearError();

    if (!registerForm.value.name || !registerForm.value.email ||
        !registerForm.value.password || !registerForm.value.confirmPassword) {
        errorMessage.value = 'Semua field harus diisi';
        return;
    }

    if (registerForm.value.password !== registerForm.value.confirmPassword) {
        errorMessage.value = 'Password tidak cocok';
        return;
    }

    if (registerForm.value.password.length < 6) {
        errorMessage.value = 'Password minimal 6 karakter';
        return;
    }

    submitting.value = true;

    setTimeout(() => {
        submitting.value = false;
        showSuccess('Registrasi berhasil!');
    }, 1000);
};
</script>

<style scoped>
.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.no-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>