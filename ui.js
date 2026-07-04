/* ============================================================
   UI.JS — Écrans et interactions (navigation, personnalisation)
   ============================================================ */

function toast(msg,type=''){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show'+(type?' '+type:'');
  clearTimeout(toast._tm);
  toast._tm = setTimeout(()=>t.classList.remove('show'), 2600);
}

/* ══════════════ ÉCRAN 1 : accueil / chargement du joueur ══════════════ */
function renderStart(){
  const main = document.getElementById('main');
  main.innerHTML = `
    <div class="hero">
      <div class="hero-title">Crée ta carte<br/>Brawl Stars</div>
      <div class="hero-sub">Profil, trophées, rang classé ou brawler — en quelques secondes.</div>
    </div>
    <div class="card-box">
      <div class="step-title">Charge ton profil</div>
      <div class="field">
        <label>Tag Brawl Stars</label>
        <input id="tag-inp" class="inp" placeholder="#1234ABCD"
          style="text-transform:uppercase;text-align:center;font-weight:700;letter-spacing:1px"/>
      </div>
      <div class="err-box" id="load-err"></div>
      <button class="btn-main" id="btn-load">Charger →</button>
    </div>`;

  const inp = document.getElementById('tag-inp');
  const btn = document.getElementById('btn-load');
  const err = document.getElementById('load-err');

  const doLoad = async ()=>{
    const tag = (inp.value||'').trim().toUpperCase().replace(/^#*/,'');
    err.textContent='';
    if(!tag || tag.length<3){ err.textContent='Identifiant invalide'; return; }
    btn.disabled = true; btn.innerHTML = `<span class="loader"></span>Recherche…`;
    try{
      CardState.player = await fetchBsPlayer(tag);
      CardState.selectedBrawler = null;
      renderTemplatePicker();
    }catch(e){
      err.textContent = 'Joueur introuvable. Vérifie ton identifiant';
    }finally{
      btn.disabled = false; btn.textContent = 'Charger →';
    }
  };
  btn.addEventListener('click', doLoad);
  inp.addEventListener('keydown', e=>{ if(e.key==='Enter') doLoad(); });
  inp.focus();
}

/* ══════════════ ÉCRAN 2 : choix du template ══════════════ */
function renderTemplatePicker(){
  const player = CardState.player;
  const main = document.getElementById('main');
  main.innerHTML = `
    <div class="card-box">
      <div class="player-chip">
        <img src="${player.icon?.id ? ASSET.playerIcon(player.icon.id) : ''}" onerror="this.style.display='none'"/>
        <div>
          <div class="pname">${escapeHtml(player.name)}</div>
          <div class="ptro">${player.trophies} 🏆 au total</div>
        </div>
        <span class="pchange" id="btn-change-tag">changer</span>
      </div>
      <div class="step-title">Quel type de carte ?</div>
      <div class="tpl-grid">
        ${CONFIG.TEMPLATES.map(t=>`
          <div class="tpl-btn" data-tpl="${t.id}">
            <div class="tico">${t.icon}</div>
            <div class="tname">${t.name}</div>
          </div>`).join('')}
      </div>
    </div>`;

  document.getElementById('btn-change-tag').onclick = ()=>{ CardState.player=null; renderStart(); };
  main.querySelectorAll('.tpl-btn').forEach(el=>{
    el.onclick = ()=>{
      CardState.templateId = el.dataset.tpl;
      if(CardState.templateId==='brawler') renderBrawlerPicker();
      else renderCustomize();
    };
  });
}

/* ══════════════ ÉCRAN 2b : choix du brawler ══════════════ */
function renderBrawlerPicker(){
  const brawlers = [...(CardState.player.brawlers||[])].sort((a,b)=>b.trophies-a.trophies);
  const main = document.getElementById('main');
  main.innerHTML = `
    <div class="card-box">
      <div class="step-title">Choisis un brawler</div>
      <input class="inp search-inp" id="brawler-search" placeholder="Rechercher un brawler…"/>
      <div class="blist" id="blist">
        ${brawlers.map(b=>`
          <div class="bitem" data-bid="${b.id}">
            <div class="bic"><img src="${ASSET.brawlerIcon(b.id)}" onerror="this.style.display='none'"/></div>
            <div class="bnm">${escapeHtml(b.name)}</div>
            <div class="btr">${b.trophies} 🏆</div>
          </div>`).join('')}
      </div>
      <button class="btn-main secondary" id="btn-back-tpl">← Retour</button>
    </div>`;

  document.getElementById('btn-back-tpl').onclick = renderTemplatePicker;

  function bindItems(){
    main.querySelectorAll('.bitem').forEach(el=>{
      el.onclick = ()=>{
        const bid = Number(el.dataset.bid);
        CardState.selectedBrawler = brawlers.find(b=>b.id===bid);
        renderCustomize();
      };
    });
  }
  bindItems();

  document.getElementById('brawler-search').addEventListener('input', debounce(e=>{
    const q = e.target.value.trim().toLowerCase();
    const filtered = brawlers.filter(b=>b.name.toLowerCase().includes(q));
    document.getElementById('blist').innerHTML = filtered.map(b=>`
      <div class="bitem" data-bid="${b.id}">
        <div class="bic"><img src="${ASSET.brawlerIcon(b.id)}" onerror="this.style.display='none'"/></div>
        <div class="bnm">${escapeHtml(b.name)}</div>
        <div class="btr">${b.trophies} 🏆</div>
      </div>`).join('');
    bindItems();
  }, 120));
}

/* ══════════════ ÉCRAN 3 : aperçu + personnalisation + export ══════════════ */
function renderCustomize(){
  const main = document.getElementById('main');
  const bgKeys = Object.keys(BACKGROUNDS);

  main.innerHTML = `
    <div class="col-left">
      <div class="card-box">
        <div class="preview-wrap"><canvas id="card-canvas"></canvas></div>
        <div class="err-box" id="draw-err"></div>
        <div class="actions-row">
          <button class="btn-main secondary" id="btn-back">← Retour</button>
          <button class="btn-main" id="btn-download">Télécharger</button>
        </div>
      </div>
    </div>
    <div class="col-right">
      <div class="card-box">
        <div class="step-title">Personnalisation</div>

        <div class="customize-section">
          <div class="cs-title">🎨 Fond</div>
          <div class="bg-grid" id="bg-grid">
            ${bgKeys.map(k=>{
              const bg = BACKGROUNDS[k];
              return `<div class="bg-swatch" data-bg="${k}" title="${bg.label}"
                style="background:linear-gradient(135deg,${bg.swatch[0]},${bg.swatch[1]})">
                <div class="bg-label">${bg.label}</div>
              </div>`;
            }).join('')}
          </div>
        </div>

        <div class="customize-section">
          <div class="cs-title">✨ Effets</div>
          <div class="effect-grid" id="effect-grid">
            ${[
              ['glow','Glow'],['shine','Shine'],['particles','Particules'],
              ['noise','Grain'],['vignette','Vignette'],['reflection','Reflet']
            ].map(([k,label])=>`
              <div class="effect-pill" data-eff="${k}"><span class="dot"></span>${label}</div>
            `).join('')}
          </div>
        </div>

        <div class="customize-section">
          <div class="cs-title">📐 Format</div>
          <div class="select-pills" id="format-pills">
            ${Object.entries(CONFIG.FORMATS).map(([k,f])=>`
              <div class="select-pill" data-format="${k}">${f.label}</div>
            `).join('')}
          </div>
        </div>

        <div class="customize-section">
          <div class="cs-title">🖼️ Bordure &amp; coins</div>
          <div class="toggle-row" style="margin-bottom:12px">
            <span style="font-size:.85rem;color:var(--text2)">Bordure dégradée</span>
            <div class="toggle" id="border-toggle"></div>
          </div>
          <div class="slider-row">
            <span style="font-size:.8rem;color:var(--text2);white-space:nowrap">Arrondi</span>
            <input type="range" id="radius-slider" min="0" max="60" value="${CardState.cornerRadius}"/>
            <span class="slider-val" id="radius-val">${CardState.cornerRadius}</span>
          </div>
        </div>

        <div class="customize-section">
          <div class="cs-title">📤 Qualité d'export</div>
          <div class="select-pills" id="quality-pills">
            <div class="select-pill" data-quality="sd">SD</div>
            <div class="select-pill" data-quality="hd">HD</div>
            <div class="select-pill" data-quality="2k">2K</div>
            <div class="select-pill" data-quality="4k">4K</div>
          </div>
        </div>
      </div>
    </div>`;

  document.getElementById('btn-back').onclick = ()=>{
    if(CardState.templateId==='brawler') renderBrawlerPicker(); else renderTemplatePicker();
  };
  document.getElementById('btn-download').onclick = ()=>{
    const canvas = document.getElementById('card-canvas');
    exportCard(canvas);
    toast('Image téléchargée ✓','ok');
  };

  // Sélections initiales dans l'UI
  syncSelectionUI();

  document.getElementById('bg-grid').querySelectorAll('.bg-swatch').forEach(el=>{
    el.onclick = ()=>{
      CardState.background = el.dataset.bg;
      syncSelectionUI(); redraw();
    };
  });

  document.getElementById('effect-grid').querySelectorAll('.effect-pill').forEach(el=>{
    el.onclick = ()=>{
      const key = el.dataset.eff;
      const idx = CardState.effects.indexOf(key);
      if(idx>-1) CardState.effects.splice(idx,1); else CardState.effects.push(key);
      syncSelectionUI(); redraw();
    };
  });

  document.getElementById('format-pills').querySelectorAll('.select-pill').forEach(el=>{
    el.onclick = ()=>{
      CardState.format = el.dataset.format;
      syncSelectionUI(); redraw();
    };
  });

  document.getElementById('quality-pills').querySelectorAll('.select-pill').forEach(el=>{
    el.onclick = ()=>{
      CardState.quality = el.dataset.quality;
      syncSelectionUI();
    };
  });

  document.getElementById('border-toggle').onclick = ()=>{
    CardState.border = !CardState.border;
    syncSelectionUI(); redraw();
  };

  const slider = document.getElementById('radius-slider');
  slider.addEventListener('input', debounce(()=>{
    CardState.cornerRadius = Number(slider.value);
    document.getElementById('radius-val').textContent = slider.value;
    redraw();
  }, 40));

  redraw();
}

function syncSelectionUI(){
  document.querySelectorAll('.bg-swatch').forEach(el=>{
    el.classList.toggle('sel', el.dataset.bg===CardState.background);
  });
  document.querySelectorAll('.effect-pill').forEach(el=>{
    el.classList.toggle('on', CardState.effects.includes(el.dataset.eff));
  });
  document.querySelectorAll('#format-pills .select-pill').forEach(el=>{
    el.classList.toggle('sel', el.dataset.format===CardState.format);
  });
  document.querySelectorAll('#quality-pills .select-pill').forEach(el=>{
    el.classList.toggle('sel', el.dataset.quality===CardState.quality);
  });
  const bt = document.getElementById('border-toggle');
  if(bt) bt.classList.toggle('on', CardState.border);
}

async function redraw(){
  const canvas = document.getElementById('card-canvas');
  const errBox = document.getElementById('draw-err');
  if(!canvas) return;
  try{
    await renderCard(canvas);
    if(errBox) errBox.textContent='';
  }catch(e){
    console.error(e);
    if(errBox) errBox.textContent = "Une erreur est survenue pendant la génération de l'image.";
  }
}

function escapeHtml(str){
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}
