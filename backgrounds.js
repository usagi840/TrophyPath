/* ============================================================
   BACKGROUNDS.JS — Bibliothèque de fonds pour les cartes
   Chaque fond est une fonction pure : (ctx, W, H) => void
   ============================================================ */

const BACKGROUNDS = {

  starrpark: {
    label: 'Starr Park', swatch: ['#1a2f6e','#3f7fd6'],
    draw(ctx,W,H){
      const g = ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0,'#0d1a4a'); g.addColorStop(.5,'#1e3f8f'); g.addColorStop(1,'#3f7fd6');
      ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      drawStars(ctx,W,H,70);
      drawGlowOrb(ctx,W*0.8,H*0.15,W*0.35,'rgba(255,220,120,.35)');
    }
  },

  ranked: {
    label: 'Ranked', swatch: ['#3a0a52','#a8291f'],
    draw(ctx,W,H){
      const g = ctx.createLinearGradient(0,0,W,H);
      g.addColorStop(0,'#2a0845'); g.addColorStop(.5,'#5c1650'); g.addColorStop(1,'#a8291f');
      ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      drawDiagonalStripes(ctx,W,H,'rgba(255,255,255,.035)');
      drawGlowOrb(ctx,W*0.5,H*0.05,W*0.6,'rgba(255,140,60,.25)');
    }
  },

  hypercharge: {
    label: 'Hypercharge', swatch: ['#4a00e0','#f000ff'],
    draw(ctx,W,H){
      const g = ctx.createLinearGradient(0,0,W,H);
      g.addColorStop(0,'#12002b'); g.addColorStop(.45,'#4a00e0'); g.addColorStop(1,'#f000ff');
      ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      drawEnergyLines(ctx,W,H,'rgba(255,255,255,.12)');
      drawGlowOrb(ctx,W*0.5,H*0.5,W*0.7,'rgba(240,0,255,.22)');
    }
  },

  brawlpass: {
    label: 'Brawl Pass', swatch: ['#0d0d16','#ffcf3a'],
    draw(ctx,W,H){
      const g = ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0,'#0d0d16'); g.addColorStop(1,'#221c0d');
      ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      drawStars(ctx,W,H,40,'rgba(255,207,58,.5)');
      drawGlowOrb(ctx,W*0.5,H*0.1,W*0.5,'rgba(255,207,58,.3)');
    }
  },

  crystal: {
    label: 'Crystal', swatch: ['#0a2a4a','#7fe0ff'],
    draw(ctx,W,H){
      const g = ctx.createLinearGradient(0,0,W,H);
      g.addColorStop(0,'#04101f'); g.addColorStop(.5,'#0a3a5c'); g.addColorStop(1,'#7fe0ff');
      ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      drawFacets(ctx,W,H,'rgba(255,255,255,.06)');
    }
  },

  purple: {
    label: 'Purple', swatch: ['#2a0a45','#a855f7'],
    draw(ctx,W,H){
      const g = ctx.createRadialGradient(W/2,H*0.3,0,W/2,H*0.3,W*0.9);
      g.addColorStop(0,'#a855f7'); g.addColorStop(1,'#1a0a2e');
      ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      drawStars(ctx,W,H,50);
    }
  },

  space: {
    label: 'Space', swatch: ['#000010','#3a1a6e'],
    draw(ctx,W,H){
      const g = ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0,'#000010'); g.addColorStop(.6,'#150633'); g.addColorStop(1,'#3a1a6e');
      ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      drawStars(ctx,W,H,120);
      drawGlowOrb(ctx,W*0.2,H*0.75,W*0.4,'rgba(140,80,255,.25)');
    }
  },

  fire: {
    label: 'Fire', swatch: ['#3a0a00','#ff6b1a'],
    draw(ctx,W,H){
      const g = ctx.createLinearGradient(0,H,0,0);
      g.addColorStop(0,'#3a0a00'); g.addColorStop(.5,'#a8291f'); g.addColorStop(1,'#ff6b1a');
      ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      drawEmbers(ctx,W,H);
    }
  },

  ice: {
    label: 'Ice', swatch: ['#0a2a3a','#bdf0ff'],
    draw(ctx,W,H){
      const g = ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0,'#0a2a3a'); g.addColorStop(1,'#bdf0ff');
      ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      drawFacets(ctx,W,H,'rgba(255,255,255,.15)');
    }
  },

  neon: {
    label: 'Neon', swatch: ['#0a0014','#ff2fd0'],
    draw(ctx,W,H){
      ctx.fillStyle='#0a0014'; ctx.fillRect(0,0,W,H);
      drawGlowOrb(ctx,W*0.15,H*0.2,W*0.5,'rgba(255,47,208,.35)');
      drawGlowOrb(ctx,W*0.85,H*0.8,W*0.5,'rgba(47,220,255,.3)');
      drawEnergyLines(ctx,W,H,'rgba(255,47,208,.1)');
    }
  },

  legendary: {
    label: 'Legendary', swatch: ['#3a0000','#ffb23c'],
    draw(ctx,W,H){
      const g = ctx.createRadialGradient(W/2,H*0.35,0,W/2,H*0.35,W);
      g.addColorStop(0,'#ffb23c'); g.addColorStop(.4,'#a8291f'); g.addColorStop(1,'#1a0500');
      ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      drawRays(ctx,W,H,'rgba(255,220,150,.12)');
    }
  },

  mythic: {
    label: 'Mythic', swatch: ['#2a0045','#ff5cf0'],
    draw(ctx,W,H){
      const g = ctx.createLinearGradient(0,0,W,H);
      g.addColorStop(0,'#2a0045'); g.addColorStop(.5,'#6f22a8'); g.addColorStop(1,'#ff5cf0');
      ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      drawStars(ctx,W,H,60,'rgba(255,255,255,.6)');
    }
  },

  gold: {
    label: 'Gold', swatch: ['#3a2a00','#ffe28a'],
    draw(ctx,W,H){
      const g = ctx.createLinearGradient(0,0,W,H);
      g.addColorStop(0,'#3a2a00'); g.addColorStop(.5,'#a8791c'); g.addColorStop(1,'#ffe28a');
      ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      drawRays(ctx,W,H,'rgba(255,255,255,.1)');
    }
  },

  dark: {
    label: 'Dark', swatch: ['#000000','#2a2a2a'],
    draw(ctx,W,H){
      const g = ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0,'#0a0a0a'); g.addColorStop(1,'#2a2a2a');
      ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      drawStars(ctx,W,H,30,'rgba(255,255,255,.3)');
    }
  },

  blue: {
    label: 'Blue', swatch: ['#001a3a','#3fa8ff'],
    draw(ctx,W,H){
      const g = ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0,'#001a3a'); g.addColorStop(1,'#3fa8ff');
      ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      drawGlowOrb(ctx,W*0.5,H*0.05,W*0.6,'rgba(160,220,255,.3)');
    }
  },

  green: {
    label: 'Green', swatch: ['#012a0f','#2cb67d'],
    draw(ctx,W,H){
      const g = ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0,'#012a0f'); g.addColorStop(1,'#2cb67d');
      ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      drawGlowOrb(ctx,W*0.5,H*0.1,W*0.6,'rgba(140,255,200,.25)');
    }
  },

  red: {
    label: 'Red', swatch: ['#2a0000','#ff3c3c'],
    draw(ctx,W,H){
      const g = ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0,'#2a0000'); g.addColorStop(1,'#ff3c3c');
      ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      drawDiagonalStripes(ctx,W,H,'rgba(255,255,255,.04)');
    }
  },

  abstract: {
    label: 'Abstract', swatch: ['#ff5c35','#3fa8ff'],
    draw(ctx,W,H){
      const g = ctx.createLinearGradient(0,0,W,H);
      g.addColorStop(0,'#ff5c35'); g.addColorStop(.5,'#a855f7'); g.addColorStop(1,'#3fa8ff');
      ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      drawFacets(ctx,W,H,'rgba(255,255,255,.08)');
    }
  }
};

