/* ============================================================
   CONFIG.JS — Constantes globales, URLs API, données statiques
   ============================================================ */

const CONFIG = {
  WORKER_URL: 'https://tark.alex-usagi84.workers.dev/?tag=',
  BRAND: 'BrawlCard',
  VERSION: '2.0',

  // Formats d'export (largeur x hauteur en pixels, base 1x)
  FORMATS: {
    card:      { w: 760,  h: 1080, label: 'Carte' },
    square:    { w: 1080, h: 1080, label: 'Carré' },
    vertical:  { w: 1080, h: 1920, label: 'Story' },
    horizontal:{ w: 1920, h: 1080, label: 'Horizontal' },
    wallpaper_phone: { w: 1080, h: 2340, label: 'Fond d\'écran mobile' },
    wallpaper_pc:    { w: 2560, h: 1440, label: 'Fond d\'écran PC' }
  },

  // Multiplicateurs de qualité d'export
  QUALITY: {
    sd:  1,
    hd:  1.5,
    '2k': 2.4,
    '4k': 3.7
  },

  TEMPLATES: [
    { id: 'profile',       name: 'Profil',          icon: '👤' },
    { id: 'profilePremium',name: 'Profil Premium',  icon: '💎' },
    { id: 'trophies',      name: 'Trophées',        icon: '🏆' },
    { id: 'ranked',        name: 'Ranked',          icon: '🎖️' },
    { id: 'brawler',       name: 'Brawler',         icon: '⭐' },
    { id: 'club',          name: 'Club',            icon: '🛡️' }
  ]
};

// URLs CDN assets (Brawlify / Brawlstats)
const ASSET = {
  brawlerIcon:  id => `https://cdn.brawlify.com/brawlers/borderless/${id}.png`,
  brawlerModel: id => `https://cdn.brawlify.com/brawlers/models/${id}.png`,
  skinModel:    id => `https://cdn.brawlify.com/skins/${id}.png`,
  gadgetIcon:   id => `https://cdn.brawlify.com/gadgets/borderless/${id}.png`,
  starPowerIcon:id => `https://cdn.brawlify.com/star-powers/borderless/${id}.png`,
  gearIcon:     id => `https://cdn.brawlify.com/gears/borderless/${id}.png`,
  hyperchargeIcon: id => `https://cdn.brawlify.com/hypercharges/borderless/${id}.png`,
  playerIcon:   id => `https://cdn.brawlstats.com/player-thumbnails/${id}.png`,
  clubIcon:     id => `https://cdn.brawlify.com/club-badges/borderless/${id}.png`
};

const RANK_FR = {
  BRONZE:'Bronze', SILVER:'Argent', GOLD:'Or', DIAMOND:'Diamant',
  MYTHIC:'Mythique', LEGENDARY:'Légendaire', MASTERS:'Maître', PRO:'Pro'
};

function translateRank(name){
  if(!name) return null;
  const parts = String(name).trim().split(' ');
  const fr = RANK_FR[parts[0].toUpperCase()];
  if(!fr) return name;
  const sub = parts.slice(1).join(' ');
  return sub ? `${fr} ${sub}` : fr;
}

function rankTierColors(name){
  const key = String(name||'').trim().split(' ')[0].toUpperCase();
  const map = {
    BRONZE:['#6b4326','#a9714a'],
    SILVER:['#6b7178','#c7ccd1'],
    GOLD:['#a8791c','#f0d878'],
    DIAMOND:['#1c7fa0','#7fe0ff'],
    MYTHIC:['#6f22a8','#d68bff'],
    LEGENDARY:['#a8291f','#ff9a3c'],
    MASTERS:['#1a1a1a','#5a5a5a'],
    PRO:['#000000','#3a3a3a']
  };
  return map[key] || ['#3a3226','#ff8c35'];
}
