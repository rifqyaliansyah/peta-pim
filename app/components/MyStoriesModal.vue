<template>
    <dialog id="my_stories_modal" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box max-w-4xl flex flex-col max-h-[90vh]">
            <div class="flex items-center justify-between mb-6 shrink-0">
                <div>
                    <h3 class="text-xl font-bold">
                        {{ isEditMode ? 'Edit Cerita' : (selectedStory ? selectedStory.title : 'Cerita Saya') }}
                    </h3>
                    <p v-if="!isEditMode && !selectedStory" class="text-sm opacity-60 mt-1">{{ myStories.length }}
                        cerita</p>
                </div>
                <button @click="closeModal" class="btn btn-sm btn-circle btn-ghost">
                    <X :size="20" />
                </button>
            </div>

            <!-- Error Alert -->
            <div v-if="errorMessage" class="alert alert-error mb-4 shrink-0">
                <div class="flex items-center gap-2 w-full">
                    <button @click="clearError" class="p-0 bg-transparent border-none cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                    <span class="flex-1">{{ errorMessage }}</span>
                </div>
            </div>

            <!-- Success Alert -->
            <div v-if="successMessage" class="alert alert-success mb-4 shrink-0">
                <div class="flex items-center gap-2 w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="flex-1">{{ successMessage }}</span>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="flex-1 flex items-center justify-center py-12">
                <div class="flex flex-col items-center gap-4">
                    <span class="loading loading-spinner loading-lg"></span>
                    <p class="text-sm opacity-60">Memuat cerita...</p>
                </div>
            </div>

            <!-- List View -->
            <div v-else-if="!isEditMode && !selectedStory" class="flex-1 overflow-y-auto -mx-6 px-6 no-scrollbar">
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
                                    <div class="flex flex-wrap gap-4 text-xs opacity-70 py-2">
                                        <div class="flex items-center gap-1">
                                            <MapPin :size="14" />
                                            <span>{{ story.location }}</span>
                                        </div>
                                        <div class="flex items-center gap-1">
                                            <Calendar :size="14" />
                                            <span>{{ formatDate(story.created_at) }}</span>
                                        </div>
                                        <div class="flex items-center gap-1">
                                            <Eye :size="14" />
                                            <span>{{ story.views_count || 0 }} views</span>
                                        </div>
                                    </div>
                                    <p class="text-sm opacity-80 line-clamp-2">{{ story.description }}</p>
                                </div>
                                <div class="flex gap-2">
                                    <button @click="switchToEdit(story)" class="btn btn-sm btn-ghost btn-square"
                                        title="Edit">
                                        <Edit :size="16" />
                                    </button>
                                    <button @click="openDeleteModal(story)"
                                        class="btn btn-sm btn-ghost btn-square text-error" title="Hapus">
                                        <Trash2 :size="16" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Edit Form -->
            <div v-else-if="isEditMode" class="flex-1 overflow-y-auto -mx-6 px-6 no-scrollbar">
                <div class="space-y-4">
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text font-semibold mb-1">Judul Cerita</span>
                        </label>
                        <input v-model="editForm.title" type="text" placeholder="Masukkan judul cerita"
                            class="input input-bordered w-full" @input="clearError" :disabled="submitting" />
                    </div>

                    <div class="form-control">
                        <label class="label">
                            <span class="label-text font-semibold mb-1">Lokasi</span>
                        </label>
                        <input v-model="editForm.location" type="text" placeholder="Contoh: Bandung, Jawa Barat"
                            class="input input-bordered w-full" @input="clearError" :disabled="submitting" />
                    </div>

                    <div class="form-control">
                        <label class="label">
                            <span class="label-text font-semibold mb-1">Deskripsi Singkat</span>
                        </label>
                        <textarea v-model="editForm.description" placeholder="Deskripsi singkat cerita..."
                            class="textarea textarea-bordered h-24 w-full" @input="clearError"
                            :disabled="submitting"></textarea>
                        <label class="label">
                            <span class="label-text-alt opacity-60">{{ editForm.description.length }} karakter</span>
                        </label>
                    </div>

                    <div class="form-control">
                        <label class="label">
                            <span class="label-text font-semibold mb-1">Cerita Lengkap</span>
                        </label>
                        <textarea v-model="editForm.full_story" placeholder="Tulis cerita lengkap di sini..."
                            class="textarea textarea-bordered h-64 w-full" @input="clearError"
                            :disabled="submitting"></textarea>
                        <label class="label">
                            <span class="label-text-alt opacity-60">{{ editForm.full_story.length }} karakter</span>
                        </label>
                    </div>
                </div>
            </div>

            <!-- Detail View -->
            <div v-else-if="selectedStory" class="flex-1 overflow-y-auto -mx-6 px-6 no-scrollbar">
                <div class="space-y-6">
                    <div>
                        <div class="mb-3">
                            <p class="font-semibold">{{ selectedStory.author?.name || 'Penulis' }}</p>
                            <p class="text-xs opacity-60">{{ formatDate(selectedStory.created_at) }}</p>
                        </div>
                        <div class="flex items-center gap-2 text-sm opacity-70 mb-2">
                            <MapPin :size="16" />
                            <span>{{ selectedStory.location }}</span>
                        </div>
                        <div class="flex items-center gap-2 text-sm opacity-70">
                            <Eye :size="16" />
                            <span>{{ selectedStory.views_count || 0 }} views</span>
                        </div>
                    </div>

                    <div class="divider"></div>

                    <div class="prose max-w-none">
                        <p class="text-base leading-relaxed whitespace-pre-line">{{ selectedStory.full_story }}</p>
                    </div>
                </div>
            </div>

            <!-- Modal Actions -->
            <div class="modal-action mt-6 shrink-0 pt-4 border-t border-base-300">
                <button v-if="!isEditMode && !selectedStory" @click="closeModal" class="btn btn-ghost">Tutup</button>
                <button v-if="selectedStory && !isEditMode" @click="backToList" class="btn btn-ghost">Kembali</button>
                <template v-if="isEditMode">
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

    <!-- Delete Confirmation Modal -->
    <dialog id="delete_story_modal" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-bold text-error">Hapus Cerita</h3>
                <button @click="closeDeleteModal" class="btn btn-sm btn-circle btn-ghost" :disabled="deleting">
                    <X :size="18" />
                </button>
            </div>

            <div v-if="deleteErrorMessage" class="alert alert-error mb-4">
                <div class="flex items-center gap-2 w-full">
                    <button @click="clearDeleteError" class="p-0 bg-transparent border-none cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                    <span class="flex-1">{{ deleteErrorMessage }}</span>
                </div>
            </div>

            <div v-if="storyToDelete" class="pb-4">
                <p class="mb-4">Apakah Anda yakin ingin menghapus cerita ini?</p>
                <div class="card bg-base-200">
                    <div class="card-body p-4">
                        <div class="flex gap-3 items-start">
                            <div>
                                <p class="font-bold">{{ storyToDelete.title }}</p>
                                <div class="flex items-center gap-1 text-sm opacity-60 py-2">
                                    <MapPin :size="14" />
                                    <span>{{ storyToDelete.location }}</span>
                                </div>
                                <p class="text-xs opacity-50 line-clamp-2">{{ storyToDelete.description }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal-action">
                <button @click="closeDeleteModal" class="btn btn-ghost" :disabled="deleting">Batal</button>
                <button @click="confirmDelete" class="btn btn-error" :disabled="deleting">
                    <span v-if="deleting" class="loading loading-spinner"></span>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                    {{ deleting ? 'Menghapus...' : 'Hapus' }}
                </button>
            </div>
        </div>
    </dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import { X, BookOpen, MapPin, Calendar, Edit, Trash2, Eye } from 'lucide-vue-next';
import { storyService } from '~/services/storyService';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();

const isEditMode = ref(false);
const submitting = ref(false);
const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const selectedStory = ref(null);
const storyToDelete = ref(null);
const deleting = ref(false);
const deleteErrorMessage = ref('');
const myStories = ref([]);

const editForm = ref({
    id: null,
    title: '',
    location: '',
    description: '',
    full_story: ''
});

const modalElement = ref(null);

const fetchMyStories = async () => {
    loading.value = true;
    errorMessage.value = '';

    try {
        const response = await storyService.getMyStories();
        myStories.value = response.data || [];
    } catch (error) {
        errorMessage.value = error.message || 'Gagal memuat cerita';
    } finally {
        loading.value = false;
    }
};

if (process.client) {
    setTimeout(() => {
        modalElement.value = document.getElementById('my_stories_modal');
        if (modalElement.value) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'open') {
                        if (modalElement.value.open) {
                            fetchMyStories();
                        }
                    }
                });
            });
            observer.observe(modalElement.value, { attributes: true });
        }
    }, 100);
}