/* ---------- Générateurs procéduraux réutilisables ---------- */

function seededRandom(seed){
  let s = seed;
  return function(){ s = (s*9301+49297)%233280; return s/233280; };
}

function drawStars(ctx,W,H,count,color='rgba(255,255,255,.8)'){
  const rnd = seededRandom(42);
  ctx.save();
  for(let i=0;i<count;i++){
    const x = rnd()*W, y = rnd()*H, r = rnd()*1.8+.4;
    ctx.globalAlpha = rnd()*.6+.3;
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
  }
  ctx.restore();
}

function drawGlowOrb(ctx,x,y,radius,color){
  const g = ctx.createRadialGradient(x,y,0,x,y,radius);
  g.addColorStop(0,color); g.addColorStop(1,'rgba(0,0,0,0)');
  ctx.save(); ctx.fillStyle=g;
  ctx.fillRect(x-radius,y-radius,radius*2,radius*2);
  ctx.restore();
}

function drawDiagonalStripes(ctx,W,H,color){
  ctx.save();
  ctx.strokeStyle=color; ctx.lineWidth=W*0.03;
  for(let x=-H;x<W+H;x+=W*0.09){
    ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x+H,H); ctx.stroke();
  }
  ctx.restore();
}

function drawEnergyLines(ctx,W,H,color){
  const rnd = seededRandom(7);
  ctx.save();
  ctx.strokeStyle=color; ctx.lineWidth=2;
  for(let i=0;i<14;i++){
    const y = rnd()*H;
    ctx.globalAlpha = rnd()*.7+.2;
    ctx.beginPath();
    ctx.moveTo(0,y);
    ctx.bezierCurveTo(W*.3,y+(rnd()-.5)*120,W*.7,y+(rnd()-.5)*120,W,y);
    ctx.stroke();
  }
  ctx.restore();
}

function drawFacets(ctx,W,H,color){
  const rnd = seededRandom(21);
  ctx.save();
  ctx.strokeStyle=color; ctx.lineWidth=1.5;
  for(let i=0;i<22;i++){
    const x1=rnd()*W,y1=rnd()*H,x2=x1+(rnd()-.5)*300,y2=y1+(rnd()-.5)*300;
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
  }
  ctx.restore();
}

function drawEmbers(ctx,W,H){
  const rnd = seededRandom(13);
  ctx.save();
  for(let i=0;i<60;i++){
    const x = rnd()*W, y = H - rnd()*rnd()*H, r = rnd()*3+1;
    ctx.globalAlpha = rnd()*.6+.2;
    ctx.fillStyle = rnd()>.5 ? '#ffb23c' : '#ff6b1a';
    ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
  }
  ctx.restore();
}

function drawRays(ctx,W,H,color){
  ctx.save();
  ctx.translate(W/2,H*0.35);
  ctx.strokeStyle=color; ctx.lineWidth=W*0.02;
  const n=16;
  for(let i=0;i<n;i++){
    const a = (i/n)*Math.PI*2;
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(Math.cos(a)*W*1.2, Math.sin(a)*W*1.2);
    ctx.stroke();
  }
  ctx.restore();
}

function drawBackground(ctx,W,H,key){
  const bg = BACKGROUNDS[key] || BACKGROUNDS.starrpark;
  bg.draw(ctx,W,H);
}
