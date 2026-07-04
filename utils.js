/* ============================================================
   UTILS.JS — Fonctions utilitaires réutilisables
   ============================================================ */

// Cache d'images pour éviter les rechargements répétés
const _imageCache = new Map();

function loadImage(src){
  if(!src) return Promise.resolve(null);
  if(_imageCache.has(src)) return Promise.resolve(_imageCache.get(src));
  return new Promise(resolve=>{
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = ()=>{ _imageCache.set(src,img); resolve(img); };
    img.onerror = ()=>resolve(null);
    img.src = src;
  });
}

function roundRect(ctx,x,y,w,h,r){
  if (typeof r === 'number') r = {tl:r,tr:r,br:r,bl:r};
  ctx.beginPath();
  ctx.moveTo(x+r.tl,y);
  ctx.lineTo(x+w-r.tr,y);
  ctx.arcTo(x+w,y,x+w,y+r.tr,r.tr);
  ctx.lineTo(x+w,y+h-r.br);
  ctx.arcTo(x+w,y+h,x+w-r.br,y+h,r.br);
  ctx.lineTo(x+r.bl,y+h);
  ctx.arcTo(x,y+h,x,y+h-r.bl,r.bl);
  ctx.lineTo(x,y+r.tl);
  ctx.arcTo(x,y,x+r.tl,y,r.tl);
  ctx.closePath();
}

function drawCircleImage(ctx,img,cx,cy,radius){
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx,cy,radius,0,Math.PI*2);
  ctx.closePath();
  ctx.clip();
  ctx.fillStyle='rgba(0,0,0,.25)';
  ctx.fillRect(cx-radius,cy-radius,radius*2,radius*2);
  if(img){
    ctx.drawImage(img,cx-radius,cy-radius,radius*2,radius*2);
  }
  ctx.restore();
}

function fitText(ctx,text,maxWidth,minLen=3){
  let t = text;
  while(ctx.measureText(t).width > maxWidth && t.length > minLen){
    t = t.slice(0,-1);
  }
  if(t !== text) t = t.slice(0,-1)+'…';
  return t;
}

function truncateTag(tag){
  return `#${String(tag||'').replace(/^#/,'')}`;
}

// Export d'un canvas vers PNG téléchargeable, avec option d'échelle (qualité)
function exportCanvasPNG(sourceCanvas, filename, scale=1){
  if(scale===1){
    triggerDownload(sourceCanvas.toDataURL('image/png'), filename);
    return;
  }
  const out = document.createElement('canvas');
  out.width = sourceCanvas.width*scale;
  out.height = sourceCanvas.height*scale;
  const octx = out.getContext('2d');
  octx.imageSmoothingEnabled = true;
  octx.imageSmoothingQuality = 'high';
  octx.drawImage(sourceCanvas,0,0,out.width,out.height);
  triggerDownload(out.toDataURL('image/png'), filename);
}

function triggerDownload(dataUrl, filename){
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function debounce(fn, delay=150){
  let t;
  return (...args)=>{
    clearTimeout(t);
    t = setTimeout(()=>fn(...args), delay);
  };
}
