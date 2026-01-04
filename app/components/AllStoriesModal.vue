<template>
    <dialog id="all_stories_modal" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box max-w-4xl flex flex-col max-h-[90vh]">
            <div class="flex items-center justify-between mb-6 shrink-0">
                <div class="flex-1 pr-4 min-w-0">
                    <h3 class="text-xl font-bold break-words" style="word-break: break-word;">{{ selectedStory ?
                        selectedStory.title : 'Semua Cerita' }}</h3>
                    <p v-if="!selectedStory" class="text-sm opacity-60 mt-1">{{ filteredStories.length }} cerita dari
                        pengguna lain</p>
                </div>
                <button @click="closeModal" class="btn btn-sm btn-circle btn-ghost shrink-0">
                    <X :size="20" />
                </button>
            </div>

            <div v-if="!selectedStory" class="mb-4 shrink-0">
                <div class="relative">
                    <input v-model="searchQuery" type="text" placeholder="Cari judul, lokasi, atau penulis..."
                        class="input input-bordered w-full pr-10" />
                    <Search v-if="!searchQuery" class="absolute right-3 top-1/2 -translate-y-1/2 opacity-40"
                        :size="20" />
                    <button v-else @click="clearSearch"
                        class="absolute right-3 top-1/2 -translate-y-1/2 btn btn-ghost btn-xs btn-circle">
                        <X :size="16" />
                    </button>
                </div>
            </div>

            <div v-if="loading && !selectedStory" class="flex-1 flex items-center justify-center py-12">
                <div class="flex flex-col items-center gap-4">
                    <span class="loading loading-spinner loading-lg"></span>
                    <p class="text-sm opacity-60">Memuat cerita...</p>
                </div>
            </div>

            <div v-else-if="!selectedStory" class="flex-1 overflow-y-auto -mx-6 px-6 no-scrollbar">
                <div v-if="filteredStories.length === 0 && searchQuery" class="text-center py-12">
                    <Search :size="48" class="mx-auto opacity-30 mb-4" />
                    <p class="text-base-content/60 mb-2">Tidak ada cerita ditemukan</p>
                    <p class="text-sm opacity-50">Coba kata kunci lain</p>
                </div>

                <div v-else-if="filteredStories.length === 0" class="text-center py-12">
                    <BookOpen :size="48" class="mx-auto opacity-30 mb-4" />
                    <p class="text-base-content/60">Belum ada cerita</p>
                </div>

                <div v-else class="space-y-3">
                    <div v-for="story in filteredStories" :key="story.id"
                        class="card bg-base-200 hover:bg-base-300 transition-colors cursor-pointer active:scale-[0.99]"
                        @click="openStoryDetail(story)">
                        <div class="card-body p-4">
                            <div class="flex items-start justify-between gap-4">
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center gap-2 mb-1">
                                        <h4 class="font-bold text-base line-clamp-1 flex-1 min-w-0 break-words">{{
                                            story.title }}
                                        </h4>
                                        <span class="badge badge-sm badge-ghost shrink-0">{{ story.author?.name ||
                                            'Anonim' }}</span>
                                    </div>
                                    <div class="flex flex-wrap gap-4 text-xs opacity-70 py-2">
                                        <div class="flex items-start gap-1">
                                            <MapPin :size="14" class="shrink-0 mt-0.5" />
                                            <span class="break-words">{{ story.location }}</span>
                                        </div>
                                        <div class="flex items-start gap-1">
                                            <Calendar :size="14" class="shrink-0 mt-0.5" />
                                            <span>{{ formatDate(story.created_at) }}</span>
                                        </div>
                                        <div class="flex items-start gap-1">
                                            <Eye :size="14" class="shrink-0 mt-0.5" />
                                            <span>{{ story.views_count || 0 }} views</span>
                                        </div>
                                    </div>
                                    <p class="text-sm opacity-80 line-clamp-2 break-words">{{ story.description }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else class="flex-1 overflow-y-auto -mx-6 px-6 no-scrollbar">
                <div class="space-y-6">
                    <div>
                        <div class="mb-3">
                            <p class="font-semibold">{{ selectedStory.author?.name || 'Penulis' }}</p>
                            <p class="text-xs opacity-60">{{ formatDate(selectedStory.created_at) }}</p>
                        </div>
                        <div class="flex items-start gap-2 text-sm opacity-70 mb-2">
                            <MapPin :size="16" class="shrink-0 mt-0.5" />
                            <span class="break-words flex-1">{{ selectedStory.location }}</span>
                        </div>
                        <div class="flex items-start gap-2 text-sm opacity-70">
                            <Eye :size="16" class="shrink-0 mt-0.5" />
                            <span>{{ selectedStory.views_count || 0 }} views</span>
                        </div>
                        <p class="text-sm opacity-80 line-clamp-2 break-words mt-2">{{ selectedStory.description }}</p>
                    </div>

                    <div class="divider"></div>

                    <div class="prose max-w-none">
                        <p class="text-base leading-relaxed whitespace-pre-line break-words">{{ selectedStory.full_story
                        }}</p>
                    </div>
                </div>
            </div>

            <div class="modal-action mt-6 shrink-0 pt-4 border-t border-base-300">
                <template v-if="selectedStory">
                    <button @click="viewOnMap" class="btn btn-primary">
                        <MapPin :size="18" />
                        Lihat di Peta
                    </button>
                    <button @click="backToList" class="btn btn-ghost">Kembali</button>
                </template>
                <button v-else @click="closeModal" class="btn btn-ghost">Tutup</button>
            </div>
        </div>
    </dialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import { X, MapPin, Calendar, BookOpen, Search, Eye } from 'lucide-vue-next';
import { storyService } from '~/services/storyService';

const searchQuery = ref('');
const selectedStory = ref(null);
const allStories = ref([]);
const loading = ref(false);

const modalElement = ref(null);
const emit = defineEmits(['viewOnMap', 'closeDrawer']);

const fetchAllStories = async () => {
    loading.value = true;

    try {
        const response = await storyService.getAllStories();
        allStories.value = response.data || [];
    } catch (error) {
        console.error('Error fetching stories:', error);
        allStories.value = [];
    } finally {
        loading.value = false;
    }
};

if (process.client) {
    setTimeout(() => {
        modalElement.value = document.getElementById('all_stories_modal');
        if (modalElement.value) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'open') {
                        if (modalElement.value.open) {
                            fetchAllStories();
                        }
                    }
                });
            });
            observer.observe(modalElement.value, { attributes: true });
        }
    }, 100);
}

