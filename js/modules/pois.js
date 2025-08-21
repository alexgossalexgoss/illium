export async function loadPOIs({ visibleOnly = false, excludeVisible = false } = {}) {
  const res = await fetch('pois.json');
  const all = await res.json();

  if (visibleOnly) return all.filter(p => !!p.visible);
  if (excludeVisible) return all.filter(p => !p.visible);
  return all;
}
