// js/modules/pois.js
export async function loadPOIs({ visibleOnly = false, excludeVisible = false } = {}) {
  try {
    const v = '2025-08-21-4'; // bump to bust mobile cache
    const res = await fetch(`pois.json?v=${v}`, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const all = await res.json();

    if (visibleOnly) return all.filter(p => !!p.visible);
    if (excludeVisible) return all.filter(p => !p.visible);
    return all;
  } catch (err) {
    console.warn('[POIs] Failed to load pois.json:', err);
    return [];
  }
}
