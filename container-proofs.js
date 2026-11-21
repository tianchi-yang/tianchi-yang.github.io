async function loadContainerProofs() {
  const list = document.getElementById('container-proof-list');
  const status = document.getElementById('container-proof-status');

  try {
    const response = await fetch('container-proofs.json');
    if (!response.ok) throw new Error('Could not fetch the manuscript list.');

    const proofs = await response.json();
    proofs.sort((a, b) => b.date.localeCompare(a.date));
    const visible = list.dataset.limit ? proofs.slice(0, Number(list.dataset.limit)) : proofs;
    if (visible.length === 0) return;

    const existingItems = new Map();
    for (const item of list.children) {
      const link = item.querySelector('a[href]');
      if (link) existingItems.set(link.href, item);
    }

    const items = [];
    for (const proof of visible) {
      const url = new URL(proof.url, window.location.href);
      if (url.protocol !== 'https:' && url.origin !== window.location.origin) {
        throw new Error('Manuscript links must use HTTPS or point to this site.');
      }
      const existingItem = existingItems.get(url.href);
      if (existingItem) {
        items.push(existingItem);
        continue;
      }

      const link = document.createElement('a');
      link.href = url.href;
      link.textContent = proof.title;

      const date = document.createElement('time');
      date.className = 'paper-details';
      date.dateTime = proof.date;
      date.textContent = proof.date;

      const item = document.createElement('li');
      item.append(link, date);
      items.push(item);
    }
    list.replaceChildren(...items);
    list.hidden = false;
    status.hidden = true;
  } catch {
    status.textContent = 'The manuscript list could not be loaded. Please try again later.';
    status.hidden = false;
  }
}

loadContainerProofs();
