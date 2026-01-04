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

            <div v-if="!isEditMode && !selectedStory" class="flex-1 overflow-y-auto -mx-6 px-6 no-scrollbar">
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

            <div v-if="isEditMode" class="flex-1 overflow-y-auto -mx-6 px-6 no-scrollbar">
                <div class="space-y-4">
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text font-semibold mb-1">Judul Cerita</span>
                        </label>
                        <input v-model="editForm.title" type="text" placeholder="Masukkan judul cerita"
                            class="input input-bordered w-full" @input="clearError" />
                    </div>

                    <div class="form-control">
                        <label class="label">
                            <span class="label-text font-semibold mb-1">Lokasi</span>
                        </label>
                        <input v-model="editForm.location" type="text" placeholder="Contoh: Bandung, Jawa Barat"
                            class="input input-bordered w-full" @input="clearError" />
                    </div>

                    <div class="form-control">
                        <label class="label">
                            <span class="label-text font-semibold mb-1">Deskripsi Singkat</span>
                        </label>
                        <textarea v-model="editForm.description" placeholder="Deskripsi singkat cerita..."
                            class="textarea textarea-bordered h-24 w-full" @input="clearError"></textarea>
                        <label class="label">
                            <span class="label-text-alt opacity-60">{{ editForm.description.length }} karakter</span>
                        </label>
                    </div>

                    <div class="form-control">
                        <label class="label">
                            <span class="label-text font-semibold mb-1">Cerita Lengkap</span>
                        </label>
                        <textarea v-model="editForm.full_story" placeholder="Tulis cerita lengkap di sini..."
                            class="textarea textarea-bordered h-64 w-full" @input="clearError"></textarea>
                        <label class="label">
                            <span class="label-text-alt opacity-60">{{ editForm.full_story.length }} karakter</span>
                        </label>
                    </div>
                </div>
            </div>

            <div v-if="selectedStory && !isEditMode" class="flex-1 overflow-y-auto -mx-6 px-6 no-scrollbar">
                <div class="space-y-6">
                    <div>
                        <div class="mb-3">
                            <p class="font-semibold">{{ selectedStory.author }}</p>
                            <p class="text-xs opacity-60">{{ selectedStory.date }}</p>
                        </div>
                        <div class="flex items-center gap-2 text-sm opacity-70">
                            <MapPin :size="16" />
                            <span>{{ selectedStory.location }}</span>
                        </div>
                    </div>

                    <div class="divider"></div>

                    <div class="prose max-w-none">
                        <p class="text-base leading-relaxed whitespace-pre-line">{{ selectedStory.full_story }}</p>
                    </div>
                </div>
            </div>

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
                <button @click="closeDeleteModal" class="btn btn-sm btn-circle btn-ghost">
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

            <div v-if="storyToDelete" class="py-4">
                <p class="mb-4">Apakah Anda yakin ingin menghapus cerita ini?</p>
                <div class="card bg-base-200">
                    <div class="card-body p-4">
                        <div class="flex gap-3 items-start">
                            <div>
                                <p class="font-bold">{{ storyToDelete.title }}</p>
                                <p class="text-sm opacity-60 mb-1">{{ storyToDelete.location }}</p>
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
import { ref } from 'vue';
import { X, BookOpen, MapPin, Calendar, Edit, Trash2 } from 'lucide-vue-next';

const isEditMode = ref(false);
const submitting = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const selectedStory = ref(null);
const storyToDelete = ref(null);
const deleting = ref(false);
const deleteErrorMessage = ref('');

