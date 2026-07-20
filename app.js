const DAYS = {
  push: {
    label: "DÍA 1 — PUSH",
    desc: "Pecho · Hombros · Tríceps",
    color: "push",
    exercises: [
      { name: "Press de banca plano con barra", target: "4 × 6–10 · Pecho", sets: 4, rpe: "7" },
      { name: "Press inclinado con mancuernas", target: "3 × 8–12 · Pecho superior", sets: 3, rpe: "8" },
      { name: "Press militar con mancuernas", target: "3 × 8–12 · Deltoides", sets: 3, rpe: "8" },
      { name: "Elevaciones laterales", target: "4 × 12–15 · Deltoides medial", sets: 4, rpe: "9" },
      { name: "Fondos en paralelas", target: "3 × 8–12 · Tríceps / Pecho", sets: 3, rpe: "8" },
      { name: "Extensión tríceps en polea (cuerda)", target: "4 × 10–15 · Tríceps", sets: 4, rpe: "9" },
    ]
  },
  pull: {
    label: "DÍA 2 — PULL",
    desc: "Espalda · Bíceps",
    color: "pull",
    exercises: [
      { name: "Dominadas (o jalón al pecho)", target: "4 × 6–10 · Dorsal ancho", sets: 4, rpe: "7" },
      { name: "Remo con barra", target: "4 × 6–10 · Dorsal / Romboides", sets: 4, rpe: "7" },
      { name: "Remo con mancuerna a una mano", target: "3 × 8–12 · Dorsal unilateral", sets: 3, rpe: "8" },
      { name: "Face Pull en polea alta (cuerda)", target: "3 × 12–15 · Deltoides posterior", sets: 3, rpe: "9" },
      { name: "Curl de bíceps con barra EZ", target: "3 × 8–12 · Bíceps", sets: 3, rpe: "8" },
      { name: "Curl martillo con mancuernas", target: "4 × 10–15 · Braquialis", sets: 4, rpe: "9" },
    ]
  },
  legs: {
    label: "DÍA 3 — LEGS",
    desc: "Cuádriceps · Isquios · Glúteos · Gemelos",
    color: "legs",
    exercises: [
      { name: "Sentadilla con barra (o Smith)", target: "4 × 6–10 · Cuádriceps / Glúteos", sets: 4, rpe: "7" },
      { name: "Prensa de piernas (45°)", target: "3 × 8–12 · Cuádriceps", sets: 3, rpe: "8" },
      { name: "Extensión de cuádriceps", target: "3 × 10–15 · Cuádriceps aislado", sets: 3, rpe: "9" },
      { name: "Peso muerto rumano con barra", target: "3 × 8–12 · Isquiotibiales", sets: 3, rpe: "7" },
      { name: "Curl femoral tumbado", target: "3 × 10–15 · Isquiotibiales", sets: 3, rpe: "9" },
      { name: "Elevación de pantorrilla de pie", target: "5 × 12–15 · Gemelos", sets: 5, rpe: "9" },
    ]
  },
  upper: {
    label: "DÍA 4 — UPPER",
    desc: "Volumen superior complementario",
    color: "upper",
    exercises: [
      { name: "Press inclinado barra (30°)", target: "3 × 8–12 · Pecho superior", sets: 3, rpe: "8" },
      { name: "Jalón al pecho agarre cerrado", target: "3 × 8–12 · Dorsal / Bíceps", sets: 3, rpe: "8" },
      { name: "Press Arnold con mancuernas", target: "3 × 10–12 · Deltoides completo", sets: 3, rpe: "8" },
      { name: "Remo en polea baja (agarre ancho)", target: "3 × 10–12 · Espalda media", sets: 3, rpe: "8" },
      { name: "Aperturas con mancuernas", target: "3 × 12–15 · Pecho", sets: 3, rpe: "9" },
      { name: "Elevaciones laterales en polea", target: "3 × 15–20 · Deltoides medial", sets: 3, rpe: "9" },
      { name: "Curl predicador barra EZ", target: "3 × 12–15 · Bíceps", sets: 3, rpe: "9" },
      { name: "Press francés con mancuernas", target: "3 × 12–15 · Tríceps", sets: 3, rpe: "9" },
    ]
  },
  lower: {
    label: "DÍA 5 — LOWER",
    desc: "Fuerza · Glúteos · Isquios",
    color: "lower",
    exercises: [
      { name: "Peso muerto convencional con barra", target: "4 × 5–8 · Cadena posterior", sets: 4, rpe: "7" },
      { name: "Sentadilla búlgara con mancuernas", target: "3 × 8–12 · Cuádriceps / Glúteos", sets: 3, rpe: "8" },
      { name: "Hip Thrust con barra", target: "3 × 8–12 · Glúteos", sets: 3, rpe: "8" },
      { name: "Curl femoral sentado", target: "3 × 10–15 · Isquiotibiales", sets: 3, rpe: "9" },
      { name: "Zancadas caminando con mancuernas", target: "3 × 10–12/pierna · Cuádriceps", sets: 3, rpe: "8" },
      { name: "Elevación de pantorrilla sentado", target: "5 × 15–20 · Sóleo", sets: 5, rpe: "9" },
    ]
  }
};

