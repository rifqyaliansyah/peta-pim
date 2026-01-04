<template>
    <div class="map-wrapper">
        <Transition name="slide-down">
            <div v-if="isAddMode" class="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-md px-4">
                <div class="alert alert-info shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        class="stroke-current shrink-0 w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span class="text-sm font-semibold">Klik peta untuk menentukan lokasi cerita</span>
                </div>
            </div>
        </Transition>

        <!-- Loading Overlay -->
        <div v-if="loading" class="absolute inset-0 bg-base-200/50 z-[999] flex items-center justify-center">
            <div class="flex flex-col items-center gap-4">
                <span class="loading loading-spinner loading-lg"></span>
                <p class="text-sm font-semibold">Memuat cerita...</p>
            </div>
        </div>

        <LMap :zoom="5" :center="[-2.5489, 118.0149]" :use-global-leaflet="false" @click="handleMapClick">
            <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors"
                layer-type="base" name="OpenStreetMap" />

            <LMarker v-if="tempMarker" :lat-lng="tempMarker" draggable @dragend="updateTempMarkerPosition">
                <LPopup>
                    <div class="text-sm min-w-[200px]">
                        <p class="font-bold mb-2">Lokasi Baru</p>
                        <div v-if="isLoadingLocation" class="flex items-center gap-2 py-2">
                            <span class="loading loading-spinner loading-sm"></span>
                            <span class="text-xs opacity-70">Mendapatkan lokasi...</span>
                        </div>
                        <div v-else>
                            <p class="text-xs mb-2 break-words">{{ tempLocation || 'Lokasi tidak ditemukan' }}</p>
                            <p class="text-xs opacity-70">Lat: {{ tempMarker[0].toFixed(6) }}</p>
                            <p class="text-xs opacity-70">Lng: {{ tempMarker[1].toFixed(6) }}</p>
                        </div>
                    </div>
                </LPopup>
            </LMarker>

            <LMarker v-for="story in stories" :key="story.id" :lat-lng="[story.latitude, story.longitude]">
                <LPopup>
                    <div class="min-w-[200px]">
                        <h4 class="font-bold text-sm mb-2 wrap-break-word">{{ story.title }}</h4>
                        <p class="text-xs opacity-70 mb-1 wrap-break-word">{{ story.location }}</p>
                        <p class="text-xs mb-2 line-clamp-2 wrap-break-word">{{ story.description }}</p>
                        <div class="flex items-center gap-2 text-xs opacity-60 mb-3">
                            <Eye :size="14" />
                            <span>{{ story.views_count || 0 }} views</span>
                        </div>
                        <button @click="viewStoryDetail(story)" class="btn btn-xs btn-primary w-full"
                            :disabled="loadingDetail === story.id">
                            <span v-if="loadingDetail === story.id" class="loading loading-spinner loading-xs"></span>
                            <span v-else>Lihat Detail</span>
                        </button>
                    </div>
                </LPopup>
            </LMarker>
        </LMap>

        <Transition name="slide-up">
            <div v-if="isAddMode"
                class="absolute bottom-20 sm:bottom-8 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-[1000] flex gap-2 sm:gap-3">
                <button @click="cancelAddMode" class="btn btn-error btn-md sm:btn-lg shadow-lg flex-1 sm:flex-initial">
                    <X :size="16" class="sm:w-5 sm:h-5" />
                    <span class="text-sm sm:text-base">Cancel</span>
                </button>
                <button @click="proceedToAddStory"
                    class="btn btn-primary btn-md sm:btn-lg shadow-lg flex-1 sm:flex-initial">
                    <Plus :size="16" class="sm:w-5 sm:h-5" />
                    <span class="text-sm sm:text-base">Tambah Cerita</span>
                </button>
            </div>
        </Transition>
    </div>

    <dialog id="story_detail_modal" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box max-w-4xl flex flex-col max-h-[90vh]">
            <div class="flex items-center justify-between mb-6 shrink-0">
                <div class="wrap-break-word overflow-y-auto">
                    <h3 class="text-xl font-bold">{{ selectedStory?.title }}</h3>
                </div>
                <button @click="closeDetailModal" class="btn btn-sm btn-circle btn-ghost">
                    <X :size="20" />
                </button>
            </div>

            <div class="flex-1 overflow-y-auto -mx-6 px-6 no-scrollbar">
                <div v-if="selectedStory" class="space-y-6">
                    <div>
                        <div class="mb-3">
                            <p class="font-semibold">{{ selectedStory.author?.name || 'Penulis' }}</p>
                            <p class="text-xs opacity-60">{{ formatDate(selectedStory.created_at) }}</p>
                        </div>
                        <div class="flex items-start gap-2 text-sm opacity-70 mb-2">
                            <MapPin :size="16" class="shrink-0 mt-0.5" />
                            <span class="break-words flex-1">{{ selectedStory.location }}</span>
                        </div>
                        <div class="flex items-center gap-2 text-sm opacity-70">
                            <Eye :size="16" />
                            <span>{{ selectedStory.views_count || 0 }} views</span>
                        </div>

                        <p class="text-sm opacity-80 line-clamp-2 break-words mt-2">{{ selectedStory.description }}</p>
                    </div>

                    <div class="divider"></div>

                    <div class="prose max-w-none">
                        <p class="text-base leading-relaxed whitespace-pre-line wrap-break-word">{{
                            selectedStory.full_story ||
                            selectedStory.description }}</p>
                    </div>
                </div>
            </div>

            <div class="modal-action mt-6 shrink-0 pt-4 border-t border-base-300">
                <button @click="closeDetailModal" class="btn btn-ghost">Tutup</button>
            </div>
        </div>
    </dialog>

    <dialog id="location_warning_modal" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-bold text-warning">Pilih Lokasi</h3>
                <button @click="closeLocationWarning" class="btn btn-sm btn-circle btn-ghost">
                    <X :size="18" />
                </button>
            </div>

            <div class="alert alert-warning mb-4">
                <div class="flex items-center gap-2 w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span class="flex-1">Anda belum memilih lokasi di peta!</span>
                </div>
            </div>

            <p class="mb-4">Silakan klik peta untuk menentukan lokasi cerita Anda terlebih dahulu.</p>

            <div class="modal-action">
                <button @click="closeLocationWarning" class="btn btn-primary w-full">OK</button>
            </div>
        </div>
    </dialog>

    <AddStoryModal ref="addStoryModalRef" @submit="handleStorySubmit" />
    <MyStoriesModal @storyUpdated="handleStoryUpdate" @storyDeleted="handleStoryDelete" />
