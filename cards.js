/* ============================================================
   CARDS.JS — Dessin des différents templates de cartes
   Chaque fonction : (ctx, W, H, player, opts) => Promise<void>
   ============================================================ */

async function ensureFonts(){
  try{
    await Promise.all([
      document.fonts.load('700 40px "Fraunces"'),
      document.fonts.load('600 1em "Fraunces"'),
      document.fonts.load('900 1em "Lilita One"'),
      document.fonts.load('400 1em "Outfit"'),
      document.fonts.load('600 1em "Outfit"'),
      document.fonts.load('700 1em "Outfit"'),
    ]);
  }catch(e){}
}

function chipBadge(ctx,x,y,w,h,label,value,accent='rgba(255,255,255,.10)'){
  roundRect(ctx,x,y,w,h,16);
  ctx.fillStyle = 'rgba(255,255,255,.07)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,.14)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,.55)';
  ctx.font = '600 17px Outfit';
  ctx.textAlign = 'center';
  ctx.fillText(label.toUpperCase(), x+w/2, y+32);
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 38px Fraunces';
  ctx.fillText(String(value), x+w/2, y+h-22);
}

function drawFooter(ctx,W,H,tag){
  ctx.save();
  ctx.font = '600 22px Outfit';
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(255,255,255,.5)';
  ctx.fillText('Brawl', 44, H-38);
  const w1 = ctx.measureText('Brawl').width;
  ctx.fillStyle = 'rgba(255,140,60,.95)';
  ctx.fillText('Card', 44+w1, H-38);
  ctx.fillStyle = 'rgba(255,255,255,.4)';
  ctx.font = '500 20px Outfit';
  ctx.textAlign = 'right';
  ctx.fillText(`#${tag}`, W-44, H-38);
  ctx.restore();
}

function drawSectionLabel(ctx,x,y,text){
  ctx.save();
  ctx.textAlign='left';
  ctx.fillStyle='rgba(255,255,255,.45)';
  ctx.font='700 18px Outfit';
  ctx.fillText(text.toUpperCase(),x,y);
  ctx.restore();
}

function drawProgressBar(ctx,x,y,w,h,pct,color1,color2){
  roundRect(ctx,x,y,w,h,h/2);
  ctx.fillStyle='rgba(255,255,255,.10)'; ctx.fill();
  const p = Math.max(0,Math.min(1,pct));
  if(p>0){
    const g = ctx.createLinearGradient(x,0,x+w,0);
    g.addColorStop(0,color1); g.addColorStop(1,color2);
    roundRect(ctx,x,y,w*p,h,h/2);
    ctx.fillStyle=g; ctx.fill();
  }
}

/* ══════════════ CARTE PROFIL ══════════════ */
async function drawProfileCard(ctx,W,H,player){
  const icon = await loadImage(player.icon?.id ? ASSET.playerIcon(player.icon.id) : null);
  drawCircleImage(ctx, icon, W/2, H*0.185, W*0.135);
  ctx.strokeStyle = 'rgba(255,140,60,.9)';
  ctx.lineWidth = 6;
  ctx.beginPath(); ctx.arc(W/2,H*0.185,W*0.135+4,0,Math.PI*2); ctx.stroke();

  ctx.textAlign='center';
  ctx.fillStyle='#fff';
  ctx.font = `700 ${W*0.068}px Fraunces`;
  ctx.fillText(fitText(ctx,player.name||'—',W*0.85), W/2, H*0.34);
  ctx.fillStyle='rgba(255,255,255,.55)';
  ctx.font = `500 ${W*0.034}px Outfit`;
  ctx.fillText(truncateTag(player.tag), W/2, H*0.365);

  ctx.fillStyle='#ffcf6b';
  ctx.font=`700 ${W*0.13}px Fraunces`;
  ctx.fillText(`🏆 ${player.trophies ?? '—'}`, W/2, H*0.475);
  ctx.fillStyle='rgba(255,255,255,.5)';
  ctx.font=`500 ${W*0.034}px Outfit`;
  ctx.fillText(`Meilleur score : ${player.highestTrophies ?? '—'}`, W/2, H*0.505);

  const chips = [
    ['Niveau', player.expLevel ?? '—'],
    ['Victoires 3c3', player['3vs3Victories'] ?? '—'],
    ['Victoires Solo', player.soloVictories ?? '—'],
    ['Victoires Duo', player.duoVictories ?? '—'],
  ];
  const gap=W*0.03, cw=(W-W*0.12-gap)/2, ch=H*0.09, startY=H*0.565;
  chips.forEach((c,i)=>{
    const col=i%2, row=Math.floor(i/2);
    chipBadge(ctx, W*0.06+col*(cw+gap), startY+row*(ch+gap), cw, ch, c[0], c[1]);
  });

  if(player.club?.name){
    const y = startY+2*(ch+gap)+H*0.01;
    roundRect(ctx,W*0.06,y,W*0.88,H*0.075,16);
    ctx.fillStyle='rgba(255,255,255,.07)'; ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,.12)'; ctx.lineWidth=2; ctx.stroke();
    ctx.textAlign='left';
    ctx.fillStyle='rgba(255,255,255,.5)';
    ctx.font=`600 ${W*0.026}px Outfit`;
    ctx.fillText('CLUB', W*0.09, y+H*0.03);
    ctx.fillStyle='#fff';
    ctx.font=`700 ${W*0.042}px Fraunces`;
    ctx.fillText(fitText(ctx,player.club.name,W*0.7), W*0.09, y+H*0.06);
    ctx.textAlign='center';
  }
}

