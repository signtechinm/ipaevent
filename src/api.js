export async function apiRequest(path, options = {}) {
    const response = await fetch(`/api/${path}`, {
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(payload.error || 'Request failed.');
    }

    return payload;
}
