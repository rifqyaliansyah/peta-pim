<template>
    <dialog id="add_story_modal" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box max-w-2xl no-scrollbar">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-bold">Tambah Cerita Baru</h3>
                <button @click="closeModal" class="btn btn-sm btn-circle btn-ghost">
                    <X :size="20" />
                </button>
            </div>

            <!-- Error Alert -->
            <div v-if="errorMessage" class="alert alert-error mb-4">
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
            <div v-if="successMessage" class="alert alert-success mb-4">
                <div class="flex items-center gap-2 w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="flex-1">{{ successMessage }}</span>
                </div>
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
                        class="input input-bordered w-full" @input="clearError" />
                </div>

                <div class="form-control">
                    <label class="label">
                        <span class="label-text font-semibold mb-1">Lokasi</span>
                    </label>
                    <input v-model="form.location" type="text" placeholder="Contoh: Bandung, Jawa Barat"
                        class="input input-bordered w-full" @input="clearError" />
                </div>

                <div class="form-control">
                    <label class="label">
                        <span class="label-text font-semibold mb-1">Deskripsi Singkat</span>
                    </label>
                    <textarea v-model="form.description" placeholder="Deskripsi singkat cerita..."
                        class="textarea textarea-bordered h-24 w-full" @input="clearError"></textarea>
                    <label class="label">
                        <span class="label-text-alt opacity-60">{{ form.description.length }} karakter</span>
                    </label>
                </div>

                <div class="form-control">
                    <label class="label">
                        <span class="label-text font-semibold mb-1">Cerita Lengkap</span>
                    </label>
                    <textarea v-model="form.full_story" placeholder="Tulis cerita lengkap di sini..."
                        class="textarea textarea-bordered h-64 w-full" @input="clearError"></textarea>
                    <label class="label">
                        <span class="label-text-alt opacity-60">{{ form.full_story.length }} karakter</span>
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
import { ref } from 'vue';

const emit = defineEmits(['submit']);

const submitting = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const coordinates = ref({ lat: 0, lng: 0 });

const form = ref({
    title: '',
    location: '',
    description: '',
    full_story: ''
});

const openModal = (coords) => {
    coordinates.value = coords;
    form.value = {
        title: '',
        location: '',
        description: '',
        full_story: ''
    };
    errorMessage.value = '';
    successMessage.value = '';
    document.getElementById('add_story_modal').showModal();
};

const clearError = () => {
    errorMessage.value = '';
};

const clearSuccess = () => {
    successMessage.value = '';
};

const closeModal = () => {
    document.getElementById('add_story_modal').close();
    errorMessage.value = '';
    successMessage.value = '';
};

const submitForm = () => {
    errorMessage.value = '';
    successMessage.value = '';

    if (!form.value.title.trim()) {
        errorMessage.value = 'Judul cerita harus diisi';
        return;
    }

    if (!form.value.location.trim()) {
        errorMessage.value = 'Lokasi harus diisi';
        return;
    }

    if (!form.value.description.trim()) {
        errorMessage.value = 'Deskripsi singkat harus diisi';
        return;
    }

    if (!form.value.full_story.trim()) {
        errorMessage.value = 'Cerita lengkap harus diisi';
        return;
    }

    submitting.value = true;

    setTimeout(() => {
        submitting.value = false;
        successMessage.value = `Cerita "${form.value.title}" berhasil ditambahkan!`;

        setTimeout(() => {
            emit('submit', {
                ...form.value,
                coordinates: coordinates.value
            });
            closeModal();
        }, 1000);
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