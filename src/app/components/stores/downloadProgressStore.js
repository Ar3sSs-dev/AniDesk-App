import { writable } from 'svelte/store';

// Maps downloadId (animeId_episodeId) to percent (0-100, -1 error, -2 queued)
export const downloadProgressStore = writable({});

if (window.offlineApi) {
    offlineApi.getLibrary().then(library => {
        downloadProgressStore.update(store => {
            for (const anime of library) {
                for (const ep of anime.episodes) {
                    store[`${anime.id}_${ep.id}`] = 100;
                }
            }
            return store;
        });
    });

    window.offlineApi.onProgress((data) => {
        downloadProgressStore.update(store => {
            const id = `${data.animeId}_${data.episodeId}`;
            if (data.percent === -1) {
                delete store[id]; // Cancelled or error
            } else {
                store[id] = data.percent;
            }
            return { ...store };
        });
    });

    window.offlineApi.onError((data) => {
        downloadProgressStore.update(store => {
            const id = `${data.animeId}_${data.episodeId}`;
            store[id] = -1; // Indicates error
            return { ...store };
        });
    });
}
