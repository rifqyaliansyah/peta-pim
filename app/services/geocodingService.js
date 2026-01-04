export const geocodingService = {
    async reverseGeocode(lat, lng) {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
                {
                    headers: {
                        'Accept-Language': 'id'
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Gagal mendapatkan informasi lokasi');
            }

            const data = await response.json();

            const address = data.address;
            const parts = [];

            if (address.village || address.suburb || address.neighbourhood) {
                parts.push(address.village || address.suburb || address.neighbourhood);
            }
            if (address.city || address.town || address.county) {
                parts.push(address.city || address.town || address.county);
            }
            if (address.state) {
                parts.push(address.state);
            }
            if (address.country) {
                parts.push(address.country);
            }

            return {
                success: true,
                displayName: data.display_name,
                formattedAddress: parts.join(', ') || data.display_name,
                fullData: data
            };
        } catch (error) {
            console.error('Reverse geocoding error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }
};