/* ══════════════ CARTE PROFIL PREMIUM ══════════════ */
async function drawProfilePremiumCard(ctx,W,H,player){
  const icon = await loadImage(player.icon?.id ? ASSET.playerIcon(player.icon.id) : null);

  // Bandeau doré derrière l'avatar
  const bandH = H*0.05;
  const bg = ctx.createLinearGradient(0,0,W,0);
  bg.addColorStop(0,'rgba(255,207,58,0)');
  bg.addColorStop(.5,'rgba(255,207,58,.35)');
  bg.addColorStop(1,'rgba(255,207,58,0)');
  ctx.fillStyle=bg; ctx.fillRect(0,H*0.09,W,bandH);

  drawCircleImage(ctx, icon, W/2, H*0.19, W*0.145);
  const ringGrad = ctx.createLinearGradient(W/2-W*0.15,0,W/2+W*0.15,0);
  ringGrad.addColorStop(0,'#ffcf3a'); ringGrad.addColorStop(1,'#ff5c35');
  ctx.strokeStyle = ringGrad;
  ctx.lineWidth = 8;
  ctx.beginPath(); ctx.arc(W/2,H*0.19,W*0.145+5,0,Math.PI*2); ctx.stroke();

  // Badge "PREMIUM"
  ctx.save();
  const pbW=W*0.28, pbH=H*0.032;
  roundRect(ctx, W/2-pbW/2, H*0.255, pbW, pbH, pbH/2);
  ctx.fillStyle='#ffcf3a'; ctx.fill();
  ctx.fillStyle='#1a1400';
  ctx.font=`800 ${W*0.024}px Outfit`;
  ctx.textAlign='center';
  ctx.fillText('★ PREMIUM ★', W/2, H*0.255+pbH*0.72);
  ctx.restore();

  ctx.textAlign='center';
  ctx.fillStyle='#fff';
  ctx.font = `700 ${W*0.07}px Fraunces`;
  ctx.fillText(fitText(ctx,player.name||'—',W*0.85), W/2, H*0.335);
  ctx.fillStyle='rgba(255,255,255,.55)';
  ctx.font = `500 ${W*0.032}px Outfit`;
  ctx.fillText(truncateTag(player.tag), W/2, H*0.36);

  // Trophées + meilleur score côte à côte
  const gap=W*0.03, cw=(W-W*0.12-gap)/2, ch=H*0.14, startY=H*0.4;
  chipBadge(ctx, W*0.06, startY, cw, ch, 'Trophées 🏆', player.trophies ?? '—');
  chipBadge(ctx, W*0.06+cw+gap, startY, cw, ch, 'Record', player.highestTrophies ?? '—');

  // Rang classé
  const rankRaw = player.rankedRankName || player.highestAllTimeRankedRankName || null;
  const rankFr = translateRank(rankRaw) || 'Non classé';
  const y2 = startY+ch+gap;
  roundRect(ctx,W*0.06,y2,W*0.88,H*0.075,16);
  const [rc1,rc2] = rankTierColors(rankRaw);
  const rg = ctx.createLinearGradient(W*0.06,0,W*0.94,0);
  rg.addColorStop(0,rc1); rg.addColorStop(1,rc2);
  ctx.fillStyle=rg; ctx.globalAlpha=.35; ctx.fill(); ctx.globalAlpha=1;
  ctx.strokeStyle='rgba(255,255,255,.18)'; ctx.lineWidth=2; ctx.stroke();
  ctx.fillStyle='#fff';
  ctx.font=`700 ${W*0.036}px Fraunces`;
  ctx.fillText(`🎖️ ${rankFr}`, W/2, y2+H*0.048);

  // Stats détaillées
  const chips = [
    ['Niveau', player.expLevel ?? '—'],
    ['Victoires 3c3', player['3vs3Victories'] ?? '—'],
    ['Victoires Solo', player.soloVictories ?? '—'],
    ['Victoires Duo', player.duoVictories ?? '—'],
  ];
  const startY3 = y2+H*0.075+H*0.02;
  chips.forEach((c,i)=>{
    const col=i%2, row=Math.floor(i/2);
    chipBadge(ctx, W*0.06+col*(cw+gap), startY3+row*(ch*0.65+gap), cw, ch*0.65, c[0], c[1]);
  });

  // Progression niveau (barre stylée)
  const barY = startY3+2*(ch*0.65+gap)+H*0.015;
  drawSectionLabel(ctx, W*0.06, barY, 'Progression du niveau');
  const pct = ((player.expPoints||0) % 1000)/1000;
  drawProgressBar(ctx, W*0.06, barY+H*0.012, W*0.88, H*0.022, pct || 0.35, '#ffcf3a','#ff5c35');

  if(player.club?.name){
    const y3 = barY+H*0.06;
    roundRect(ctx,W*0.06,y3,W*0.88,H*0.075,16);
    ctx.fillStyle='rgba(255,255,255,.07)'; ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,.12)'; ctx.lineWidth=2; ctx.stroke();
    ctx.textAlign='left';
    ctx.fillStyle='rgba(255,255,255,.5)';
    ctx.font=`600 ${W*0.024}px Outfit`;
    ctx.fillText('CLUB', W*0.09, y3+H*0.028);
    ctx.fillStyle='#fff';
    ctx.font=`700 ${W*0.04}px Fraunces`;
    ctx.fillText(fitText(ctx,player.club.name,W*0.7), W*0.09, y3+H*0.058);
    ctx.textAlign='center';
  }
}