let currentDay = null;
let exerciseData = [];

// ── PERSISTENCIA (autosave para no perder datos si se recarga por accidente) ──
const DRAFT_KEY = 'gymtracker_draft_v2';

function saveDraft() {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({
      currentDay: currentDay,
      exerciseData: exerciseData,
      sessionDate: document.getElementById('sessionDate').value,
      entryTime: document.getElementById('entryTime').value,
      exitTime: document.getElementById('exitTime').value,
      gymTimerRunning: gymTimerRunning,
      gymTimerStart: gymTimerStart,
      gymTimerSeconds: gymTimerSeconds
    }));
  } catch (e) {}
}

function loadDraft() {
  try { return JSON.parse(localStorage.getItem(DRAFT_KEY)); } catch (e) { return null; }
}

// ── PESOS MÁXIMOS POR EJERCICIO (para saber con qué peso empezar la próxima vez) ──
const MAXW_KEY = 'gymtracker_maxweights_v1';

// Pesos de partida por defecto (últimos registrados), incluidos en la app para
// que funcionen en cualquier dispositivo (móvil, ordenador, etc.) sin depender
// del almacenamiento local de un navegador concreto. Una vez el usuario registre
// pesos nuevos en un dispositivo, esos datos (guardados en su localStorage) tienen
// prioridad sobre estos valores por defecto.
const DEFAULT_WEIGHTS = {
  "Press de banca plano con barra": 60,
  "Press inclinado con mancuernas": 50,
  "Press militar con mancuernas": 22,
  "Elevaciones laterales": 6.8,
  "Fondos en paralelas": "PC",
  "Extensión tríceps en polea (cuerda)": 20.3,
  "Dominadas (o jalón al pecho)": "PC",
  "Remo con barra": 50,
  "Remo con mancuerna a una mano": 24,
  "Face Pull en polea alta (cuerda)": 18,
  "Curl de bíceps con barra EZ": 30,
  "Curl martillo con mancuernas": 14,
  "Sentadilla con barra (o Smith)": 80,
  "Prensa de piernas (45°)": 240,
  "Extensión de cuádriceps": 39,
  "Peso muerto rumano con barra": 60,
  "Curl femoral tumbado": 32,
  "Elevación de pantorrilla de pie": 20
};

function loadMaxWeights() {
  try { return JSON.parse(localStorage.getItem(MAXW_KEY)) || {}; } catch (e) { return {}; }
}

function saveMaxWeights(data) {
  try { localStorage.setItem(MAXW_KEY, JSON.stringify(data)); } catch (e) {}
}

function parseKg(v) {
  if (v === undefined || v === null || v === '') return null;
  const n = parseFloat(String(v).replace(',', '.'));
  return isNaN(n) ? null : n;
}

function getSuggestedWeight(name) {
  const data = loadMaxWeights();
  if (data[name] !== undefined) return data[name];
  if (DEFAULT_WEIGHTS[name] !== undefined) return DEFAULT_WEIGHTS[name];
  return null;
}

