export const uploadRoomImages = (files, meta) => {
    const form = new FormData();
    files.forEach(f => form.append('files', f));
    Object.entries(meta).forEach(([k, v]) =>
        form.append(k, v)
    );

    return fetch('/api/uploads', {
        method: 'POST',
        body: form,
    }).then(res => res.json());
};
