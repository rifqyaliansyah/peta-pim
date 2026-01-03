export const useAddStoryMode = () => {
    const isAddMode = useState('isAddMode', () => false);
    const tempMarker = useState('tempMarker', () => null);

    const startAddMode = () => {
        isAddMode.value = true;
        tempMarker.value = null;
    };

    const exitAddMode = () => {
        isAddMode.value = false;
        tempMarker.value = null;
    };

    const setTempMarker = (position) => {
        tempMarker.value = position;
    };

    const clearTempMarker = () => {
        tempMarker.value = null;
    };

    return {
        isAddMode,
        tempMarker,
        startAddMode,
        exitAddMode,
        setTempMarker,
        clearTempMarker
    };
};