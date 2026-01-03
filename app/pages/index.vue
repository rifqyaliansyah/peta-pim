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

    <dialog id="story_detail_modal" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box max-w-4xl flex flex-col max-h-[90vh]">
            <div class="flex items-center justify-between mb-6 shrink-0">
                <div>
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
                            <p class="font-semibold">{{ selectedStory.author || 'Penulis' }}</p>
                            <p class="text-xs opacity-60">{{ selectedStory.date || 'Tanggal tidak tersedia' }}</p>
                        </div>
                        <div class="flex items-center gap-2 text-sm opacity-70 mb-4">
                            <MapPin :size="16" />
                            <span>{{ selectedStory.location }}</span>
                        </div>
                    </div>

                    <div class="divider"></div>

                    <div class="prose max-w-none">
                        <p class="text-base leading-relaxed whitespace-pre-line">{{ selectedStory.full_story ||
                            selectedStory.description }}</p>
                    </div>
                </div>
            </div>

            <div class="modal-action mt-6 shrink-0 pt-4 border-t border-base-300">
                <button @click="closeDetailModal" class="btn btn-ghost">Tutup</button>
            </div>
        </div>
    </dialog>

    <AddStoryModal ref="addStoryModalRef" @submit="handleStorySubmit" />
</template>

<script setup>
import { X, Plus, MapPin } from 'lucide-vue-next';
import { useAddStoryMode } from '~/composables/useAddStoryMode';
import { ref } from 'vue';

definePageMeta({
    layout: 'map'
});

const addStoryModalRef = ref(null);
const { isAddMode, tempMarker, exitAddMode, setTempMarker, clearTempMarker } = useAddStoryMode();
const selectedStory = ref(null);

const stories = ref([
    {
        id: 1,
        title: 'Legenda Tangkuban Perahu',
        location: 'Bandung, Jawa Barat',
        description: 'Kisah legenda Sangkuriang dan Dayang Sumbi yang menciptakan Gunung Tangkuban Perahu dalam semalam.',
        full_story: `Dahulu kala, hiduplah seorang putri cantik bernama Dayang Sumbi. Suatu hari, ia menjatuhkan alat tenunnya dan bersumpah akan menikahi siapa saja yang mengambilkannya. Seekor anjing bernama Tumang mengambilkan alat tersebut, dan Dayang Sumbi harus menepati sumpahnya.

Dari pernikahan tersebut, lahirlah seorang anak laki-laki bernama Sangkuriang. Ia tumbuh menjadi pemuda yang gagah dan suka berburu. Suatu hari, saat berburu bersama Tumang, Sangkuriang menjadi marah karena tidak mendapat buruan dan membunuh Tumang.

Ketika mengetahui hal ini, Dayang Sumbi sangat marah dan memukul kepala Sangkuriang hingga luka. Sangkuriang pergi meninggalkan ibunya dan mengembara selama bertahun-tahun.

Bertahun-tahun kemudian, Sangkuriang kembali ke kampung halamannya dan bertemu dengan seorang wanita cantik yang tak lain adalah ibunya sendiri. Karena kesaktiannya, Dayang Sumbi tetap terlihat muda. Mereka saling jatuh cinta dan berencana menikah.

Menjelang pernikahan, Dayang Sumbi menyadari bahwa calon suaminya adalah anaknya sendiri dari bekas luka di kepala Sangkuriang. Untuk menggagalkan pernikahan, ia memberikan syarat yang mustahil: Sangkuriang harus membuat sebuah perahu dan bendungan dalam waktu satu malam.

Dengan kesaktiannya, Sangkuriang hampir berhasil menyelesaikan tugas tersebut. Dayang Sumbi panik dan meminta penduduk menumbuk lesung agar ayam jantan berkokok. Sangkuriang mengira matahari akan terbit dan menendang perahu yang belum selesai. Perahu itu terbalik dan menjadi Gunung Tangkuban Perahu.`,
        latitude: -6.7599,
        longitude: 107.6098,
        author: 'Budi Santoso',
        date: '15 Des 2024'
    },
    {
        id: 2,
        title: 'Cerita Malin Kundang',
        location: 'Padang, Sumatera Barat',
        description: 'Legenda tentang anak durhaka yang dikutuk menjadi batu karena tidak mengakui ibunya sendiri.',
        full_story: `Malin Kundang adalah seorang anak laki-laki yang hidup bersama ibunya di sebuah desa nelayan miskin. Ayahnya telah meninggal saat melaut ketika Malin masih kecil.

Suatu hari, Malin memutuskan untuk pergi merantau mencari kehidupan yang lebih baik. Dengan berat hati, ibunya melepas kepergian Malin dengan harapan suatu hari ia akan kembali sebagai orang sukses.

Di tanah perantauan, Malin bekerja keras dan beruntung bertemu dengan seorang saudagar kaya yang tidak memiliki anak. Ia diangkat sebagai anak dan mewarisi semua harta saudagar tersebut. Malin menikah dengan putri saudagar yang cantik jelita.

Bertahun-tahun kemudian, Malin berlayar kembali ke kampung halamannya dengan kapal mewah. Ibunya yang sudah tua mendengar kabar kedatangan kapal besar dan berlari ke pelabuhan. Dengan air mata, ia memeluk Malin yang sudah tidak dikenalinya.

Namun Malin, yang malu dengan ibu tuanya yang kumuh di depan istri cantiknya, mengusir ibunya dengan kasar. Ia bahkan tidak mengakui bahwa wanita tua itu adalah ibunya.

Hati ibu Malin hancur berkeping-keping. Dengan penuh kesedihan, ia mengangkat tangannya ke langit dan berdoa agar Malin mendapat balasan atas perbuatannya. Tiba-tiba langit menjadi gelap, angin bertiup kencang, dan badai besar menghantam kapal Malin.

Malin Kundang berubah menjadi batu di tepi pantai, menjadi pengingat abadi tentang akibat durhaka kepada orang tua.`,
        latitude: -0.9471,
        longitude: 100.4172,
        author: 'Siti Aminah',
        date: '10 Des 2024'
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

    const newStory = {
        id: stories.value.length + 1,
        title: formData.title,
        location: formData.location,
        description: formData.description,
        full_story: formData.description,
        latitude: formData.coordinates.lat,
        longitude: formData.coordinates.lng,
        author: 'Anda',
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    };

    stories.value.push(newStory);

    exitAddMode();

    alert(`Cerita "${formData.title}" berhasil ditambahkan!`);
};

const viewStoryDetail = (story) => {
    selectedStory.value = story;
    document.getElementById('story_detail_modal').showModal();
};

const closeDetailModal = () => {
    document.getElementById('story_detail_modal').close();
    selectedStory.value = null;
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