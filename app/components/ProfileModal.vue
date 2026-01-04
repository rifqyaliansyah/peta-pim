<template>
    <dialog id="profile_modal" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box max-w-md no-scrollbar">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-bold">Profile</h3>
                <button @click="closeModal" class="btn btn-sm btn-circle btn-ghost">
                    <X :size="20" />
                </button>
            </div>

            <div class="space-y-6">
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
                        <div class="stat-title text-xs">Dibuat</div>
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
                            :class="{ 'input-error': nameError }" @input="nameError = ''" />
                        <label v-if="nameError" class="label">
                            <span class="label-text-alt text-error">{{ nameError }}</span>
                        </label>
                    </div>

                    <div class="form-control">
                        <label class="label">
                            <span class="label-text font-semibold mb-1">Email</span>
                        </label>
                        <input type="text" :value="authStore.user?.email" class="input input-bordered w-full"
                            disabled />
                    </div>
                </div>

                <div class="space-y-2 pt-4">
                    <button @click="handleUpdateProfile" class="btn btn-primary w-full"
                        :disabled="isUpdating || !hasNameChanged">
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
import { ref, computed, watch, onMounted } from 'vue';
import { X, LogOut } from 'lucide-vue-next';
import { useAuthStore } from '~/stores/auth';
import { authService } from '~/services/authService';

const authStore = useAuthStore();

const editableName = ref('');
const nameError = ref('');
const isUpdating = ref(false);
const totalStories = ref(0);

watch(() => authStore.user?.name, (newName) => {
    if (newName) {
        editableName.value = newName;
    }
}, { immediate: true });

const hasNameChanged = computed(() => {
    return editableName.value !== authStore.user?.name && editableName.value.trim().length > 0;
});

const joinDate = computed(() => {
    if (!authStore.user?.created_at) {
        console.log('created_at kosong:', authStore.user);
        return '-';
    }

    try {
        const date = new Date(authStore.user.created_at);

        if (isNaN(date.getTime())) {
            console.log('Invalid date:', authStore.user.created_at);
            return '-';
        }

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

onMounted(() => {
    fetchTotalStories();
});

const handleUpdateProfile = async () => {
    if (!editableName.value || editableName.value.trim().length === 0) {
        nameError.value = 'Nama tidak boleh kosong';
        return;
    }

    if (editableName.value.trim().length < 3) {
        nameError.value = 'Nama minimal 3 karakter';
        return;
    }

    isUpdating.value = true;
    nameError.value = '';

    try {
        const response = await authService.authenticatedRequest('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify({ name: editableName.value.trim() })
        });

        if (response.success) {
            authStore.setAuth({
                user: response.data.user,
                token: authStore.token
            });

            alert('Profile berhasil diupdate!');
        }
    } catch (error) {
        nameError.value = error.message || 'Gagal update profile';
    } finally {
        isUpdating.value = false;
    }
};

const closeModal = () => {
    editableName.value = authStore.user?.name || '';
    nameError.value = '';
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