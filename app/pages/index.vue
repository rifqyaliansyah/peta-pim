<template>
    <div class="map-wrapper">
        <LMap :zoom="5" :center="[-2.5489, 118.0149]" :use-global-leaflet="false" @click="addMarker">
            <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
                layer-type="base" name="OpenStreetMap" />

            <LMarker v-if="marker" :lat-lng="marker.position" draggable @dragend="updateMarkerPosition">
                <LPopup>
                    <div>
                        <p><strong>Lokasi Marker</strong></p>
                        <p>Lat: {{ marker.position[0].toFixed(4) }}</p>
                        <p>Lng: {{ marker.position[1].toFixed(4) }}</p>
                    </div>
                </LPopup>
            </LMarker>
        </LMap>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'map'
})

const marker = ref(null)

const addMarker = (event) => {
    marker.value = {
        position: [event.latlng.lat, event.latlng.lng]
    }
}

const updateMarkerPosition = (event) => {
    const { lat, lng } = event.target.getLatLng()
    marker.value.position = [lat, lng]
}
</script>

<style scoped>
.map-wrapper {
    width: 100%;
    height: 100%;
}
</style>