/* ══════════════ CARTE TROPHÉES ══════════════ */
async function drawTrophiesCard(ctx,W,H,player){
  const icon = await loadImage(player.icon?.id ? ASSET.playerIcon(player.icon.id) : null);
  drawCircleImage(ctx, icon, W/2, H*0.204, W*0.125);
  ctx.strokeStyle = 'rgba(255,207,107,.9)';
  ctx.lineWidth = 6;
  ctx.beginPath(); ctx.arc(W/2,H*0.204,W*0.125+4,0,Math.PI*2); ctx.stroke();

  ctx.textAlign='center';
  ctx.fillStyle='#fff';
  ctx.font=`700 ${W*0.058}px Fraunces`;
  ctx.fillText(fitText(ctx,player.name||'—',W*0.85), W/2, H*0.338);
  ctx.fillStyle='rgba(255,255,255,.5)';
  ctx.font=`500 ${W*0.032}px Outfit`;
  ctx.fillText(truncateTag(player.tag), W/2, H*0.368);

  ctx.font=`700 ${W*0.09}px Outfit`;
  ctx.fillStyle='rgba(255,255,255,.65)';
  ctx.fillText('🏆', W/2, H*0.518);
  ctx.font=`700 ${W*0.22}px Fraunces`;
  ctx.fillStyle='#ffcf6b';
  ctx.fillText(String(player.trophies ?? '—'), W/2, H*0.685);
  ctx.font=`600 ${W*0.04}px Outfit`;
  ctx.fillStyle='rgba(255,255,255,.55)';
  ctx.fillText('TROPHÉES ACTUELS', W/2, H*0.727);

  roundRect(ctx, W/2-W*0.29, H*0.796, W*0.58, H*0.102, 18);
  ctx.fillStyle='rgba(255,255,255,.06)'; ctx.fill();
  ctx.strokeStyle='rgba(255,255,255,.12)'; ctx.lineWidth=2; ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,.5)';
  ctx.font=`600 ${W*0.026}px Outfit`;
  ctx.fillText('MEILLEUR SCORE', W/2, H*0.838);
  ctx.fillStyle='#fff';
  ctx.font=`700 ${W*0.06}px Fraunces`;
  ctx.fillText(String(player.highestTrophies ?? '—'), W/2, H*0.88);
}

