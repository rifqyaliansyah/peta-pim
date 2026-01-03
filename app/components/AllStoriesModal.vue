<template>
    <dialog id="all_stories_modal" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box max-w-4xl flex flex-col max-h-[90vh]">
            <div class="flex items-center justify-between mb-6 shrink-0">
                <div>
                    <h3 class="text-xl font-bold">{{ selectedStory ? selectedStory.title : 'Semua Cerita' }}</h3>
                    <p v-if="!selectedStory" class="text-sm opacity-60 mt-1">{{ allStories.length }} cerita dari
                        komunitas</p>
                </div>
                <button @click="closeModal" class="btn btn-sm btn-circle btn-ghost">
                    <X :size="20" />
                </button>
            </div>

            <div v-if="!selectedStory" class="mb-4 shrink-0">
                <input v-model="searchQuery" type="search" placeholder="Cari cerita..."
                    class="input input-bordered w-full" />
            </div>

            <div v-if="!selectedStory" class="flex-1 overflow-y-auto -mx-6 px-6 no-scrollbar">
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
                                    <p class="text-sm opacity-80">{{ story.description }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else class="flex-1 overflow-y-auto -mx-6 px-6 no-scrollbar">
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
                <button v-if="!selectedStory" @click="closeModal" class="btn btn-ghost">Tutup</button>
                <button v-else @click="backToList" class="btn btn-ghost">Kembali</button>
            </div>
        </div>
    </dialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import { X, MapPin, Calendar } from 'lucide-vue-next';
const searchQuery = ref('');
const selectedStory = ref(null);

const allStories = ref([
    {
        id: 1,
        title: 'Legenda Tangkuban Perahu',
        author: 'Budi Santoso',
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
        author: 'Siti Aminah',
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
        author: 'Ahmad Fauzi',
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
    },
    {
        id: 4,
        title: 'Roro Jonggrang',
        author: 'Dewi Lestari',
        location: 'Yogyakarta',
        date: '3 Des 2024',
        description: 'Legenda tentang Roro Jonggrang yang dikutuk menjadi arca ke-1000 di Candi Prambanan.',
        full_story: `Roro Jonggrang adalah putri cantik dari Kerajaan Boko. Suatu hari, Kerajaannya diserang oleh Pangeran Bandung Bondowoso. Dalam peperangan tersebut, ayah Roro Jonggrang terbunuh.

Bandung Bondowoso yang melihat kecantikan Roro Jonggrang jatuh cinta dan ingin menikahinya. Roro Jonggrang tidak bisa menolak secara langsung karena takut kerajaannya hancur.

Dengan licik, Roro Jonggrang memberikan syarat yang ia anggap mustahil: Bandung Bondowoso harus membangun 1000 candi dalam satu malam sebelum fajar menyingsing.

Bandung Bondowoso menyanggupi syarat tersebut. Dengan bantuan jin dan makhluk gaib, ia mulai membangun candi-candi tersebut dengan sangat cepat. Menjelang pagi, hampir 1000 candi telah selesai dibangun.

Roro Jonggrang menjadi panik melihat hal ini. Ia kemudian meminta para dayang untuk menumbuk lesung dan membakar jerami di sebelah timur, menciptakan ilusi bahwa fajar telah tiba.

Ayam jantan berkokok, dan para jin meninggalkan pekerjaan mereka. Bandung Bondowoso menghitung candi yang telah dibangun dan menemukan bahwa baru 999 candi yang selesai.

Mengetahui bahwa ia ditipu oleh Roro Jonggrang, Bandung Bondowoso sangat marah. Dalam kemarahannya, ia mengutuk Roro Jonggrang menjadi arca ke-1000 untuk melengkapi candi yang ia bangun.

Hingga kini, arca tersebut dapat dilihat di Candi Prambanan sebagai candi utama yang disebut Candi Roro Jonggrang atau Candi Prambanan.`
    },
    {
        id: 5,
        title: 'Timun Mas',
        author: 'Joko Widodo',
        location: 'Jawa Tengah',
        date: '1 Des 2024',
        description: 'Kisah seorang gadis yang melarikan diri dari raksasa dengan menggunakan benda-benda sakti.',
        full_story: `Mbok Srini adalah seorang janda tua yang sangat ingin memiliki anak. Suatu hari, seorang raksasa hijau bernama Buto Ijo datang menawarkan bantuan. Ia akan memberikan biji mentimun ajaib yang akan menghasilkan seorang bayi.

Sebagai gantinya, ketika anak tersebut berusia 17 tahun, Mbok Srini harus menyerahkannya kepada Buto Ijo untuk dimakan. Karena sangat ingin memiliki anak, Mbok Srini menyetujui persyaratan tersebut.

Dari biji mentimun tersebut, lahirlah seorang bayi perempuan cantik yang diberi nama Timun Mas. Ia tumbuh menjadi gadis yang cantik dan baik hati.

Ketika Timun Mas hampir berusia 17 tahun, Mbok Srini sangat sedih dan khawatir. Ia menemui seorang pertapa untuk meminta bantuan. Pertapa tersebut memberikan empat bungkusan ajaib: biji mentimun, jarum, garam, dan terasi.

Saat Buto Ijo datang menagih janji, Mbok Srini menyuruh Timun Mas lari. Buto Ijo mengejar Timun Mas dengan sangat cepat. Ketika hampir tertangkap, Timun Mas melempar biji mentimun. Seketika tumbuhlah kebun mentimun yang lebat yang menghalangi Buto Ijo.

Buto Ijo berhasil melewatinya dan kembali mengejar. Timun Mas melempar jarum, dan terbentuklah hutan bambu yang tajam. Kemudian ia melempar garam yang berubah menjadi lautan luas. Terakhir, ia melempar terasi yang berubah menjadi lautan lumpur mendidih.

Buto Ijo terjebak dalam lumpur mendidih dan tenggelam hingga mati. Timun Mas selamat dan kembali ke rumahnya untuk hidup bahagia bersama Mbok Srini.`
    },
    {
        id: 6,
        title: 'Danau Toba',
        author: 'Ratna Sari',
        location: 'Sumatera Utara',
        date: '28 Nov 2024',
        description: 'Legenda asal-usul Danau Toba dan Pulau Samosir dari kisah seorang pemuda dan ikan emas.',
        full_story: `Di Sumatera Utara, hiduplah seorang pemuda petani yang rajin dan baik hati. Suatu hari saat memancing, ia menangkap seekor ikan emas yang sangat besar dan cantik.

Betapa terkejutnya ia ketika ikan tersebut berubah menjadi seorang wanita cantik jelita. Wanita tersebut adalah putri dari kahyangan yang dikutuk menjadi ikan. Ia berterima kasih kepada pemuda itu karena telah menangkapnya.

Sang putri bersedia menikah dengan pemuda tersebut dengan satu syarat: ia tidak boleh menceritakan asal-usulnya kepada siapa pun. Jika syarat itu dilanggar, akan terjadi bencana besar.

Mereka menikah dan hidup bahagia. Dari pernikahan mereka, lahirlah seorang anak laki-laki yang diberi nama Samosir. Anak tersebut tumbuh menjadi anak yang nakal dan pemalas.

Suatu hari, sang ibu meminta Samosir mengantarkan makanan ke ladang untuk ayahnya. Namun dalam perjalanan, Samosir memakan semua makanan tersebut. Sang ayah yang kelaparan menjadi sangat marah.

Dalam kemarahannya, sang ayah tanpa sadar berteriak: "Dasar anak ikan!" Seketika itu, langit menjadi gelap, petir menyambar, dan hujan lebat turun tanpa henti.

Sang istri dan anak laki-laki menghilang. Dari bekas tempat berdiri mereka, muncullah mata air yang sangat besar dan terus mengalir hingga menggenangi seluruh lembah, membentuk sebuah danau yang sangat luas.

Danau itulah yang sekarang dikenal sebagai Danau Toba. Dan pulau di tengahnya dinamakan Pulau Samosir, sebagai pengingat akan anak laki-laki yang nakal tersebut.`
    },
    {
        id: 7,
        title: 'Lutung Kasarung',
        author: 'Andi Pratama',
        location: 'Jawa Barat',
        date: '25 Nov 2024',
        description: 'Kisah tentang seorang pangeran yang dikutuk menjadi lutung dan kisah cintanya dengan putri.',
        full_story: `Di Kerajaan Pasir Batang, Raja Tapa Agung memiliki dua orang putri: Purbararang yang cantik namun sombong, dan Purbasari yang cantik dan baik hati. Sang raja ingin mengangkat Purbasari sebagai pengganti tahta.

Purbararang yang iri hati meminta bantuan seorang nenek sihir untuk mengutuk adiknya. Purbasari dikutuk sehingga kulitnya menjadi hitam dan kasar seperti terkena penyakit kulit.

Melihat kondisi tersebut, Purbasari diusir ke hutan. Di hutan, ia bertemu dengan seekor lutung (monyet hitam) besar yang baik hati. Lutung tersebut selalu melindungi dan menemaninya.

Suatu hari, Lutung Kasarung membawa Purbasari ke sebuah gua dengan mata air ajaib. Setelah mandi di mata air tersebut, kulit Purbasari kembali menjadi putih bersih dan cantik seperti semula.

Purbararang mendengar kabar bahwa Purbasari telah sembuh dan merasa terancam. Ia menantang adiknya untuk berkompetisi, termasuk adu ketampanan suami mereka.

Purbararang membawa Indrajaya, tunangannya yang tampan. Sementara Purbasari hanya memiliki Lutung Kasarung. Namun ketika waktunya tiba, Lutung Kasarung melepaskan kulitnya dan berubah menjadi Guruminda, seorang pangeran yang tampan dan gagah.

Ternyata Guruminda adalah seorang pangeran dari kerajaan lain yang dikutuk menjadi lutung karena menolak menikah dengan putri seorang penyihir jahat. Kutukan itu akan hilang jika ia menemukan cinta sejati yang tulus.

Akhirnya Purbasari dan Guruminda menikah dan memerintah kerajaan dengan bijaksana. Sementara Purbararang menyesali perbuatannya.`
    },
    {
        id: 8,
        title: 'Bawang Merah Bawang Putih',
        author: 'Lina Marlina',
        location: 'Jawa Timur',
        date: '20 Nov 2024',
        description: 'Cerita tentang dua saudara tiri dengan karakter berbeda dan balasan atas perbuatan mereka.',
        full_story: `Bawang Putih adalah seorang gadis yatim piatu yang tinggal bersama ibu tiri dan kakak tirinya, Bawang Merah. Setelah ayahnya meninggal, ibu tiri memperlakukannya dengan sangat buruk, seperti pembantu.

Bawang Putih harus mengerjakan semua pekerjaan rumah sendirian, sementara Bawang Merah dan ibunya hanya bermalas-malasan. Meskipun diperlakukan dengan buruk, Bawang Putih tetap sabar dan baik hati.

Suatu hari saat mencuci di sungai, Bawang Putih kehilangan selembar kain milik ibu tirinya. Ia mengikuti aliran sungai hingga bertemu seorang nenek tua. Nenek tersebut berkata ia akan mengembalikan kain itu jika Bawang Putih mau membantunya bekerja.

Bawang Putih dengan senang hati membantu nenek tersebut. Setelah pekerjaannya selesai, nenek itu menyuruhnya memilih labu sebagai hadiah. Bawang Putih memilih labu yang kecil karena tidak ingin merepotkan.

Sesampainya di rumah, ketika labu itu dipecahkan, keluarlah emas, permata, dan perhiasan yang sangat banyak. Ibu tiri dan Bawang Merah menjadi iri.

Mereka menyuruh Bawang Merah melakukan hal yang sama. Namun Bawang Merah malas membantu nenek tersebut dan hanya ingin cepat mendapat hadiah. Ia memilih labu yang besar dengan rakus.

Sesampainya di rumah, ketika labu besar itu dipecahkan, keluarlah ular berbisa, kalajengking, dan binatang-binatang berbahaya lainnya yang mengejar mereka.

Sejak saat itu, ibu tiri dan Bawang Merah menjadi sadar akan kesalahan mereka dan memperlakukan Bawang Putih dengan baik. Mereka hidup rukun dan bahagia.`
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
    setTimeout(() => {
        searchQuery.value = '';
        selectedStory.value = null;
    }, 200);
};

const openStoryDetail = (story) => {
    selectedStory.value = story;
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