function updateMaxWeightForExercise(exIdx) {
  const ex = exerciseData[exIdx];
  if (!ex || ex.skipped) return;
  const weights = ex.sets.map(s => parseKg(s.kg)).filter(n => n !== null);
  if (weights.length === 0) return;
  const maxW = Math.max(...weights);
  const data = loadMaxWeights();
  if (data[ex.name] === undefined || maxW > data[ex.name]) {
    data[ex.name] = maxW;
    saveMaxWeights(data);
  }
}

// Set today's date and current time as entry
const dateInput = document.getElementById('sessionDate');
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth()+1).padStart(2,'0');
const dd = String(today.getDate()).padStart(2,'0');
dateInput.value = `${yyyy}-${mm}-${dd}`;
const hh = String(today.getHours()).padStart(2,'0');
const min = String(today.getMinutes()).padStart(2,'0');
document.getElementById('entryTime').value = `${hh}:${min}`;

dateInput.addEventListener('input', saveDraft);
document.getElementById('entryTime').addEventListener('input', saveDraft);

// ── GYM TIMER ────────────────────────────────────────────────────────────────
let gymTimerInterval = null;
let gymTimerRunning = false;
let gymTimerSeconds = 0;
let gymTimerStart = null;

function toggleGymTimer() {
  const btn = document.getElementById('gymTimerBtn');
  const display = document.getElementById('gymTimerDisplay');
  if (!gymTimerRunning) {
    gymTimerStart = Date.now() - gymTimerSeconds * 1000;
    gymTimerInterval = setInterval(() => {
      gymTimerSeconds = Math.floor((Date.now() - gymTimerStart) / 1000);
      display.textContent = formatGymTime(gymTimerSeconds);
      display.classList.remove('stopped');
    }, 1000);
    gymTimerRunning = true;
    btn.textContent = '⏹ Finalizar';
    btn.className = 'gym-timer-btn running';
    const now = new Date();
    document.getElementById('entryTime').value =
      String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0');
    saveDraft();
  } else {
    clearInterval(gymTimerInterval);
    gymTimerRunning = false;
    btn.textContent = '▶ Reanudar';
    btn.className = 'gym-timer-btn start';
    display.classList.add('stopped');
    const now = new Date();
    document.getElementById('exitTime').value =
      String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0');
    updateDuration();
    saveDraft();
  }
}

function formatGymTime(s) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
}

function updateDuration() {
  const entry = document.getElementById('entryTime').value;
  const exit  = document.getElementById('exitTime').value;
  if (!entry || !exit) return;
  const [eh, em] = entry.split(':').map(Number);
  const [xh, xm] = exit.split(':').map(Number);
  const totalMin = (xh * 60 + xm) - (eh * 60 + em);
  if (totalMin > 0) {
    const display = document.getElementById('gymTimerDisplay');
    display.textContent = formatGymTime(totalMin * 60);
    gymTimerSeconds = totalMin * 60;
  }
  saveDraft();
}

// ── REST TIMER ────────────────────────────────────────────────────────────────
let restInterval   = null;
let restTotal      = 90;
let restEndTime    = null;
let restPaused     = false;
let restPausedSecs = 0;

const restTimesByDay = {
  push:  [180, 120, 120, 75, 120, 75],
  pull:  [180, 180, 120, 75, 90, 75],
  legs:  [210, 120, 75, 120, 75, 60],
  upper: [120, 120, 90, 90, 75, 60, 75, 75],
  lower: [240, 120, 120, 75, 120, 60],
};

function startRestFromExercise(exIdx) {
  if (!currentDay) return;
  const secs = restTimesByDay[currentDay][exIdx] || 90;
  setRestTimer(secs);
}

function setRestTimer(seconds) {
  clearInterval(restInterval);
  restTotal   = seconds;
  restPaused  = false;
  restEndTime = Date.now() + seconds * 1000;
  document.getElementById('restTimerBar').classList.add('visible');
  document.getElementById('restPauseBtn').textContent = '⏸ Pausar';
  updateRestDisplay(seconds);
  restInterval = setInterval(tickRest, 500);
}

