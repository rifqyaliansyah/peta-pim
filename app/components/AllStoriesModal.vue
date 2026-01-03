<template>
    <dialog id="all_stories_modal" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box max-w-4xl flex flex-col max-h-[90vh]">
            <div class="flex items-center justify-between mb-6 shrink-0">
                <div>
                    <h3 class="text-xl font-bold">Semua Cerita</h3>
                    <p class="text-sm opacity-60 mt-1">{{ allStories.length }} cerita dari komunitas</p>
                </div>
                <button @click="closeModal" class="btn btn-sm btn-circle btn-ghost">
                    <X :size="20" />
                </button>
            </div>


            <div class="mb-4 sticky top-0 z-10 bg-base-100 pt-2 pb-4 shrink-0">
                <input v-model="searchQuery" type="search" placeholder="Cari cerita..."
                    class="input input-bordered w-full" />
            </div>

            <div class="flex-1 overflow-y-auto -mx-6 px-6 no-scrollbar">
                <div class="space-y-3">
                    <div v-for="story in filteredStories" :key="story.id"
                        class="card bg-base-200 hover:bg-base-300 transition-colors cursor-pointer active:scale-[0.99]"
                        @click="openStoryDetail(story)">
                        <div class="card-body p-4">
                            <div class="flex items-start justify-between gap-4">
                                <div class="flex-1">
                                    <div class="flex items-center gap-2 mb-1">
                                        <h4 class="font-bold text-base">{{ story.title }}</h4>
                                        <span class="badge badge-sm badge-ghost">{{ story.author }}</span>
                                    </div>
                                    <div class="flex flex-wrap gap-3 text-xs opacity-70 mb-2">
                                        <div class="flex items-center gap-1">
                                            <MapPin :size="14" />
                                            <span>{{ story.location }}</span>
                                        </div>
                                        <div class="flex items-center gap-1">
                                            <Calendar :size="14" />
                                            <span>{{ story.date }}</span>
                                        </div>
                                    </div>
                                    <p class="text-sm opacity-80 line-clamp-2">{{ story.description }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal-action mt-6 shrink-0 pt-4 border-t border-base-300">
                <button @click="closeModal" class="btn btn-ghost">Tutup</button>
            </div>
        </div>
    </dialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import { X, MapPin, Calendar } from 'lucide-vue-next';

const searchQuery = ref('');

const allStories = ref([
    {
        id: 1,
        title: 'Legenda Tangkuban Perahu',
        author: 'Budi Santoso',
        location: 'Bandung, Jawa Barat',
        date: '15 Des 2024',
        description: 'Kisah legenda Sangkuriang dan Dayang Sumbi yang menciptakan Gunung Tangkuban Perahu dalam semalam.'
    },
    {
        id: 2,
        title: 'Cerita Malin Kundang',
        author: 'Siti Aminah',
        location: 'Padang, Sumatera Barat',
        date: '10 Des 2024',
        description: 'Legenda tentang anak durhaka yang dikutuk menjadi batu karena tidak mengakui ibunya sendiri.'
    },
    {
        id: 3,
        title: 'Batu Menangis',
        author: 'Ahmad Fauzi',
        location: 'Kalimantan Barat',
        date: '5 Des 2024',
        description: 'Kisah seorang anak perempuan yang durhaka kepada ibunya dan dikutuk menjadi batu yang menangis.'
    },
    {
        id: 4,
        title: 'Roro Jonggrang',
        author: 'Dewi Lestari',
        location: 'Yogyakarta',
        date: '3 Des 2024',
        description: 'Legenda tentang Roro Jonggrang yang dikutuk menjadi arca ke-1000 di Candi Prambanan.'
    },
    {
        id: 5,
        title: 'Timun Mas',
        author: 'Joko Widodo',
        location: 'Jawa Tengah',
        date: '1 Des 2024',
        description: 'Kisah seorang gadis yang melarikan diri dari raksasa dengan menggunakan benda-benda sakti.'
    },
    {
        id: 6,
        title: 'Danau Toba',
        author: 'Ratna Sari',
        location: 'Sumatera Utara',
        date: '28 Nov 2024',
        description: 'Legenda asal-usul Danau Toba dan Pulau Samosir dari kisah seorang pemuda dan ikan emas.'
    },
    {
        id: 7,
        title: 'Lutung Kasarung',
        author: 'Andi Pratama',
        location: 'Jawa Barat',
        date: '25 Nov 2024',
        description: 'Kisah tentang seorang pangeran yang dikutuk menjadi lutung dan kisah cintanya dengan putri.'
    },
    {
        id: 8,
        title: 'Bawang Merah Bawang Putih',
        author: 'Lina Marlina',
        location: 'Jawa Timur',
        date: '20 Nov 2024',
        description: 'Cerita tentang dua saudara tiri dengan karakter berbeda dan balasan atas perbuatan mereka.'
    }
]);

const filteredStories = computed(() => {
    if (!searchQuery.value) return allStories.value;

    const query = searchQuery.value.toLowerCase();
    return allStories.value.filter(story =>
        story.title.toLowerCase().includes(query) ||
        story.location.toLowerCase().includes(query) ||
        story.author.toLowerCase().includes(query) ||
        story.description.toLowerCase().includes(query)
    );
});

const closeModal = () => {
    document.getElementById('all_stories_modal').close();
    searchQuery.value = '';
};

const openStoryDetail = (story) => {
    console.log('Membuka detail cerita:', story);
    alert(`Membuka cerita: "${story.title}"\n\nPengarang: ${story.author}\nLokasi: ${story.location}\nTanggal: ${story.date}\n\nDeskripsi: ${story.description}`);
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