/* ══════════════ CARTE RANKED ══════════════ */
async function drawRankedCard(ctx,W,H,player){
  const rankRaw = player.rankedRankName || player.highestAllTimeRankedRankName || null;
  const rankFr = translateRank(rankRaw) || 'Non classé';
  const [c1,c2] = rankTierColors(rankRaw);

  const R = W*0.21;
  const grad = ctx.createLinearGradient(W/2-R,0,W/2+R,0);
  grad.addColorStop(0,c1); grad.addColorStop(1,c2);
  ctx.save();
  ctx.beginPath(); ctx.arc(W/2,H*0.24,R,0,Math.PI*2); ctx.closePath();
  ctx.fillStyle = grad; ctx.fill();
  ctx.restore();
  ctx.beginPath(); ctx.arc(W/2,H*0.24,R,0,Math.PI*2);
  ctx.strokeStyle='rgba(255,255,255,.5)'; ctx.lineWidth=6; ctx.stroke();
  ctx.fillStyle='#fff';
  ctx.font=`700 ${W*0.085}px Outfit`;
  ctx.textAlign='center';
  ctx.fillText('🎖️', W/2, H*0.264);

  ctx.fillStyle='#fff';
  ctx.font=`700 ${W*0.074}px Fraunces`;
  ctx.fillText(rankFr, W/2, H*0.463);

  ctx.fillStyle='rgba(255,255,255,.55)';
  ctx.font=`500 ${W*0.034}px Outfit`;
  ctx.fillText(player.name||'—', W/2, H*0.505);
  ctx.font=`500 ${W*0.029}px Outfit`;
  ctx.fillText(truncateTag(player.tag), W/2, H*0.535);

  if(player.highestAllTimeRankedRankName && rankRaw!==player.highestAllTimeRankedRankName){
    roundRect(ctx, W/2-W*0.34, H*0.602, W*0.68, H*0.102, 18);
    ctx.fillStyle='rgba(255,255,255,.06)'; ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,.12)'; ctx.lineWidth=2; ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,.5)';
    ctx.font=`600 ${W*0.026}px Outfit`;
    ctx.fillText('MEILLEUR RANG ATTEINT', W/2, H*0.643);
    ctx.fillStyle='#fff';
    ctx.font=`700 ${W*0.05}px Fraunces`;
    ctx.fillText(translateRank(player.highestAllTimeRankedRankName), W/2, H*0.683);
  }

  ctx.fillStyle='rgba(255,255,255,.65)';
  ctx.font=`500 ${W*0.032}px Outfit`;
  ctx.fillText(`${player.trophies ?? '—'} 🏆 au total`, W/2, H*0.787);
}