function tickRest() {
  if (restPaused) return;
  const remaining = Math.ceil((restEndTime - Date.now()) / 1000);
  if (remaining <= 0) {
    clearInterval(restInterval);
    const display = document.getElementById('restTimerCount');
    display.className = 'rest-timer-count done';
    display.textContent = '✓ ¡Listo!';
    document.getElementById('restProgressFill').style.width = '0%';
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
  } else {
    updateRestDisplay(remaining);
  }
}

function updateRestDisplay(remaining) {
  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  const display = document.getElementById('restTimerCount');
  display.textContent = `${m}:${String(s).padStart(2,'0')}`;
  const pct = (remaining / restTotal) * 100;
  document.getElementById('restProgressFill').style.width = pct + '%';
  display.className = 'rest-timer-count' + (remaining <= 10 ? ' warning' : '');
}

function pauseRestTimer() {
  if (!restPaused) {
    restPausedSecs = Math.ceil((restEndTime - Date.now()) / 1000);
    restPaused = true;
    clearInterval(restInterval);
    document.getElementById('restPauseBtn').textContent = '▶ Reanudar';
  } else {
    restEndTime = Date.now() + restPausedSecs * 1000;
    restPaused  = false;
    restInterval = setInterval(tickRest, 500);
    document.getElementById('restPauseBtn').textContent = '⏸ Pausar';
  }
}

function resetRestTimer() {
  clearInterval(restInterval);
  restPaused  = false;
  restEndTime = Date.now() + restTotal * 1000;
  updateRestDisplay(restTotal);
  restInterval = setInterval(tickRest, 500);
  document.getElementById('restPauseBtn').textContent = '⏸ Pausar';
}

function closeRestTimer() {
  clearInterval(restInterval);
  restPaused = false;
  document.getElementById('restTimerBar').classList.remove('visible');
}

document.addEventListener('visibilitychange', () => {
  if (!document.hidden && restEndTime && !restPaused) {
    const remaining = Math.ceil((restEndTime - Date.now()) / 1000);
    if (remaining <= 0) {
      tickRest();
    } else {
      updateRestDisplay(remaining);
    }
  }
});

function selectDay(day) {
  document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`.day-btn.${day}`).classList.add('active');
  currentDay = day;
  renderExercises();
  saveDraft();
}

function renderExercises() {
  const day = DAYS[currentDay];

  const desc = document.getElementById('dayDesc');
  desc.className = `day-desc visible ${day.color}`;
  desc.innerHTML = `<strong>${day.label}</strong> — ${day.desc}`;

  exerciseData = day.exercises.map(ex => ({
    name: ex.name,
    target: ex.target,
    skipped: false,
    sets: Array.from({length: ex.sets}, () => ({ kg: '', reps: '' })),
    rpe: ex.rpe || '8',
    notes: ''
  }));

  renderList();
}

