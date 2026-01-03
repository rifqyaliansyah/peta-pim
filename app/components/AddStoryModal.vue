<template>
    <dialog id="add_story_modal" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box max-w-2xl no-scrollbar">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-bold">Tambah Cerita Baru</h3>
                <button @click="closeModal" class="btn btn-sm btn-circle btn-ghost">
                    <X :size="20" />
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

            <div class="space-y-4">
                <div class="alert alert-info">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        class="stroke-current shrink-0 w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span class="text-sm">Koordinat: {{ coordinates.lat.toFixed(6) }}, {{ coordinates.lng.toFixed(6)
                    }}</span>
                </div>
                <div class="form-control">
                    <label class="label">
                        <span class="label-text font-semibold mb-1">Judul Cerita</span>
                    </label>
                    <input v-model="form.title" type="text" placeholder="Masukkan judul cerita"
                        class="input input-bordered w-full" />
                </div>

                <div class="form-control">
                    <label class="label">
                        <span class="label-text font-semibold mb-1">Lokasi</span>
                    </label>
                    <input v-model="form.location" type="text" placeholder="Contoh: Bandung, Jawa Barat"
                        class="input input-bordered w-full" />
                </div>

                <div class="form-control">
                    <label class="label">
                        <span class="label-text font-semibold mb-1">Deskripsi</span>
                    </label>
                    <textarea v-model="form.description" placeholder="Ceritakan kisah atau legenda ini..."
                        class="textarea textarea-bordered h-32 w-full"></textarea>
                    <label class="label">
                        <span class="label-text-alt opacity-60">{{ form.description.length }} karakter</span>
                    </label>
                </div>
            </div>

            <div class="modal-action mt-6">
                <button @click="closeModal" class="btn btn-ghost" :disabled="submitting">Batal</button>
                <button @click="submitForm" class="btn btn-primary" :disabled="submitting">
                    <span v-if="submitting" class="loading loading-spinner"></span>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    {{ submitting ? 'Menyimpan...' : 'Tambah Cerita' }}
                </button>
            </div>
        </div>
    </dialog>
</template>

<script setup>
import { X } from 'lucide-vue-next';

const emit = defineEmits(['submit']);

const submitting = ref(false);
const errorMessage = ref('');
const coordinates = ref({ lat: 0, lng: 0 });

const form = ref({
    title: '',
    location: '',
    description: ''
});

const openModal = (coords) => {
    coordinates.value = coords;
    form.value = {
        title: '',
        location: '',
        description: ''
    };
    errorMessage.value = '';
    document.getElementById('add_story_modal').showModal();
};

const closeModal = () => {
    document.getElementById('add_story_modal').close();
    errorMessage.value = '';
};

const submitForm = () => {
    errorMessage.value = '';

    if (!form.value.title.trim()) {
        errorMessage.value = 'Judul cerita harus diisi';
        return;
    }

    if (!form.value.location.trim()) {
        errorMessage.value = 'Lokasi harus diisi';
        return;
    }

    if (!form.value.description.trim()) {
        errorMessage.value = 'Deskripsi harus diisi';
        return;
    }

    submitting.value = true;

    setTimeout(() => {
        submitting.value = false;
        emit('submit', {
            ...form.value,
            coordinates: coordinates.value
        });
        closeModal();
    }, 1000);
};

defineExpose({
    openModal
});
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