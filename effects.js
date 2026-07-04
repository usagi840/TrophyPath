/* ============================================================
   EFFECTS.JS — Effets visuels appliqués aux cartes (post-process)
   Chaque effet reçoit (ctx, W, H, opts) et dessine directement.
   ============================================================ */

const EFFECTS = {

  glow(ctx,W,H,opts={}){
    const color = opts.color || 'rgba(255,255,255,.18)';
    const g = ctx.createRadialGradient(W/2,H*0.35,0,W/2,H*0.35,W*0.9);
    g.addColorStop(0,color); g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.save(); ctx.globalCompositeOperation='screen';
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    ctx.restore();
  },

  shine(ctx,W,H){
    ctx.save();
    ctx.globalCompositeOperation='screen';
    const g = ctx.createLinearGradient(0,0,W,H*0.6);
    g.addColorStop(0,'rgba(255,255,255,0)');
    g.addColorStop(.45,'rgba(255,255,255,.10)');
    g.addColorStop(.5,'rgba(255,255,255,.22)');
    g.addColorStop(.55,'rgba(255,255,255,.10)');
    g.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=g;
    ctx.fillRect(0,0,W,H);
    ctx.restore();
  },

  noise(ctx,W,H,opts={}){
    const intensity = opts.intensity ?? 14;
    const imgData = ctx.getImageData(0,0,W,H);
    const d = imgData.data;
    for(let i=0;i<d.length;i+=4){
      const n = (Math.random()-0.5)*intensity;
      d[i]+=n; d[i+1]+=n; d[i+2]+=n;
    }
    ctx.putImageData(imgData,0,0);
  },

  particles(ctx,W,H,opts={}){
    const count = opts.count || 40;
    const rnd = seededRandom(opts.seed || 99);
    ctx.save();
    for(let i=0;i<count;i++){
      const x=rnd()*W, y=rnd()*H, r=rnd()*2.5+.6;
      ctx.globalAlpha = rnd()*.5+.15;
      ctx.fillStyle='#ffffff';
      ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
    }
    ctx.restore();
  },

  vignette(ctx,W,H,opts={}){
    const strength = opts.strength ?? .55;
    const g = ctx.createRadialGradient(W/2,H/2,H*0.35,W/2,H/2,H*0.75);
    g.addColorStop(0,'rgba(0,0,0,0)');
    g.addColorStop(1,`rgba(0,0,0,${strength})`);
    ctx.save(); ctx.fillStyle=g; ctx.fillRect(0,0,W,H); ctx.restore();
  },

  border(ctx,W,H,opts={}){
    const width = opts.width || 10;
    const color1 = opts.color1 || '#ffcf3a';
    const color2 = opts.color2 || '#ff5c35';
    const radius = opts.radius ?? 28;
    const g = ctx.createLinearGradient(0,0,W,H);
    g.addColorStop(0,color1); g.addColorStop(1,color2);
    ctx.save();
    ctx.strokeStyle=g;
    ctx.lineWidth=width;
    roundRect(ctx, width/2, width/2, W-width, H-width, radius);
    ctx.stroke();
    ctx.restore();
  },

  reflection(ctx,W,H,opts={}){
    // Léger reflet en bas de carte
    const h = opts.height || H*0.12;
    const g = ctx.createLinearGradient(0,H-h,0,H);
    g.addColorStop(0,'rgba(255,255,255,0)');
    g.addColorStop(1,'rgba(255,255,255,.06)');
    ctx.save(); ctx.fillStyle=g; ctx.fillRect(0,H-h,W,h); ctx.restore();
  }
};

// Applique une liste d'effets activés, dans un ordre cohérent
function applyEffects(ctx,W,H,activeEffects=[], settings={}){
  const order = ['glow','shine','particles','noise','vignette','reflection','border'];
  order.forEach(name=>{
    if(activeEffects.includes(name)){
      EFFECTS[name](ctx,W,H, settings[name]||{});
    }
  });
}