function renderList() {
  const container = document.getElementById('exerciseList');
  container.innerHTML = '';

  exerciseData.forEach((ex, exIdx) => {
    const card = document.createElement('div');
    card.className = 'exercise-card';
    card.style.opacity = ex.skipped ? '0.4' : '1';

    const header = document.createElement('div');
    header.className = 'exercise-header';

    const suggested = getSuggestedWeight(ex.name);

    const info = document.createElement('div');
    info.className = 'exercise-info';
    info.innerHTML = `
      <div class="exercise-num">EJERCICIO ${exIdx+1}
        <button class="skip-btn ${ex.skipped ? 'skipped' : ''}" onclick="toggleSkip(${exIdx})">
          ${ex.skipped ? '✗ Saltado' : 'Saltar'}
        </button>
      </div>
      <div class="exercise-name">${ex.name}</div>
      <div class="exercise-target">${ex.target}${suggested !== null ? ` · Empezar con <strong style="color:var(--accent)">${suggested === 'PC' ? 'peso corporal' : suggested + 'kg'}</strong>` : ''}</div>
    `;

    const rpeContainer = document.createElement('div');
    rpeContainer.className = 'rpe-container';
    rpeContainer.innerHTML = `
      <span class="rpe-label">RPE</span>
      <select class="rpe-select" onchange="updateRPE(${exIdx}, this.value)">
        ${[5,6,7,8,9,10].map(v => `<option value="${v}" ${ex.rpe==v?'selected':''}>${v}</option>`).join('')}
      </select>
    `;

    header.appendChild(info);
    header.appendChild(rpeContainer);
    card.appendChild(header);

    if (!ex.skipped) {
      const setsArea = document.createElement('div');
      setsArea.className = 'sets-area';

      const setsHeader = document.createElement('div');
      setsHeader.className = 'sets-header';
      setsHeader.innerHTML = `<span>SER.</span><span>KG</span><span>REPS</span><span></span>`;
      setsArea.appendChild(setsHeader);

      ex.sets.forEach((set, setIdx) => {
        const row = document.createElement('div');
        row.className = 'set-row';
        row.innerHTML = `
          <span class="set-num">${setIdx+1}</span>
          <input class="set-input" type="text" inputmode="decimal" placeholder="${(setIdx===0 && !set.kg && suggested!==null) ? suggested : 'kg'}" value="${set.kg}"
            onchange="updateSet(${exIdx}, ${setIdx}, 'kg', this.value)"
            oninput="updateSet(${exIdx}, ${setIdx}, 'kg', this.value)">
          <input class="set-input" type="number" inputmode="numeric" placeholder="reps" value="${set.reps}"
            onchange="updateSet(${exIdx}, ${setIdx}, 'reps', this.value)"
            oninput="updateSet(${exIdx}, ${setIdx}, 'reps', this.value)"
            onblur="startRestFromExercise(${exIdx})">
          <button class="set-delete" onclick="deleteSet(${exIdx}, ${setIdx})">−</button>
        `;
        setsArea.appendChild(row);
      });

      const addBtn = document.createElement('button');
      addBtn.className = 'add-set-btn';
      addBtn.textContent = '+ Añadir serie';
      addBtn.onclick = () => addSet(exIdx);
      setsArea.appendChild(addBtn);
      card.appendChild(setsArea);

      const notesArea = document.createElement('div');
      notesArea.className = 'notes-area';
      const notesInput = document.createElement('textarea');
      notesInput.className = 'notes-input';
      notesInput.placeholder = 'Sensaciones, notas... (opcional)';
      notesInput.value = ex.notes;
      notesInput.oninput = (e) => { exerciseData[exIdx].notes = e.target.value; saveDraft(); };
      notesArea.appendChild(notesInput);
      card.appendChild(notesArea);
    }

    container.appendChild(card);
  });
}

function updateSet(exIdx, setIdx, field, value) {
  exerciseData[exIdx].sets[setIdx][field] = value;
  if (field === 'kg') updateMaxWeightForExercise(exIdx);
  saveDraft();
}

function updateRPE(exIdx, value) {
  exerciseData[exIdx].rpe = value;
  saveDraft();
}

function addSet(exIdx) {
  exerciseData[exIdx].sets.push({ kg: '', reps: '' });
  renderList();
  saveDraft();
}

function deleteSet(exIdx, setIdx) {
  if (exerciseData[exIdx].sets.length <= 1) return;
  exerciseData[exIdx].sets.splice(setIdx, 1);
  renderList();
  saveDraft();
}

function toggleSkip(exIdx) {
  exerciseData[exIdx].skipped = !exerciseData[exIdx].skipped;
  renderList();
  saveDraft();
}

