<template>
    <dialog id="profile_modal" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box max-w-md no-scrollbar">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-bold">Profile</h3>
                <button @click="closeModal" class="btn btn-sm btn-circle btn-ghost">
                    <X :size="20" />
                </button>
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

            <!-- Error Alert -->
            <div v-if="errorMessage && !successMessage" class="alert alert-error mb-4">
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

            <div v-if="isLoadingProfile" class="flex items-center justify-center py-12">
                <div class="flex flex-col items-center gap-4">
                    <span class="loading loading-spinner loading-lg"></span>
                    <p class="text-sm opacity-60">Memuat profile...</p>
                </div>
            </div>

            <div v-else class="space-y-6">
                <div class="flex items-center gap-4">
                    <div class="flex-1">
                        <h4 class="font-bold text-lg">{{ authStore.user?.name }}</h4>
                        <p class="text-sm opacity-60">{{ authStore.user?.email }}</p>
                    </div>
                </div>

                <div class="stats stats-vertical lg:stats-horizontal shadow w-full">
                    <div class="stat">
                        <div class="stat-title text-xs">Total Cerita</div>
                        <div class="stat-value text-2xl">{{ totalStories }}</div>
                    </div>
                    <div class="stat">
                        <div class="stat-title text-xs">Akun Dibuat</div>
                        <div class="stat-value text-2xl">{{ joinDate }}</div>
                    </div>
                </div>

                <div class="space-y-3">
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text font-semibold mb-1">User ID</span>
                        </label>
                        <input type="text" :value="authStore.user?.id" class="input input-bordered w-full" disabled />
                    </div>

                    <div class="form-control">
                        <label class="label">
                            <span class="label-text font-semibold mb-1">Nama</span>
                        </label>
                        <input type="text" v-model="editableName" class="input input-bordered w-full"
                            :class="{ 'input-error': errorMessage }" @input="clearError" />
                    </div>

                    <div class="form-control">
                        <label class="label">
                            <span class="label-text font-semibold mb-1">Email</span>
                        </label>
                        <input type="text" :value="authStore.user?.email" class="input input-bordered w-full"
                            disabled />
                    </div>

                    <div class="form-control">
                        <label class="label">
                            <span class="label-text font-semibold mb-1">Password Lama</span>
                        </label>
                        <input type="password" v-model="oldPassword" placeholder="Kosongkan jika tidak ingin mengganti"
                            class="input input-bordered w-full" :class="{ 'input-error': errorMessage }"
                            @input="clearError" />
                    </div>

                    <div class="form-control">
                        <label class="label">
                            <span class="label-text font-semibold mb-1">Password Baru</span>
                        </label>
                        <input type="password" v-model="newPassword" placeholder="Minimal 6 karakter"
                            class="input input-bordered w-full" :class="{ 'input-error': errorMessage }"
                            @input="clearError" />
                    </div>
                </div>

                <div class="space-y-2 pt-4">
                    <button @click="handleUpdateProfile" class="btn btn-primary w-full"
                        :disabled="isUpdating || !hasChanges">
                        <span v-if="isUpdating" class="loading loading-spinner loading-sm"></span>
                        {{ isUpdating ? 'Menyimpan...' : 'Simpan' }}
                    </button>
                    <button @click="handleLogout" class="btn btn-error w-full" :disabled="isUpdating">
                        <LogOut :size="18" />
                        Logout
                    </button>
                </div>
            </div>
        </div>
    </dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { X, LogOut } from 'lucide-vue-next';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();

const editableName = ref('');
const oldPassword = ref('');
const newPassword = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const isUpdating = ref(false);
const isLoadingProfile = ref(false);
const totalStories = ref(0);
const modalElement = ref(null);

watch(() => authStore.user?.name, (newName) => {
    if (newName) {
        editableName.value = newName;
    }
}, { immediate: true });

const hasChanges = computed(() => {
    const nameChanged = editableName.value !== authStore.user?.name && editableName.value.trim().length > 0;
    const passwordFilled = oldPassword.value || newPassword.value;
    return nameChanged || passwordFilled;
});

const joinDate = computed(() => {
    if (!authStore.user?.created_at) return '-';

    try {
        const date = new Date(authStore.user.created_at);
        if (isNaN(date.getTime())) return '-';

        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    } catch (error) {
        console.error('Error parsing date:', error);
        return '-';
    }
});

const clearError = () => {
    errorMessage.value = '';
    successMessage.value = '';
};

const fetchProfileData = async () => {
    isLoadingProfile.value = true;
    try {
        await authStore.fetchProfile();
        await fetchTotalStories();
    } catch (error) {
        console.error('Error fetching profile data:', error);
    } finally {
        isLoadingProfile.value = false;
    }
};

const fetchTotalStories = async () => {
    try {
        const { storyService } = await import('~/services/storyService');
        const response = await storyService.getCount();
        if (response.success) {
            totalStories.value = response.data.count || 0;
        }
    } catch (error) {
        console.error('Error fetching total stories:', error);
        totalStories.value = 0;
    }
};

if (process.client) {
    setTimeout(() => {
        modalElement.value = document.getElementById('profile_modal');
        if (modalElement.value) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'open') {
                        if (modalElement.value.open) {
                            fetchProfileData();
                        }
                    }
                });
            });
            observer.observe(modalElement.value, { attributes: true });
        }
    }, 100);
}

const handleUpdateProfile = async () => {
    if (!editableName.value || editableName.value.trim().length === 0) {
        errorMessage.value = 'Nama tidak boleh kosong';
        return;
    }

    if (editableName.value.trim().length < 3) {
        errorMessage.value = 'Nama minimal 3 karakter';
        return;
    }

    if (oldPassword.value || newPassword.value) {
        if (!oldPassword.value || !newPassword.value) {
            errorMessage.value = 'Password lama dan password baru harus diisi';
            return;
        }

        if (newPassword.value.length < 6) {
            errorMessage.value = 'Password baru minimal 6 karakter';
            return;
        }
    }

    isUpdating.value = true;
    clearError();

    try {
        await authStore.updateProfile(
            editableName.value.trim(),
            oldPassword.value || null,
            newPassword.value || null
        );

        successMessage.value = oldPassword.value
            ? 'Profile dan password berhasil diperbarui!'
            : 'Profile berhasil diperbarui!';

        setTimeout(() => {
            successMessage.value = '';
            closeModal();
        }, 1000);
    } catch (error) {
        errorMessage.value = error.message || 'Gagal memperbarui profile';
    } finally {
        isUpdating.value = false;
    }
};

const closeModal = () => {
    editableName.value = authStore.user?.name || '';
    oldPassword.value = '';
    newPassword.value = '';
    clearError();
    document.getElementById('profile_modal').close();
};

const handleLogout = () => {
    if (confirm('Yakin ingin logout?')) {
        authStore.logout();
        closeModal();
        window.location.reload();
    }
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