export const mapRoomFormToDto = (form) => {
    return {
        rental_type: form.rental_type,
        boarding_house_id: form.boarding_house_id || null,

        location: form.location,

        fee: {
            electric: Number(form.fee.electric) || 0,
            water: Number(form.fee.water) || 0,
            wifi: Number(form.fee.wifi) || 0,
            other: form.fee.other || '',
        },

        room: {
            title: form.room.title,
            price: Number(form.room.price),
            area: Number(form.room.area) || null,
            floor: Number(form.room.floor) || null,
            room_number: form.room.room_number || '',
            description: form.room.description,
        },
    };
};