function generateReport() {
  if (!currentDay) {
    alert('Selecciona el día primero');
    return;
  }

  const day = DAYS[currentDay];
  const dateVal = dateInput.value;
  const [y, m, d] = dateVal.split('-');
  const dateFormatted = `${d}/${m}/${y}`;

  const entryTime = document.getElementById('entryTime').value;
  const exitTime  = document.getElementById('exitTime').value;
  const duration  = gymTimerSeconds > 0 ? formatGymTime(gymTimerSeconds) : '—';

  let report = `📅 ${dateFormatted} — ${day.label}\n`;
  if (entryTime) report += `🕐 Entrada: ${entryTime}`;
  if (exitTime)  report += `  |  🏁 Salida: ${exitTime}`;
  if (gymTimerSeconds > 0) report += `  |  ⏱ Total: ${duration}`;
  report += `\n${'─'.repeat(36)}\n`;

  exerciseData.forEach((ex, i) => {
    if (ex.skipped) {
      report += `\n${i+1}. ${ex.name}\n   ⏭ SALTADO\n`;
      return;
    }

    const validSets = ex.sets.filter(s => s.kg !== '' || s.reps !== '');
    if (validSets.length === 0) return;

    report += `\n${i+1}. ${ex.name}\n`;
    validSets.forEach((s, idx) => {
      const kg = s.kg || '?';
      const reps = s.reps || '?';
      report += `   Serie ${idx+1}: ${kg}kg × ${reps} reps\n`;
    });
    report += `   RPE: ${ex.rpe}\n`;
    if (ex.notes.trim()) {
      report += `   📝 ${ex.notes.trim()}\n`;
    }
  });

  report += `\n${'─'.repeat(36)}`;

  document.getElementById('reportText').textContent = report;
  document.getElementById('modalOverlay').classList.add('open');
}

function copyReport() {
  const text = document.getElementById('reportText').textContent;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('copyBtn');
    btn.textContent = '✅ ¡Copiado! Pégalo en Claude';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = '📋 Copiar y pegar a Claude';
      btn.classList.remove('copied');
    }, 2500);
  }).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  });
}

function closeModal(e) {
  if (e.target === document.getElementById('modalOverlay')) closeModalDirect();
}
function closeModalDirect() {
  document.getElementById('modalOverlay').classList.remove('open');
}

// ── RESTAURAR BORRADOR (si hubo un cierre o recarga accidental) ───────────────
(function restoreDraft(){
  const draft = loadDraft();
  if (!draft) return;
  if (draft.sessionDate) dateInput.value = draft.sessionDate;
  if (draft.entryTime) document.getElementById('entryTime').value = draft.entryTime;
  if (draft.exitTime) document.getElementById('exitTime').value = draft.exitTime;

  if (draft.currentDay && draft.exerciseData && draft.exerciseData.length) {
    document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('active'));
    const btn = document.querySelector(`.day-btn.${draft.currentDay}`);
    if (btn) btn.classList.add('active');
    currentDay = draft.currentDay;
    exerciseData = draft.exerciseData;
    const day = DAYS[currentDay];
    const desc = document.getElementById('dayDesc');
    desc.className = `day-desc visible ${day.color}`;
    desc.innerHTML = `<strong>${day.label}</strong> — ${day.desc}`;
    renderList();
  }

  if (typeof draft.gymTimerSeconds === 'number' && draft.gymTimerSeconds > 0) {
    gymTimerSeconds = draft.gymTimerSeconds;
    const display = document.getElementById('gymTimerDisplay');
    if (draft.gymTimerRunning && draft.gymTimerStart) {
      gymTimerStart = draft.gymTimerStart;
      gymTimerSeconds = Math.floor((Date.now() - gymTimerStart) / 1000);
      gymTimerInterval = setInterval(() => {
        gymTimerSeconds = Math.floor((Date.now() - gymTimerStart) / 1000);
        display.textContent = formatGymTime(gymTimerSeconds);
        display.classList.remove('stopped');
      }, 1000);
      gymTimerRunning = true;
      display.textContent = formatGymTime(gymTimerSeconds);
      display.classList.remove('stopped');
      const btn = document.getElementById('gymTimerBtn');
      btn.textContent = '⏹ Finalizar';
      btn.className = 'gym-timer-btn running';
    } else {
      display.textContent = formatGymTime(gymTimerSeconds);
      display.classList.add('stopped');
    }
  }
})();

// ── PWA: registrar service worker para uso offline, y recargar automáticamente
// cuando haya una versión nueva disponible (para que las actualizaciones se
// apliquen solas sin tener que borrar caché a mano) ─────────────────────────
if ('serviceWorker' in navigator) {
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').then((reg) => {
      // Comprueba si hay una versión nueva cada vez que se abre la app
      reg.update().catch(() => {});
    }).catch(() => {});
  });
}