</template>

<script setup>
import { X, Plus, MapPin, Eye } from 'lucide-vue-next';
import { useAddStoryMode } from '~/composables/useAddStoryMode';
import { storyService } from '~/services/storyService';
import { geocodingService } from '~/services/geocodingService';
import { ref, onMounted } from 'vue';

definePageMeta({
    layout: 'map'
});

const addStoryModalRef = ref(null);
const { isAddMode, tempMarker, tempLocation, exitAddMode, setTempMarker, setTempLocation, clearTempMarker } = useAddStoryMode();
const selectedStory = ref(null);
const stories = ref([]);
const loading = ref(false);
const isLoadingLocation = ref(false);
const loadingDetail = ref(null);

onMounted(async () => {
    await fetchStories();
});

const fetchStories = async () => {
    loading.value = true;
    try {
        const response = await storyService.getAllStories();
        stories.value = response.data || [];
    } catch (error) {
        console.error('Error fetching stories:', error);
    } finally {
        loading.value = false;
    }
};

const fetchLocationName = async (lat, lng) => {
    isLoadingLocation.value = true;
    try {
        const result = await geocodingService.reverseGeocode(lat, lng);
        if (result.success) {
            setTempLocation(result.formattedAddress);
        } else {
            setTempLocation('Lokasi tidak ditemukan');
        }
    } catch (error) {
        console.error('Error fetching location:', error);
        setTempLocation('Lokasi tidak ditemukan');
    } finally {
        isLoadingLocation.value = false;
    }
};

const handleMapClick = async (event) => {
    if (!isAddMode.value) return;

    const { lat, lng } = event.latlng;
    setTempMarker([lat, lng]);
    await fetchLocationName(lat, lng);
};

const updateTempMarkerPosition = async (event) => {
    const { lat, lng } = event.target.getLatLng();
    setTempMarker([lat, lng]);
    await fetchLocationName(lat, lng);
};

const cancelAddMode = () => {
    clearTempMarker();
    exitAddMode();
};

const proceedToAddStory = () => {
    if (!tempMarker.value) {
        document.getElementById('location_warning_modal').showModal();
        return;
    }

    if (addStoryModalRef.value) {
        addStoryModalRef.value.openModal({
            lat: tempMarker.value[0],
            lng: tempMarker.value[1],
            locationName: tempLocation.value
        });
    }
};

const closeLocationWarning = () => {
    document.getElementById('location_warning_modal').close();
};

const handleStorySubmit = async (formData) => {
    try {
        await storyService.createStory({
            title: formData.title,
            location: formData.location,
            description: formData.description,
            full_story: formData.full_story,
            latitude: formData.coordinates.lat,
            longitude: formData.coordinates.lng
        });

        await fetchStories();

        exitAddMode();
    } catch (error) {
        console.error('Error creating story:', error);
        throw error;
    }
};

const viewStoryDetail = async (story) => {
    loadingDetail.value = story.id;

    try {
        selectedStory.value = story;

        await storyService.incrementView(story.id);

        if (selectedStory.value.views_count !== undefined) {
            selectedStory.value.views_count += 1;
        }

        // Open modal
        document.getElementById('story_detail_modal').showModal();
    } catch (error) {
        console.error('Error viewing story detail:', error);
    } finally {
        loadingDetail.value = null;
    }
};

const closeDetailModal = () => {
    document.getElementById('story_detail_modal').close();
    selectedStory.value = null;
};

const formatDate = (dateString) => {
    if (!dateString) return 'Tanggal tidak tersedia';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};

const handleStoryUpdate = async () => {
    console.log('Story updated, refreshing map...');
    await fetchStories();
};

const handleStoryDelete = async () => {
    console.log('Story deleted, refreshing map...');
    await fetchStories();

    if (selectedStory.value) {
        closeDetailModal();
    }
};
</script>

<style scoped>
.map-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
}

:deep(.leaflet-control-zoom) {
    margin-left: 0 !important;
    margin-right: 10px !important;
}

:deep(.leaflet-left) {
    left: auto !important;
    right: 0 !important;
}

.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.no-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>