/* ══════════════ CARTE CLUB ══════════════ */
async function drawClubCard(ctx,W,H,player){
  const club = player.club;
  ctx.textAlign='center';

  // Écusson générique (pas d'ID de badge disponible via l'API joueur)
  const shieldR = W*0.16;
  ctx.save();
  const sg = ctx.createLinearGradient(W/2-shieldR,0,W/2+shieldR,0);
  sg.addColorStop(0,'#ffcf3a'); sg.addColorStop(1,'#ff5c35');
  ctx.beginPath();
  ctx.moveTo(W/2, H*0.09);
  ctx.quadraticCurveTo(W/2+shieldR, H*0.11, W/2+shieldR, H*0.22);
  ctx.quadraticCurveTo(W/2+shieldR, H*0.32, W/2, H*0.38);
  ctx.quadraticCurveTo(W/2-shieldR, H*0.32, W/2-shieldR, H*0.22);
  ctx.quadraticCurveTo(W/2-shieldR, H*0.11, W/2, H*0.09);
  ctx.closePath();
  ctx.fillStyle=sg; ctx.fill();
  ctx.strokeStyle='rgba(255,255,255,.5)'; ctx.lineWidth=5; ctx.stroke();
  ctx.fillStyle='rgba(0,0,0,.4)';
  ctx.font=`700 ${W*0.11}px Outfit`;
  ctx.fillText('🛡️', W/2, H*0.26);
  ctx.restore();

  ctx.fillStyle='#fff';
  ctx.font=`700 ${W*0.066}px Fraunces`;
  ctx.fillText(fitText(ctx,club?.name||'Sans club',W*0.85), W/2, H*0.47);

  if(club?.tag){
    ctx.fillStyle='rgba(255,255,255,.5)';
    ctx.font=`500 ${W*0.03}px Outfit`;
    ctx.fillText(truncateTag(club.tag), W/2, H*0.5);
  }

  if(club?.role){
    const roleFr = {member:'Membre',senior:'Senior',vicePresident:'Vice-président',president:'Président'}[club.role] || club.role;
    const y = H*0.56;
    roundRect(ctx,W/2-W*0.24,y,W*0.48,H*0.06,14);
    ctx.fillStyle='rgba(255,255,255,.08)'; ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,.15)'; ctx.lineWidth=2; ctx.stroke();
    ctx.fillStyle='#ffcf6b';
    ctx.font=`700 ${W*0.03}px Outfit`;
    ctx.fillText(roleFr.toUpperCase(), W/2, y+H*0.039);
  }

  const gap=W*0.03, cw=(W-W*0.12-gap)/2, ch=H*0.09, startY=H*0.66;
  chipBadge(ctx, W*0.06, startY, cw, ch, 'Membre', player.name||'—');
  chipBadge(ctx, W*0.06+cw+gap, startY, cw, ch, 'Trophées', player.trophies ?? '—');
}

/* ══════════════ CARTE BRAWLER ══════════════ */
async function drawSideChip(ctx,x,y,w,h,item,iconFn,W){
  roundRect(ctx,x,y,w,h,20);
  ctx.fillStyle = item ? 'rgba(255,255,255,.08)' : 'rgba(255,255,255,.03)';
  ctx.fill();
  ctx.strokeStyle = item ? 'rgba(255,255,255,.2)' : 'rgba(255,255,255,.08)';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.textAlign='center';
  if(item){
    const img = await loadImage(iconFn(item.id));
    const iconSize=w*0.42;
    if(img) ctx.drawImage(img, x + (w - iconSize)/2, y + h*0.13, iconSize, iconSize);
    ctx.fillStyle='#fff';
    ctx.font=`600 ${w*0.09}px Outfit`;
    ctx.fillText(fitText(ctx,item.name||'',w-18), x+w/2, y+h-24);
  } else {
    ctx.fillStyle='rgba(255,255,255,.32)';
    ctx.font=`500 ${w*0.095}px Outfit`;
    ctx.fillText('Non', x+w/2, y+h/2-6);
    ctx.fillText('débloqué', x+w/2, y+h/2+20);
  }
}

