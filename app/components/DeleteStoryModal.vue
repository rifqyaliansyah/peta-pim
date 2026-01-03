<template>
    <dialog id="delete_story_modal" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-bold text-error">Hapus Cerita</h3>
                <button @click="closeModal" class="btn btn-sm btn-circle btn-ghost">
                    <X :size="18" />
                </button>
            </div>

            <div v-if="errorMessage" class="alert alert-error mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ errorMessage }}</span>
            </div>

            <div v-if="selectedStory" class="py-4">
                <p class="mb-4">Apakah Anda yakin ingin menghapus cerita ini?</p>
                <div class="card bg-base-200">
                    <div class="card-body p-4">
                        <div class="space-y-2">
                            <h4 class="font-bold text-base">{{ selectedStory.title }}</h4>
                            <div class="flex items-center gap-2 text-sm opacity-70">
                                <MapPin :size="14" />
                                <span>{{ selectedStory.location }}</span>
                            </div>
                            <p class="text-sm opacity-80 line-clamp-2">{{ selectedStory.description }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal-action">
                <button @click="closeModal" class="btn btn-ghost" :disabled="deleting">Batal</button>
                <button @click="submitDelete" class="btn btn-error" :disabled="deleting">
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
import { ref } from 'vue';
import { X, MapPin } from 'lucide-vue-next';

const deleting = ref(false);
const errorMessage = ref('');
const selectedStory = ref(null);

const openModal = (story) => {
    selectedStory.value = story;
    errorMessage.value = '';
    document.getElementById('delete_story_modal').showModal();
};

const closeModal = () => {
    document.getElementById('delete_story_modal').close();
    errorMessage.value = '';
    selectedStory.value = null;
};

const submitDelete = () => {
    if (!selectedStory.value) return;

    deleting.value = true;

    setTimeout(() => {
        deleting.value = false;
        alert(`Cerita "${selectedStory.value.title}" berhasil dihapus! (dummy)`);
        closeModal();
    }, 1000);
};

defineExpose({
    openModal
});
</script>