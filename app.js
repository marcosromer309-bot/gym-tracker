const DAY_EMOJI = {PUSH:'🔴',PULL:'🔵',LEGS:'🟢',UPPER:'🟡',LOWER:'🟠'};
const DRAFT_KEY = 'gymtracker_draft_v1';
const HIST_KEY = 'gymtracker_history_v1';

const ROUTINE = {
  PUSH: [
    'Press de banca plano con barra',
    'Press inclinado con mancuernas (30-45°)',
    'Press militar con mancuernas sentado',
    'Elevaciones laterales con mancuernas',
    'Fondos en paralelas (o press en máquina)',
    'Extensión de tríceps en polea (cuerda)'
  ],
  PULL: [
    'Dominadas (o jalón al pecho en polea)',
    'Remo con barra (Pendlay o estándar)',
    'Remo con mancuerna a una mano',
    'Face Pull en polea alta (cuerda)',
    'Curl de bíceps con barra EZ',
    'Curl martillo con mancuernas alternado'
  ],
  LEGS: [
    'Sentadilla con barra (trasera)',
    'Prensa de piernas (45°)',
    'Extensión de cuádriceps en máquina',
    'Peso muerto rumano con barra',
    'Curl femoral tumbado en máquina',
    'Elevación de pantorrilla de pie (máquina o escalón)'
  ],
  UPPER: [
    'Press banca inclinado con barra (30°)',
    'Jalón al pecho en polea agarre cerrado',
    'Press Arnold con mancuernas',
    'Remo en polea baja sentado (agarre ancho)',
    'Aperturas con mancuernas (banco plano)',
    'Elevaciones laterales en polea baja',
    'Curl predicador con barra EZ',
    'Press francés con mancuernas'
  ],
  LOWER: [
    'Peso muerto convencional con barra',
    'Sentadilla búlgara con mancuernas',
    'Hip Thrust con barra en banco',
    'Curl femoral sentado en máquina',
    'Zancadas caminando con mancuernas',
    'Elevación de pantorrilla sentado (máquina)'
  ]
};

let state = loadDraft() || {
  date: todayISO(), dayType: 'PUSH', dayNum: 1, entry: '', exit: '',
  exercises: [emptyExercise()]
};

function todayISO(){ return new Date().toISOString().slice(0,10); }
function emptyExercise(name){ return { name: name||'', rpe:'', series:['','','',''] }; }
function loadDraft(){ try{ return JSON.parse(localStorage.getItem(DRAFT_KEY)); }catch(e){ return null; } }
function saveDraft(){ localStorage.setItem(DRAFT_KEY, JSON.stringify(state)); }
function loadHistory(){ try{ return JSON.parse(localStorage.getItem(HIST_KEY)) || []; }catch(e){ return []; } }
function saveHistory(list){ localStorage.setItem(HIST_KEY, JSON.stringify(list)); }

function toast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(function(){ t.classList.remove('show'); }, 1800);
}

function populateDatalist(){
  const dl = document.getElementById('exercise-names');
  const all = [];
  Object.keys(ROUTINE).forEach(function(k){
    ROUTINE[k].forEach(function(n){ if(all.indexOf(n)===-1) all.push(n); });
  });
  dl.innerHTML = all.map(function(n){ return '<option value="' + escapeHtml(n) + '"></option>'; }).join('');
}

function renderTop(){
  document.getElementById('f-date').value = state.date;
  document.getElementById('f-daynum').value = state.dayNum;
  document.getElementById('f-entry').value = state.entry;
  document.getElementById('f-exit').value = state.exit;
  document.querySelectorAll('#daytype-grid button').forEach(function(b){
    b.classList.toggle('sel', b.dataset.t === state.dayType);
  });
  document.getElementById('routine-daytype-label').textContent = state.dayType;
}

function renderExercises(){
  const list = document.getElementById('exercise-list');
  list.innerHTML = '';
  state.exercises.forEach(function(ex, i){
    const div = document.createElement('div');
    div.className = 'ex';
    let seriesInputs = '';
    for(let si=0; si<ex.series.length; si++){
      seriesInputs += '<input type="text" data-series="' + si + '" data-idx="' + i + '" value="' + escapeHtml(ex.series[si]) + '" placeholder="S' + (si+1) + ': kg×reps">';
    }
    div.innerHTML =
      '<div class="ex-head">' +
        '<strong>Ejercicio ' + (i+1) + '</strong>' +
        '<button class="icon-btn" data-remove="' + i + '">✕</button>' +
      '</div>' +
      '<label>Nombre</label>' +
      '<input type="text" list="exercise-names" data-field="name" data-idx="' + i + '" value="' + escapeHtml(ex.name) + '" placeholder="Ej: Press banca plano">' +
      '<div class="series-grid">' + seriesInputs + '</div>' +
      '<label>RPE</label>' +
      '<input type="number" min="1" max="10" data-field="rpe" data-idx="' + i + '" value="' + escapeHtml(ex.rpe) + '" placeholder="1-10">';
    list.appendChild(div);
  });
}

