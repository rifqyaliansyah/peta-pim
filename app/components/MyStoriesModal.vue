<template>
    <dialog id="my_stories_modal" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box max-w-4xl flex flex-col max-h-[90vh]">
            <div class="flex items-center justify-between mb-6 shrink-0">
                <div>
                    <h3 class="text-xl font-bold">{{ isEditMode ? 'Edit Cerita' : 'Cerita Saya' }}</h3>
                    <p v-if="!isEditMode" class="text-sm opacity-60 mt-1">{{ myStories.length }} cerita</p>
                </div>
                <button @click="closeModal" class="btn btn-sm btn-circle btn-ghost">
                    <X :size="20" />
                </button>
            </div>

            <div v-if="errorMessage" class="alert alert-error mb-4 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ errorMessage }}</span>
            </div>

            <div v-if="!isEditMode" class="flex-1 overflow-y-auto -mx-6 px-6 no-scrollbar">
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
                                    <h4 class="font-bold text-base mb-1 cursor-pointer" @click="openStoryDetail(story)">
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
                                    <button @click="switchToEdit(story)" class="btn btn-sm btn-ghost btn-square"
                                        title="Edit">
                                        <Edit :size="16" />
                                    </button>
                                    <button @click="handleDelete(story)"
                                        class="btn btn-sm btn-ghost btn-square text-error" title="Hapus">
                                        <Trash2 :size="16" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else class="flex-1 overflow-y-auto -mx-6 px-6 no-scrollbar">
                <div class="space-y-4">
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text font-semibold mb-1">Judul Cerita</span>
                        </label>
                        <input v-model="editForm.title" type="text" placeholder="Masukkan judul cerita"
                            class="input input-bordered w-full" />
                    </div>

                    <div class="form-control">
                        <label class="label">
                            <span class="label-text font-semibold mb-1">Lokasi</span>
                        </label>
                        <input v-model="editForm.location" type="text" placeholder="Contoh: Bandung, Jawa Barat"
                            class="input input-bordered w-full" />
                    </div>

                    <div class="form-control">
                        <label class="label">
                            <span class="label-text font-semibold mb-1">Deskripsi</span>
                        </label>
                        <textarea v-model="editForm.description" placeholder="Ceritakan kisah atau legenda ini..."
                            class="textarea textarea-bordered h-32 w-full"></textarea>
                        <label class="label">
                            <span class="label-text-alt opacity-60">{{ editForm.description.length }} karakter</span>
                        </label>
                    </div>
                </div>
            </div>

            <div class="modal-action mt-6 shrink-0 pt-4 border-t border-base-300">
                <button v-if="!isEditMode" @click="closeModal" class="btn btn-ghost">Tutup</button>
                <template v-else>
                    <button @click="cancelEdit" class="btn btn-ghost" :disabled="submitting">Batal</button>
                    <button @click="submitEdit" class="btn btn-primary" :disabled="submitting">
                        <span v-if="submitting" class="loading loading-spinner"></span>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                            stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                        {{ submitting ? 'Menyimpan...' : 'Simpan Perubahan' }}
                    </button>
                </template>
            </div>
        </div>
    </dialog>

    <DeleteStoryModal ref="deleteModalRef" />
</template>

<script setup>
import { ref } from 'vue';
import { X, BookOpen, MapPin, Calendar, Edit, Trash2 } from 'lucide-vue-next';
import DeleteStoryModal from './DeleteStoryModal.vue';

const isEditMode = ref(false);
const submitting = ref(false);
const errorMessage = ref('');
const deleteModalRef = ref(null);

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

const editForm = ref({
    id: null,
    title: '',
    location: '',
    description: ''
});

const closeModal = () => {
    document.getElementById('my_stories_modal').close();
    isEditMode.value = false;
    errorMessage.value = '';
};

const switchToEdit = (story) => {
    editForm.value = {
        id: story.id,
        title: story.title,
        location: story.location,
        description: story.description
    };
    isEditMode.value = true;
    errorMessage.value = '';
};

const cancelEdit = () => {
    isEditMode.value = false;
    errorMessage.value = '';
    editForm.value = {
        id: null,
        title: '',
        location: '',
        description: ''
    };
};

const submitEdit = () => {
    errorMessage.value = '';

    if (!editForm.value.title.trim()) {
        errorMessage.value = 'Judul cerita harus diisi';
        return;
    }

    if (!editForm.value.location.trim()) {
        errorMessage.value = 'Lokasi harus diisi';
        return;
    }

    if (!editForm.value.description.trim()) {
        errorMessage.value = 'Deskripsi harus diisi';
        return;
    }

    submitting.value = true;

    setTimeout(() => {
        submitting.value = false;
        alert(`Cerita "${editForm.value.title}" berhasil diupdate! (dummy)`);
        cancelEdit();
    }, 1000);
};

const handleDelete = (story) => {
    if (deleteModalRef.value) {
        deleteModalRef.value.openModal(story);
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