const formatDate = (dateString) => {
    if (!dateString) return 'Tanggal tidak tersedia';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};

const clearError = () => {
    errorMessage.value = '';
};

const clearDeleteError = () => {
    deleteErrorMessage.value = '';
};

const closeModal = () => {
    document.getElementById('my_stories_modal').close();
    setTimeout(() => {
        isEditMode.value = false;
        selectedStory.value = null;
        errorMessage.value = '';
        successMessage.value = '';
    }, 200);
};

const openDeleteModal = (story) => {
    storyToDelete.value = story;
    deleteErrorMessage.value = '';
    document.getElementById('delete_story_modal').showModal();
};

const closeDeleteModal = () => {
    document.getElementById('delete_story_modal').close();
    storyToDelete.value = null;
    deleteErrorMessage.value = '';
    deleting.value = false;
};

const confirmDelete = async () => {
    if (!storyToDelete.value) return;

    deleting.value = true;
    deleteErrorMessage.value = '';

    try {
        await storyService.deleteStory(storyToDelete.value.id);

        const index = myStories.value.findIndex(story => story.id === storyToDelete.value.id);
        if (index !== -1) {
            myStories.value.splice(index, 1);
        }

        successMessage.value = `Cerita "${storyToDelete.value.title}" berhasil dihapus!`;
        closeDeleteModal();

        setTimeout(() => {
            successMessage.value = '';
        }, 2000);
    } catch (error) {
        deleteErrorMessage.value = error.message || 'Gagal menghapus cerita';
    } finally {
        deleting.value = false;
    }
};

