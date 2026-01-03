<template>
    <dialog id="my_stories_modal" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box max-w-4xl flex flex-col max-h-[90vh]">
            <div class="flex items-center justify-between mb-6 shrink-0">
                <div>
                    <h3 class="text-xl font-bold">Cerita Saya</h3>
                    <p class="text-sm opacity-60 mt-1">{{ myStories.length }} cerita</p>
                </div>
                <button @click="closeModal" class="btn btn-sm btn-circle btn-ghost">
                    <X :size="20" />
                </button>
            </div>

            <div class="flex-1 overflow-y-auto -mx-6 px-6 no-scrollbar">
                <div v-if="myStories.length === 0" class="text-center py-12">
                    <BookOpen :size="48" class="mx-auto opacity-30 mb-4" />
                    <p class="text-base-content/60">Belum ada cerita yang ditambahkan</p>
                </div>

                <div v-else class="space-y-3">
                    <div v-for="story in myStories" :key="story.id"
                        class="card bg-base-200 hover:bg-base-300 transition-colors">
                        <div class="card-body p-4">
                            <div class="flex items-start justify-between gap-4">
                                <div class="flex-1">
                                    <h4 class="font-bold text-base mb-1 cursor-pointer"
                                        @click="openStoryDetail(story)">
                                        {{ story.title }}
                                    </h4>
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
                                <div class="flex gap-2">
                                    <button @click="editStory(story.id)" class="btn btn-sm btn-ghost btn-square"
                                        title="Edit">
                                        <Edit :size="16" />
                                    </button>
                                    <button @click="deleteStory(story.id)"
                                        class="btn btn-sm btn-ghost btn-square text-error" title="Hapus">
                                        <Trash2 :size="16" />
                                    </button>
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
import { ref } from 'vue';
import { X, BookOpen, MapPin, Calendar, Edit, Trash2 } from 'lucide-vue-next';

const myStories = ref([
    {
        id: 1,
        title: 'Legenda Tangkuban Perahu',
        location: 'Bandung, Jawa Barat',
        date: '15 Des 2024',
        description: 'Kisah legenda Sangkuriang dan Dayang Sumbi yang menciptakan Gunung Tangkuban Perahu dalam semalam.'
    },
    {
        id: 2,
        title: 'Cerita Malin Kundang',
        location: 'Padang, Sumatera Barat',
        date: '10 Des 2024',
        description: 'Legenda tentang anak durhaka yang dikutuk menjadi batu karena tidak mengakui ibunya sendiri.'
    },
    {
        id: 3,
        title: 'Batu Menangis',
        location: 'Kalimantan Barat',
        date: '5 Des 2024',
        description: 'Kisah seorang anak perempuan yang durhaka kepada ibunya dan dikutuk menjadi batu yang menangis.'
    }
]);

const closeModal = () => {
    document.getElementById('my_stories_modal').close();
};

const editStory = (id) => {
    alert(`Edit cerita ID: ${id} (dummy)`);
};

const deleteStory = (id) => {
    if (confirm('Yakin ingin menghapus cerita ini?')) {
        myStories.value = myStories.value.filter(story => story.id !== id);
        alert(`Cerita ID: ${id} berhasil dihapus (dummy)`);
    }
};

const openStoryDetail = (story) => {
    console.log('Membuka detail cerita saya:', story);
    alert(`Membuka cerita saya: "${story.title}"\n\nLokasi: ${story.location}\nTanggal: ${story.date}\n\nDeskripsi: ${story.description}`);
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