const filteredStories = computed(() => {
    if (!searchQuery.value.trim()) return allStories.value;

    const query = searchQuery.value.toLowerCase().trim();
    return allStories.value.filter(story => {
        const title = (story.title || '').toLowerCase();
        const location = (story.location || '').toLowerCase();
        const author = (story.author?.name || '').toLowerCase();
        const description = (story.description || '').toLowerCase();

        return title.includes(query) ||
            location.includes(query) ||
            author.includes(query) ||
            description.includes(query);
    });
});

const formatDate = (dateString) => {
    if (!dateString) return 'Tanggal tidak tersedia';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};

const clearSearch = () => {
    searchQuery.value = '';
};

const closeModal = () => {
    document.getElementById('all_stories_modal').close();
    setTimeout(() => {
        searchQuery.value = '';
        selectedStory.value = null;
    }, 200);
};

const openStoryDetail = async (story) => {
    selectedStory.value = story;

    await storyService.incrementView(story.id);

    if (selectedStory.value.views_count !== undefined) {
        selectedStory.value.views_count += 1;
    }
};

const backToList = () => {
    selectedStory.value = null;
};

const viewOnMap = () => {
    if (!selectedStory.value) return;

    emit('viewOnMap', {
        latitude: selectedStory.value.latitude,
        longitude: selectedStory.value.longitude
    });

    emit('closeDrawer');
    closeModal();
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