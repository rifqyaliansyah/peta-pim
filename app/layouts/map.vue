<template>
    <div class="drawer lg:drawer-open">
        <input id="my-drawer-4" type="checkbox" class="drawer-toggle" />

        <div class="drawer-content">
            <nav class="navbar w-full bg-base-300 relative z-[999]">
                <div class="flex-none">
                    <label for="my-drawer-4" aria-label="open sidebar" class="btn btn-square btn-ghost">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-linejoin="round"
                            stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor"
                            class="my-1.5 inline-block size-4">
                            <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z">
                            </path>
                            <path d="M9 4v16"></path>
                            <path d="M14 10l2 2l-2 2"></path>
                        </svg>
                    </label>
                </div>
                <div class="flex-1 px-4 font-bold">Peta-Pim</div>

                <div class="flex-none mr-2">
                    <div class="dropdown dropdown-end">
                        <button tabindex="0" class="btn btn-square btn-ghost">
                            <Palette class="size-5" />
                        </button>
                        <ul tabindex="0" class="dropdown-content menu menu-sm bg-base-100 rounded-box shadow w-44 mt-2">
                            <li v-for="theme in themes" :key="theme">
                                <button @click="selectTheme(theme)" :class="{
                                    'active': currentTheme === theme,
                                    'font-semibold': currentTheme === theme
                                }">
                                    {{ themeLabel(theme) }}
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>

        <div class="drawer-side is-drawer-close:overflow-visible z-[1001]">
            <label for="my-drawer-4" aria-label="close sidebar" class="drawer-overlay"></label>
            <div class="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">

                <div class="p-4 w-full border-b border-base-300 is-drawer-close:hidden">
                    <h2 class="font-bold text-lg">Peta-Pim</h2>
                    <p class="text-xs opacity-60">Cerita random yang ada di dunia</p>
                </div>

                <ul class="menu w-full grow">
                    <li>
                        <button @click="closeDrawer" class="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                            data-tip="Jelajahi Peta">
                            <MapPin class="my-1.5 inline-block size-4" />
                            <span class="is-drawer-close:hidden">Jelajahi Peta</span>
                        </button>
                    </li>

                    <li v-if="authStore.isAuthenticated">
                        <button @click="startAddModeHandler"
                            class="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Tambah Cerita">
                            <MapPinPlus class="my-1.5 inline-block size-4" />
                            <span class="is-drawer-close:hidden">Tambah Cerita</span>
                        </button>
                    </li>

                    <li>
                        <button @click="openModal('all_stories_modal')"
                            class="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Semua Cerita">
                            <BookOpen class="my-1.5 inline-block size-4" />
                            <span class="is-drawer-close:hidden">Semua Cerita</span>
                        </button>
                    </li>


                    <li v-if="authStore.isAuthenticated">
                        <button @click="openModal('my_stories_modal')"
                            class="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Cerita Saya">
                            <Book class="my-1.5 inline-block size-4" />
                            <span class="is-drawer-close:hidden">Cerita Saya</span>
                        </button>
                    </li>

                    <li v-if="!authStore.isAuthenticated">
                        <button @click="openModal('auth_modal')"
                            class="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Login">
                            <User class="my-1.5 inline-block size-4" />
                            <span class="is-drawer-close:hidden">Login</span>
                        </button>
                    </li>

                    <li v-if="authStore.isAuthenticated">
                        <button @click="openProfileModal" class="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                            data-tip="Profile">
                            <User class="my-1.5 inline-block size-4" />
                            <span class="is-drawer-close:hidden">Profile</span>
                        </button>
                    </li>
                </ul>

                <div class="p-4 w-full border-t border-base-300 is-drawer-close:hidden">
                    <div class="text-xs opacity-60 space-y-1">
                        <div class="flex justify-between">
                            <span>Total Cerita</span>
                            <span class="font-semibold">{{ stats.total_stories }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Kontributor</span>
                            <span class="font-semibold">{{ stats.total_users }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="map-fullscreen">
        <slot />
    </div>

    <AuthModal />
    <MyStoriesModal />
    <AllStoriesModal />
    <AddStoryModal ref="addStoryModalRef" @submit="handleAddStorySubmit" />
    <ProfileModal v-if="authStore.isAuthenticated" />
</template>

<script setup>
import { MapPinPlus, Book, User, BookOpen, Palette, MapPin } from 'lucide-vue-next';
import { useAddStoryMode } from '~/composables/useAddStoryMode';
import { useAuthStore } from '~/stores/auth';
import { storyService } from '~/services/storyService';
import { ref, onMounted } from 'vue';

const authStore = useAuthStore();
const addStoryModalRef = ref(null);
const { startAddMode } = useAddStoryMode();

const stats = ref({
    total_stories: 0,
    total_users: 0
});

const themes = ['light', 'dark', 'coffee', 'cmyk', 'valentine', 'luxury'];
const currentTheme = ref('cmyk');

const selectTheme = (theme) => {
    currentTheme.value = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
};

const themeLabel = (theme) => {
    if (theme === 'cmyk') return 'Cmyk (Default)';
    return theme.charAt(0).toUpperCase() + theme.slice(1);
};

onMounted(() => {
    const saved = localStorage.getItem('theme');
    if (saved) {
        currentTheme.value = saved;
        document.documentElement.setAttribute('data-theme', saved);
    }

    fetchStats();
});

const fetchStats = async () => {
    try {
        const response = await storyService.getStats();
        if (response.success && response.data) {
            stats.value = response.data;
        }
    } catch (error) {
        console.error('Error fetching stats:', error);
    }
};

const openModal = (modalId) => {
    document.getElementById(modalId).showModal();
};

const openProfileModal = () => {
    openModal('profile_modal');
};

const closeDrawer = () => {
    const drawerCheckbox = document.getElementById('my-drawer-4');
    if (drawerCheckbox) {
        drawerCheckbox.checked = false;
    }
};

const startAddModeHandler = () => {
    closeDrawer();
    startAddMode();
};

const handleAddStorySubmit = (formData) => {
    console.log('Story submitted:', formData);
    alert(`Cerita "${formData.title}" berhasil ditambahkan! (dummy)`);
};
</script>

<style scoped>
.map-fullscreen {
    position: fixed;
    top: 64px;
    left: 0;
    width: 100vw;
    height: calc(100vh - 64px);
    z-index: 1;
}
</style>