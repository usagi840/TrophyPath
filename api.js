/* ============================================================
   API.JS — Communication avec le Worker Cloudflare (données joueur)
   ============================================================ */

async function fetchBsPlayer(tag){
  const clean = (tag.startsWith('#') ? tag.slice(1) : tag).toUpperCase().trim();
  const res = await fetch(CONFIG.WORKER_URL + encodeURIComponent(clean));
  if(!res.ok) throw new Error('Joueur introuvable');
  const data = await res.json();
  if(data.error) throw new Error('Joueur introuvable');
  return data;
}
