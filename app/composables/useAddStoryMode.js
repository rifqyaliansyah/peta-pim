export const useAddStoryMode = () => {
    const isAddMode = useState('isAddMode', () => false);
    const tempMarker = useState('tempMarker', () => null);
    const tempLocation = useState('tempLocation', () => null);

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

    const setTempLocation = (location) => {
        tempLocation.value = location;
    };

    const clearTempLocation = () => {
        tempLocation.value = null;
    };

    return {
        isAddMode,
        tempMarker,
        tempLocation,
        startAddMode,
        exitAddMode,
        setTempMarker,
        clearTempMarker,
        setTempLocation,
        clearTempLocation
    };
};