const myStories = ref([
    {
        id: 1,
        title: 'Legenda Tangkuban Perahu',
        author: 'Anda',
        location: 'Bandung, Jawa Barat',
        date: '15 Des 2024',
        description: 'Kisah legenda Sangkuriang dan Dayang Sumbi yang menciptakan Gunung Tangkuban Perahu dalam semalam.',
        full_story: `Dahulu kala, hiduplah seorang putri cantik bernama Dayang Sumbi. Suatu hari, ia menjatuhkan alat tenunnya dan bersumpah akan menikahi siapa saja yang mengambilkannya. Seekor anjing bernama Tumang mengambilkan alat tersebut, dan Dayang Sumbi harus menepati sumpahnya.

Dari pernikahan tersebut, lahirlah seorang anak laki-laki bernama Sangkuriang. Ia tumbuh menjadi pemuda yang gagah dan suka berburu. Suatu hari, saat berburu bersama Tumang, Sangkuriang menjadi marah karena tidak mendapat buruan dan membunuh Tumang.

Ketika mengetahui hal ini, Dayang Sumbi sangat marah dan memukul kepala Sangkuriang hingga luka. Sangkuriang pergi meninggalkan ibunya dan mengembara selama bertahun-tahun.

Bertahun-tahun kemudian, Sangkuriang kembali ke kampung halamannya dan bertemu dengan seorang wanita cantik yang tak lain adalah ibunya sendiri. Karena kesaktiannya, Dayang Sumbi tetap terlihat muda. Mereka saling jatuh cinta dan berencana menikah.

Menjelang pernikahan, Dayang Sumbi menyadari bahwa calon suaminya adalah anaknya sendiri dari bekas luka di kepala Sangkuriang. Untuk menggagalkan pernikahan, ia memberikan syarat yang mustahil: Sangkuriang harus membuat sebuah perahu dan bendungan dalam waktu satu malam.

Dengan kesaktiannya, Sangkuriang hampir berhasil menyelesaikan tugas tersebut. Dayang Sumbi panik dan meminta penduduk menumbuk lesung agar ayam jantan berkokok. Sangkuriang mengira matahari akan terbit dan menendang perahu yang belum selesai. Perahu itu terbalik dan menjadi Gunung Tangkuban Perahu.`
    },
    {
        id: 2,
        title: 'Cerita Malin Kundang',
        author: 'Anda',
        location: 'Padang, Sumatera Barat',
        date: '10 Des 2024',
        description: 'Legenda tentang anak durhaka yang dikutuk menjadi batu karena tidak mengakui ibunya sendiri.',
        full_story: `Malin Kundang adalah seorang anak laki-laki yang hidup bersama ibunya di sebuah desa nelayan miskin. Ayahnya telah meninggal saat melaut ketika Malin masih kecil.

Suatu hari, Malin memutuskan untuk pergi merantau mencari kehidupan yang lebih baik. Dengan berat hati, ibunya melepas kepergian Malin dengan harapan suatu hari ia akan kembali sebagai orang sukses.

Di tanah perantauan, Malin bekerja keras dan beruntung bertemu dengan seorang saudagar kaya yang tidak memiliki anak. Ia diangkat sebagai anak dan mewarisi semua harta saudagar tersebut. Malin menikah dengan putri saudagar yang cantik jelita.

Bertahun-tahun kemudian, Malin berlayar kembali ke kampung halamannya dengan kapal mewah. Ibunya yang sudah tua mendengar kabar kedatangan kapal besar dan berlari ke pelabuhan. Dengan air mata, ia memeluk Malin yang sudah tidak dikenalinya.

Namun Malin, yang malu dengan ibu tuanya yang kumuh di depan istri cantiknya, mengusir ibunya dengan kasar. Ia bahkan tidak mengakui bahwa wanita tua itu adalah ibunya.

Hati ibu Malin hancur berkeping-keping. Dengan penuh kesedihan, ia mengangkat tangannya ke langit dan berdoa agar Malin mendapat balasan atas perbuatannya. Tiba-tiba langit menjadi gelap, angin bertiup kencang, dan badai besar menghantam kapal Malin.

Malin Kundang berubah menjadi batu di tepi pantai, menjadi pengingat abadi tentang akibat durhaka kepada orang tua.`
    },
    {
        id: 3,
        title: 'Batu Menangis',
        author: 'Anda',
        location: 'Kalimantan Barat',
        date: '5 Des 2024',
        description: 'Kisah seorang anak perempuan yang durhaka kepada ibunya dan dikutuk menjadi batu yang menangis.',
        full_story: `Di sebuah desa di Kalimantan, hiduplah seorang janda miskin bersama putrinya yang cantik jelita. Sang ibu bekerja keras sebagai petani untuk membesarkan anaknya sendirian.

Putrinya tumbuh menjadi gadis yang sangat cantik, namun sombong dan tidak menghargai ibunya. Ia malu memiliki ibu yang miskin dan berkulit hitam karena bekerja di bawah terik matahari.

Suatu hari, ada pesta besar di desa sebelah. Sang putri berdandan dengan sangat cantik dan meminta ibunya untuk tidak ikut. Namun sang ibu tetap ingin menemani anaknya.

Di tengah perjalanan, setiap kali ada orang yang bertanya siapa wanita tua yang bersamanya, si gadis selalu menjawab bahwa itu adalah pembantunya, bukan ibunya. Berkali-kali ia melakukan hal yang sama.

Hati sang ibu sangat terluka mendengar pengakuan anaknya. Dengan air mata, ia berdoa kepada Tuhan agar anaknya mendapat pelajaran.

Tiba-tiba hujan deras turun dan petir menyambar. Kaki si gadis mulai membatu, perlahan naik ke tubuhnya. Ia menangis memohon ampun kepada ibunya, tetapi sudah terlambat.

Tubuh gadis cantik itu berubah menjadi batu. Hingga kini, batu tersebut masih ada dan selalu mengeluarkan air seperti air mata, seolah-olah terus menangis menyesali perbuatannya.`
    }
]);

const editForm = ref({
    id: null,
    title: '',
    location: '',
    description: '',
    full_story: ''
});

const clearError = () => {
    errorMessage.value = '';
};

const clearSuccess = () => {
    successMessage.value = '';
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

const confirmDelete = () => {
    if (!storyToDelete.value) return;

    deleting.value = true;
    deleteErrorMessage.value = '';

    setTimeout(() => {
        deleting.value = false;
        const index = myStories.value.findIndex(story => story.id === storyToDelete.value.id);
        if (index !== -1) {
            myStories.value.splice(index, 1);
        }

        successMessage.value = `Cerita "${storyToDelete.value.title}" berhasil dihapus!`;

        closeDeleteModal();

        setTimeout(() => {
            successMessage.value = '';
        }, 1000);
    }, 1000);
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

const submitEdit = () => {
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

    setTimeout(() => {
        submitting.value = false;
        successMessage.value = `Cerita "${editForm.value.title}" berhasil diupdate!`;

        const index = myStories.value.findIndex(story => story.id === editForm.value.id);
        if (index !== -1) {
            myStories.value[index] = {
                ...myStories.value[index],
                title: editForm.value.title,
                location: editForm.value.location,
                description: editForm.value.description,
                full_story: editForm.value.full_story
            };
        }

        setTimeout(() => {
            cancelEdit();
        }, 1000);
    }, 1000);
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