async function drawBrawlerCard(ctx,W,H,player,selectedBrawler){
  const b = selectedBrawler;
  ctx.textAlign='center';

  const trophyText = String(b.trophies ?? '—');
  ctx.font = `700 ${W*0.184}px Fraunces`;
  ctx.lineJoin = 'round';
  ctx.lineWidth = W*0.021;
  ctx.strokeStyle = 'rgba(0,0,0,.35)';
  ctx.strokeText(trophyText, W/2, H*0.162);
  ctx.fillStyle = '#ffffff';
  ctx.fillText(trophyText, W/2, H*0.162);

  ctx.font = `600 ${W*0.035}px Outfit`;
  ctx.fillStyle = 'rgba(255,255,255,.6)';
  ctx.fillText(`${b.name}${b.power?' • Puissance '+b.power:''}`, W/2, H*0.202);

  const gadgets = b.gadgets || [];
  const stars = b.starPowers || [];
  const boxW=W*0.263, boxH=H*0.176, gapY=H*0.019;
  const leftX=W*0.047, rightX=W-W*0.047-boxW;
  const topY=H*0.315;
  await drawSideChip(ctx, leftX, topY, boxW, boxH, gadgets[0]||null, ASSET.gadgetIcon, W);
  await drawSideChip(ctx, leftX, topY+boxH+gapY, boxW, boxH, gadgets[1]||null, ASSET.gadgetIcon, W);
  await drawSideChip(ctx, rightX, topY, boxW, boxH, stars[0]||null, ASSET.starPowerIcon, W);
  await drawSideChip(ctx, rightX, topY+boxH+gapY, boxW, boxH, stars[1]||null, ASSET.starPowerIcon, W);

  let brawlerModel = null;
  if (b.skin && b.skin.id && b.skin.name !== b.name) {
    brawlerModel = await loadImage(ASSET.skinModel(b.skin.id));
  }
  if (!brawlerModel) {
    brawlerModel = await loadImage(ASSET.brawlerModel(b.id));
  }

  const charW=W*0.684, charH=charW;
  const cx=W/2-charW/2, cy=topY-H*0.028;
  ctx.save();
  ctx.shadowColor='rgba(0,0,0,.55)';
  ctx.shadowBlur=W*0.06;
  ctx.shadowOffsetY=H*0.018;
  if(brawlerModel) ctx.drawImage(brawlerModel, cx, cy, charW, charH);
  ctx.restore();

  const hasHypercharge = (b.hyperCharges && b.hyperCharges.length > 0) || b.hyperchargeLevel > 0;
  const hcY = topY+2*boxH+gapY+H*0.051;

  roundRect(ctx, W*0.047, hcY, W-W*0.094, H*0.102, 20);
  if(hasHypercharge){
    const hcGrad = ctx.createLinearGradient(W*0.047, 0, W-W*0.047, 0);
    hcGrad.addColorStop(0, '#4a00e0');
    hcGrad.addColorStop(0.5, '#8e2de2');
    hcGrad.addColorStop(1, '#f000ff');
    ctx.fillStyle = hcGrad; ctx.fill();
    ctx.strokeStyle = '#ff00ff'; ctx.lineWidth = 4; ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.font = `700 ${W*0.033}px Outfit`;
    ctx.shadowColor = 'rgba(240, 0, 255, 1)';
    ctx.shadowBlur = 12;
    ctx.fillText('⚡ Hypercharge Active ⚡', W/2, hcY+H*0.06);
    ctx.shadowBlur = 0;
  } else {
    ctx.fillStyle = 'rgba(255,255,255,.04)'; ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.1)'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.25)';
    ctx.font = `600 ${W*0.03}px Outfit`;
    ctx.fillText('⚡ Hypercharge indisponible', W/2, hcY+H*0.06);
  }

  // Gears + maîtrise (nouvelle rangée)
  const gears = b.gears || [];
  if(gears.length){
    const gy = hcY+H*0.102+H*0.02;
    drawSectionLabel(ctx, W*0.047, gy, 'Gears équipés');
    let gx = W*0.047;
    const gsize = W*0.11;
    for(const g of gears.slice(0,4)){
      roundRect(ctx,gx,gy+H*0.012,gsize,gsize,12);
      ctx.fillStyle='rgba(255,255,255,.08)'; ctx.fill();
      ctx.strokeStyle='rgba(255,255,255,.15)'; ctx.lineWidth=2; ctx.stroke();
      const img = await loadImage(ASSET.gearIcon(g.id));
      if(img) ctx.drawImage(img, gx+gsize*0.1, gy+H*0.012+gsize*0.1, gsize*0.8, gsize*0.8);
      gx += gsize+W*0.02;
    }
  }
}

/* ══════════════ ROUTAGE DES TEMPLATES ══════════════ */
async function drawCardTemplate(ctx, W, H, templateId, player, selectedBrawler){
  switch(templateId){
    case 'profile': return drawProfileCard(ctx,W,H,player);
    case 'profilePremium': return drawProfilePremiumCard(ctx,W,H,player);
    case 'trophies': return drawTrophiesCard(ctx,W,H,player);
    case 'ranked': return drawRankedCard(ctx,W,H,player);
    case 'club': return drawClubCard(ctx,W,H,player);
    case 'brawler': return drawBrawlerCard(ctx,W,H,player,selectedBrawler);
    default: return drawProfileCard(ctx,W,H,player);
  }
}
