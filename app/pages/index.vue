<template>
    <div class="map-wrapper">
        <!-- Banner Instruksi ADD MODE -->
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

        <LMap :zoom="5" :center="[-2.5489, 118.0149]" :use-global-leaflet="false" @click="handleMapClick">
            <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors"
                layer-type="base" name="OpenStreetMap" />

            <LMarker v-if="tempMarker" :lat-lng="tempMarker" draggable @dragend="updateTempMarkerPosition">
                <LPopup>
                    <div class="text-sm">
                        <p class="font-bold mb-1">Lokasi Baru</p>
                        <p class="text-xs opacity-70">Lat: {{ tempMarker[0].toFixed(6) }}</p>
                        <p class="text-xs opacity-70">Lng: {{ tempMarker[1].toFixed(6) }}</p>
                    </div>
                </LPopup>
            </LMarker>

            <LMarker v-for="story in stories" :key="story.id" :lat-lng="[story.latitude, story.longitude]">
                <LPopup>
                    <div class="min-w-[200px]">
                        <h4 class="font-bold text-sm mb-2">{{ story.title }}</h4>
                        <p class="text-xs opacity-70 mb-1">{{ story.location }}</p>
                        <p class="text-xs mb-3 line-clamp-2">{{ story.description }}</p>
                        <button @click="viewStoryDetail(story)" class="btn btn-xs btn-primary w-full">
                            Lihat Detail
                        </button>
                    </div>
                </LPopup>
            </LMarker>
        </LMap>

        <Transition name="slide-up">
            <div v-if="isAddMode" class="absolute bottom-8 left-1/2 -translate-x-1/2 z-[1000] flex gap-3">
                <button @click="cancelAddMode" class="btn btn-error btn-lg shadow-lg">
                    <X :size="20" />
                    Cancel
                </button>
                <button @click="proceedToAddStory" class="btn btn-primary btn-lg shadow-lg">
                    <Plus :size="20" />
                    Tambah Cerita
                </button>
            </div>
        </Transition>
    </div>

    <AddStoryModal ref="addStoryModalRef" @submit="handleStorySubmit" />
</template>

<script setup>
import { X, Plus } from 'lucide-vue-next';
import { useAddStoryMode } from '~/composables/useAddStoryMode';

definePageMeta({
    layout: 'map'
});

const addStoryModalRef = ref(null);
const { isAddMode, tempMarker, exitAddMode, setTempMarker, clearTempMarker } = useAddStoryMode();

const stories = ref([
    {
        id: 1,
        title: 'Legenda Tangkuban Perahu',
        location: 'Bandung, Jawa Barat',
        description: 'Kisah legenda Sangkuriang dan Dayang Sumbi yang menciptakan Gunung Tangkuban Perahu dalam semalam.',
        latitude: -6.7599,
        longitude: 107.6098
    },
    {
        id: 2,
        title: 'Cerita Malin Kundang',
        location: 'Padang, Sumatera Barat',
        description: 'Legenda tentang anak durhaka yang dikutuk menjadi batu karena tidak mengakui ibunya sendiri.',
        latitude: -0.9471,
        longitude: 100.4172
    }
]);

const handleMapClick = (event) => {
    if (!isAddMode.value) return;

    const { lat, lng } = event.latlng;
    setTempMarker([lat, lng]);
};

const updateTempMarkerPosition = (event) => {
    const { lat, lng } = event.target.getLatLng();
    setTempMarker([lat, lng]);
};

const cancelAddMode = () => {
    clearTempMarker();
    exitAddMode();
};

const proceedToAddStory = () => {
    if (!tempMarker.value) {
        alert('Pilih lokasi dulu di peta!');
        return;
    }

    if (addStoryModalRef.value) {
        addStoryModalRef.value.openModal({
            lat: tempMarker.value[0],
            lng: tempMarker.value[1]
        });
    }
};

const handleStorySubmit = (formData) => {
    console.log('Story submitted:', formData);

    // Add new story to list (dummy)
    const newStory = {
        id: stories.value.length + 1,
        title: formData.title,
        location: formData.location,
        description: formData.description,
        latitude: formData.coordinates.lat,
        longitude: formData.coordinates.lng
    };

    stories.value.push(newStory);

    exitAddMode();

    alert(`Cerita "${formData.title}" berhasil ditambahkan!`);
};

const viewStoryDetail = (story) => {
    console.log('View story detail:', story);
    alert(`Lihat detail cerita: "${story.title}"\n\nLokasi: ${story.location}\n\n${story.description}\n\n(Belum diarahkan ke halaman detail)`);
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
</style>