const switchToEdit = (story) => {
    editForm.value = {
        id: story.id,
        title: story.title,
        location: story.location,
        description: story.description,
        full_story: story.full_story
    };
    isEditMode.value = true;
    selectedStory.value = null;
    errorMessage.value = '';
    successMessage.value = '';
};

const cancelEdit = () => {
    isEditMode.value = false;
    errorMessage.value = '';
    successMessage.value = '';
    editForm.value = {
        id: null,
        title: '',
        location: '',
        description: '',
        full_story: ''
    };
};

const submitEdit = async () => {
    errorMessage.value = '';
    successMessage.value = '';

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

    if (!editForm.value.full_story.trim()) {
        errorMessage.value = 'Cerita lengkap harus diisi';
        return;
    }

    submitting.value = true;

    try {
        await storyService.updateStory(editForm.value.id, {
            title: editForm.value.title.trim(),
            location: editForm.value.location.trim(),
            description: editForm.value.description.trim(),
            full_story: editForm.value.full_story.trim()
        });

        successMessage.value = `Cerita "${editForm.value.title}" berhasil diupdate!`;

        const index = myStories.value.findIndex(story => story.id === editForm.value.id);
        if (index !== -1) {
            myStories.value[index] = {
                ...myStories.value[index],
                title: editForm.value.title,
                location: editForm.value.location,
                description: editForm.value.description,
                full_story: editForm.value.full_story,
                updated_at: new Date().toISOString()
            };
        }

        setTimeout(() => {
            cancelEdit();
            successMessage.value = '';
        }, 1500);
    } catch (error) {
        errorMessage.value = error.message || 'Gagal mengupdate cerita';
    } finally {
        submitting.value = false;
    }
};

const openStoryDetail = (story) => {
    selectedStory.value = story;
    isEditMode.value = false;
};

const backToList = () => {
    selectedStory.value = null;
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