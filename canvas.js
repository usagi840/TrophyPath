/* ============================================================
   CANVAS.JS — Orchestration du rendu (fond + template + effets)
   ============================================================ */

const CardState = {
  player: null,
  templateId: 'profile',
  selectedBrawler: null,
  background: 'starrpark',
  format: 'card',
  effects: ['glow','shine','vignette'],
  border: true,
  cornerRadius: 28,
  quality: 'hd'
};

async function renderCard(canvas){
  const fmt = CONFIG.FORMATS[CardState.format] || CONFIG.FORMATS.card;
  canvas.width = fmt.w;
  canvas.height = fmt.h;
  const ctx = canvas.getContext('2d');
  const W = fmt.w, H = fmt.h;

  await ensureFonts();
  ctx.clearRect(0,0,W,H);

  // Zone de dessin arrondie (clip global)
  ctx.save();
  roundRect(ctx,0,0,W,H,CardState.cornerRadius);
  ctx.clip();

  drawBackground(ctx,W,H,CardState.background);

  if(CardState.player){
    try{
      await drawCardTemplate(ctx, W, H, CardState.templateId, CardState.player, CardState.selectedBrawler);
    }catch(e){
      console.error(e);
    }
    drawFooter(ctx,W,H, CardState.player.tag ? CardState.player.tag.replace(/^#/,'') : '');
  }

  // Effets (dans le clip, avant la bordure)
  const nonBorderEffects = CardState.effects.filter(e=>e!=='border');
  applyEffects(ctx,W,H, nonBorderEffects);

  ctx.restore();

  // Bordure (dessinée après restore pour qu'elle englobe le cadre)
  if(CardState.border){
    EFFECTS.border(ctx,W,H,{radius: CardState.cornerRadius});
  }
}

function exportCard(canvas){
  const scale = CONFIG.QUALITY[CardState.quality] || 1;
  const safeName = (CardState.player?.name||'brawlcard').replace(/[^a-z0-9]/gi,'_');
  exportCanvasPNG(canvas, `brawlcard_${safeName}_${CardState.templateId}.png`, scale);
}
