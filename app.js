let rowId = 0;

function addItem() {
    rowId++;
    const div = document.createElement('div');
    div.className = 'item-row';
    div.innerHTML = `
        <div style="display:flex; gap:10px;">
            <div style="flex:2;">
                <label>Ширина (мм)</label>
                <input type="number" class="w-val" value="250">
            </div>
            <div style="flex:1;">
                <label>Кол-во</label>
                <input type="number" class="q-val" value="5">
            </div>
        </div>
        <button class="remove-btn" onclick="this.parentElement.remove()">×</button>
    `;
    document.getElementById('items-container').appendChild(div);
}

function calculate() {
    const sheetW = +document.getElementById('sheetW').value;
    const knife = 0;
    const ws = document.querySelectorAll('.w-val');
    const qs = document.querySelectorAll('.q-val');

    let strips = [];
    ws.forEach((w, i) => {
        for (let j = 0; j < qs[i].value; j++) strips.push(+w.value);
    });

    strips.sort((a, b) => b - a);
    let sheets = [];

    strips.forEach(w => {
        let placed = false;
        for (let s of sheets) {
            let used = s.reduce((a, b) => a + b + knife, 0);
            if (used + w <= sheetW) {
                s.push(w);
                placed = true;
                break;
            }
        }
        if (!placed) sheets.push([w]);
    });

    renderSheets(sheets, sheetW, knife);
}

function renderSheets(sheets, sheetW, knife) {
    const colors = ['#1a73e8','#34a853','#f9ab00','#9334e6','#12b5cb'];
    let html = '';
    let wasteSum = 0;

    sheets.forEach((sheet, i) => {
        let used = sheet.reduce((a,b)=>a+b+knife,0);
        let waste = sheetW - used;
        wasteSum += waste;

        html += `<div class="sheet-box">
            <div class="sheet-title">Лист №${i+1} (остаток ${waste} мм)</div>
            <div class="visual-row">`;

        sheet.forEach(w=>{
            html += `<div class="stripe" style="width:${w/sheetW*100}%;background:${colors[w%colors.length]}">${w}</div>`;
        });

        if (waste > 0) {
            html += `<div class="waste" style="width:${waste/sheetW*100}%">${waste}</div>`;
        }

        html += `</div></div>`;
    });

    document.getElementById('sheets-container').innerHTML = html;
    document.getElementById('total-sheets').innerText = sheets.length;
    document.getElementById('total-waste').innerText = wasteSum + ' мм';
    document.getElementById('result-area').style.display = 'block';
}

addItem();