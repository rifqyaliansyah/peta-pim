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
                        <div class="stat-value text-2xl">0</div>
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
                        <input type="text" :value="authStore.user?.id" class="input input-bordered w-full" readonly />
                    </div>

                    <div class="form-control">
                        <label class="label">
                            <span class="label-text font-semibold mb-1">Email</span>
                        </label>
                        <input type="text" :value="authStore.user?.email" class="input input-bordered w-full"
                            readonly />
                    </div>

                    <div class="form-control">
                        <label class="label">
                            <span class="label-text font-semibold mb-1">Nama</span>
                        </label>
                        <input type="text" :value="authStore.user?.name" class="input input-bordered w-full"
                            readonly />
                    </div>
                </div>

                <div class="space-y-2 pt-4">
                    <button @click="handleLogout" class="btn btn-error w-full">
                        <LogOut :size="18" />
                        Logout
                    </button>
                </div>
            </div>
        </div>
    </dialog>
</template>

<script setup>
import { computed } from 'vue';
import { X, LogOut } from 'lucide-vue-next';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();

const avatarInitial = computed(() => {
    return authStore.user?.name?.charAt(0).toUpperCase() || 'U';
});

const joinDate = computed(() => {
    if (!authStore.user?.created_at) return '-';
    const date = new Date(authStore.user.created_at);
    return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
});

const closeModal = () => {
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