function escapeHtml(v){ return (v||'').toString().replace(/"/g,'&quot;'); }

function renderAll(){ renderTop(); renderExercises(); saveDraft(); }

document.getElementById('f-date').addEventListener('input', function(e){ state.date=e.target.value; saveDraft(); });
document.getElementById('f-daynum').addEventListener('input', function(e){ state.dayNum=e.target.value; saveDraft(); });
document.getElementById('f-entry').addEventListener('input', function(e){ state.entry=e.target.value; saveDraft(); });
document.getElementById('f-exit').addEventListener('input', function(e){ state.exit=e.target.value; saveDraft(); });

document.getElementById('daytype-grid').addEventListener('click', function(e){
  const b = e.target.closest('button'); if(!b) return;
  state.dayType = b.dataset.t; renderTop(); saveDraft();
});

document.getElementById('btn-load-routine').addEventListener('click', function(){
  const preset = ROUTINE[state.dayType] || [];
  const hasData = state.exercises.some(function(ex){ return ex.name || ex.rpe || ex.series.some(function(s){ return s; }); });
  if(hasData && !confirm('Esto reemplaza los ' + state.exercises.length + ' ejercicio(s) actuales por los ' + preset.length + ' de ' + state.dayType + '. ¿Continuar?')){
    return;
  }
  state.exercises = preset.map(function(name){ return emptyExercise(name); });
  renderExercises(); saveDraft();
  toast('Ejercicios de ' + state.dayType + ' cargados ✓');
});

document.getElementById('exercise-list').addEventListener('input', function(e){
  const idx = e.target.dataset.idx; if(idx===undefined) return;
  if(e.target.dataset.field==='name') state.exercises[idx].name = e.target.value;
  if(e.target.dataset.field==='rpe') state.exercises[idx].rpe = e.target.value;
  if(e.target.dataset.series!==undefined) state.exercises[idx].series[e.target.dataset.series] = e.target.value;
  saveDraft();
});

document.getElementById('exercise-list').addEventListener('click', function(e){
  const idx = e.target.dataset.remove;
  if(idx===undefined) return;
  state.exercises.splice(idx,1);
  if(state.exercises.length===0) state.exercises.push(emptyExercise());
  renderExercises(); saveDraft();
});

document.getElementById('btn-add-ex').addEventListener('click', function(){
  state.exercises.push(emptyExercise());
  renderExercises(); saveDraft();
});

document.querySelectorAll('.tab').forEach(function(tab){
  tab.addEventListener('click', function(){
    document.querySelectorAll('.tab').forEach(function(t){ t.classList.remove('active'); });
    tab.classList.add('active');
    ['log','report','history'].forEach(function(v){
      document.getElementById('view-'+v).style.display = (v===tab.dataset.view) ? '' : 'none';
    });
    if(tab.dataset.view === 'report') renderReport();
    if(tab.dataset.view === 'history') renderHistory();
  });
});

function fmtDate(iso){
  if(!iso) return '__/__/____';
  const parts = iso.split('-');
  return parts[2] + '/' + parts[1] + '/' + parts[0];
}

function buildReportText(){
  let lines = [];
  lines.push('📅 ' + fmtDate(state.date) + ' — DÍA ' + state.dayNum + ' — ' + state.dayType);
  lines.push('🕐 Entrada: ' + (state.entry||'--:--') + '  |  🏁 Salida: ' + (state.exit||'--:--'));
  lines.push('─'.repeat(36));
  state.exercises.forEach(function(ex,i){
    if(!ex.name) return;
    lines.push((i+1) + '. ' + ex.name);
    ex.series.forEach(function(s,si){
      if(!s) return;
      const parts = s.split('×');
      if(parts.length===2){
        lines.push('   Serie ' + (si+1) + ': ' + parts[0].trim() + 'kg × ' + parts[1].trim() + ' reps');
      } else {
        lines.push('   Serie ' + (si+1) + ': ' + s);
      }
    });
    if(ex.rpe) lines.push('   RPE: ' + ex.rpe);
  });
  return lines.join('\n');
}

function renderReport(){
  document.getElementById('report-text').textContent = buildReportText();
}

document.getElementById('btn-copy').addEventListener('click', function(){
  const txt = buildReportText();
  navigator.clipboard.writeText(txt).then(function(){
    toast('Reporte copiado ✓');
  }).catch(function(){
    toast('No se pudo copiar, selecciona el texto manualmente');
  });
});

document.getElementById('btn-finish').addEventListener('click', function(){
  const txt = buildReportText();
  const hist = loadHistory();
  hist.unshift({ date: state.date, dayType: state.dayType, dayNum: state.dayNum, text: txt, savedAt: Date.now() });
  saveHistory(hist);
  state = { date: todayISO(), dayType:'PUSH', dayNum: Number(state.dayNum)+1, entry:'', exit:'', exercises:[emptyExercise()] };
  renderAll();
  document.querySelector('.tab[data-view="log"]').click();
  toast('Guardado en historial ✓');
});

function renderHistory(){
  const hist = loadHistory();
  const el = document.getElementById('history-list');
  if(hist.length===0){ el.innerHTML = '<div class="empty">Sin sesiones guardadas todavía.</div>'; return; }
  el.innerHTML = hist.map(function(h,i){
    return '<div class="hist-item">' +
      '<div class="meta">' + (DAY_EMOJI[h.dayType]||'') + ' ' + fmtDate(h.date) + ' — DÍA ' + h.dayNum + ': ' + h.dayType + '</div>' +
      '<button class="btn btn-secondary" data-copy="' + i + '">📋 Copiar</button>' +
    '</div>';
  }).join('');
}

document.getElementById('history-list').addEventListener('click', function(e){
  const idx = e.target.dataset.copy; if(idx===undefined) return;
  const hist = loadHistory();
  navigator.clipboard.writeText(hist[idx].text).then(function(){ toast('Copiado ✓'); }).catch(function(){ toast('No se pudo copiar'); });
});

document.getElementById('btn-clear-hist').addEventListener('click', function(){
  if(confirm('¿Borrar todo el historial guardado en este dispositivo?')){
    saveHistory([]); renderHistory();
  }
});

if(!state.date) state.date = todayISO();
if(!state.entry){
  const now = new Date();
  state.entry = now.toTimeString().slice(0,5);
}
populateDatalist();
renderAll();

if('serviceWorker' in navigator){
  window.addEventListener('load', function(){
    navigator.serviceWorker.register('sw.js').catch(function(){});
  });
}
