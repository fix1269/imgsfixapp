/* imgsfix — editor.js
   Advanced canvas editor powered by Fabric.js 5.3.0.
   Presets, shapes, text, brush, layers, properties,
   undo/redo, zoom, export PNG, save project.
*/
'use strict';
(function () {
  var I = window.imgsfix;
  var $ = I.$, $$ = I.$$;
  if (typeof fabric === 'undefined') { I.toast('Editor library failed to load', 'err'); return; }

  var canvas;
  var undoStack = [], redoStack = [];
  var MAX_UNDO = 60;
  var currentTool = 'select';
  var brushColor = '#1a5fff', brushWidth = 4;
  var bgColor = '#ffffff';
  var isRestoring = false;

  var PRESETS = {
    ig_post: { w: 1080, h: 1080, label: 'IG Post 1080²' },
    ig_story: { w: 1080, h: 1920, label: 'IG Story 1080×1920' },
    yt_thumb: { w: 1280, h: 720, label: 'YT Thumb 1280×720' },
    fb_post: { w: 1200, h: 630, label: 'FB Post 1200×630' },
    custom: { w: 1920, h: 1080, label: 'Custom 1920×1080' }
  };

  function init() {
    var el = $('#editorCanvas');
    if (!el) return;
    canvas = new fabric.Canvas(el, {
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
      selection: true,
      allowTouchScrolling: false,
      targetFindTolerance: 12
    });

    fabric.Object.prototype.set({
      cornerSize: 18,
      cornerStyle: 'circle',
      transparentCorners: false,
      cornerColor: '#1a5fff',
      borderColor: '#1a5fff',
      padding: 4,
      borderScaleFactor: 1.5
    });

    initCanvas(PRESETS.ig_post.w, PRESETS.ig_post.h);
    initToolbar();
    initPresets();
    initTools();
    initProperties();
    initLayers();
    initZoom();
    initBg();
    initKeyboard();
    initUpload();
    initToolbarUpload();
    initCustomSize();
    fitCanvas();

    window.addEventListener('resize', fitCanvas);
    window.addEventListener('orientationchange', function(){ setTimeout(fitCanvas, 300); });

    var cwrap = $('.editor-canvas-wrap');
    if (cwrap) {
      cwrap.addEventListener('touchmove', function(e){ e.preventDefault(); }, { passive: false });
    }
    var cv = $('#editorCanvas');
    if (cv) { cv.style.touchAction = 'none'; }

    // save initial state after canvas setup
    setTimeout(saveState, 100);
  }

  function initCanvas(w, h) {
    canvas.setWidth(w);
    canvas.setHeight(h);
    canvas.backgroundColor = bgColor;
    canvas.clear();
    renderAll();
  }

  function renderAll() { canvas.renderAll(); updateLayers(); }

  /* ----- toolbar ----- */
  function initToolbar() {
    $$('.tool-btn[data-action]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var action = btn.dataset.action;
        switch (action) {
          case 'undo': undo(); break;
          case 'redo': redo(); break;
          case 'duplicate': duplicateSelected(); break;
          case 'delete': deleteSelected(); break;
          case 'bring-forward': canvas.bringForward(canvas.getActiveObject()); renderAll(); saveState(); break;
          case 'bring-front': canvas.bringToFront(canvas.getActiveObject()); renderAll(); saveState(); break;
          case 'send-backward': canvas.sendBackwards(canvas.getActiveObject()); renderAll(); saveState(); break;
          case 'send-back': canvas.sendToBack(canvas.getActiveObject()); renderAll(); saveState(); break;
          case 'export': exportPNG(); break;
          case 'save': saveProject(); break;
          case 'clear': clearCanvas(); break;
        }
      });
    });
  }

  /* ----- presets ----- */
  function initPresets() {
    $$('.preset-btn[data-preset]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        $$('.preset-btn[data-preset]').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var p = PRESETS[btn.dataset.preset];
        if (p) {
          if (canvas.getObjects().length > 0) {
            I.openModal('Change Canvas Size', 'This will clear the current canvas. Continue?', function () {
              initCanvas(p.w, p.h); saveState(); fitCanvas();
            });
          } else {
            initCanvas(p.w, p.h); saveState(); fitCanvas();
          }
        }
      });
    });
  }

  /* ----- tools ----- */
  function initTools() {
    $$('.tool-btn[data-tool]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        $$('.tool-btn[data-tool]').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        currentTool = btn.dataset.tool;
        applyToolMode();
      });
    });
  }

  function applyToolMode() {
    canvas.isDrawingMode = false;
    canvas.selection = true;
    switch (currentTool) {
      case 'brush':
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush.color = brushColor;
        canvas.freeDrawingBrush.width = brushWidth;
        break;
      case 'select':
        break;
      case 'text':
        addText(); setCurrentTool('select'); break;
      case 'rect':
        addShape('rect'); setCurrentTool('select'); break;
      case 'circle':
        addShape('circle'); setCurrentTool('select'); break;
      case 'triangle':
        addShape('triangle'); setCurrentTool('select'); break;
      case 'line':
        addLine(); setCurrentTool('select'); break;
      case 'arrow':
        addArrow(); setCurrentTool('select'); break;
    }
  }

  function setCurrentTool(t) {
    currentTool = t;
    $$('.tool-btn[data-tool]').forEach(function (b) { b.classList.toggle('active', b.dataset.tool === t); });
    applyToolMode();
  }

  function addText() {
    var text = new fabric.IText('Double-click to edit', {
      left: canvas.width / 2 - 120, top: canvas.height / 2 - 20,
      fontFamily: 'Cairo', fontSize: 40, fill: '#1a5fff'
    });
    canvas.add(text); canvas.setActiveObject(text); renderAll(); saveState();
  }

  function addShape(type) {
    var obj;
    if (type === 'rect') {
      obj = new fabric.Rect({ left: 200, top: 200, width: 200, height: 140, fill: brushColor, rx: 8, ry: 8 });
    } else if (type === 'circle') {
      obj = new fabric.Circle({ left: 200, top: 200, radius: 80, fill: brushColor });
    } else if (type === 'triangle') {
      obj = new fabric.Triangle({ left: 200, top: 200, width: 160, height: 160, fill: brushColor });
    }
    if (obj) { canvas.add(obj); canvas.setActiveObject(obj); renderAll(); saveState(); }
  }

  function addLine() {
    var line = new fabric.Line([100, 100, 300, 100], { stroke: brushColor, strokeWidth: brushWidth });
    canvas.add(line); canvas.setActiveObject(line); renderAll(); saveState();
  }

  function addArrow() {
    var line = new fabric.Line([100, 100, 280, 100], { stroke: brushColor, strokeWidth: brushWidth });
    var head = new fabric.Triangle({ left: 280, top: 92, width: 18, height: 18, fill: brushColor, angle: 90 });
    var group = new fabric.Group([line, head], { left: 100, top: 100 });
    canvas.add(group); canvas.setActiveObject(group); renderAll(); saveState();
  }

  /* ----- properties ----- */
  function initProperties() {
    var fillEl = $('#propFill'), opEl = $('#propOpacity'), opVal = $('#propOpacityVal'),
      rotEl = $('#propRotation'), rotVal = $('#propRotationVal'),
      fsEl = $('#propFontSize'), fsVal = $('#propFontSizeVal'),
      ffEl = $('#propFontFamily'),
      textEl = $('#propText'), bBtn = $('#propBold'), iBtn = $('#propItalic'),
      uBtn = $('#propUnderline'), alignEl = $('#propAlign');

    fillEl.addEventListener('input', function () {
      var o = canvas.getActiveObject(); if (o) { o.set('fill', fillEl.value); renderAll(); saveState(); }
    });
    opEl.addEventListener('input', function () {
      var o = canvas.getActiveObject(); if (o) { o.set('opacity', +opEl.value / 100); opVal.textContent = opEl.value; renderAll(); }
    });
    rotEl.addEventListener('input', function () {
      var o = canvas.getActiveObject(); if (o) { o.set('angle', +rotEl.value); rotVal.textContent = rotEl.value; renderAll(); }
    });
    fsEl.addEventListener('input', function () {
      var o = canvas.getActiveObject(); if (o && o.type === 'i-text') { o.set('fontSize', +fsEl.value); fsVal.textContent = fsEl.value; renderAll(); }
    });
    textEl.addEventListener('input', function () {
      var o = canvas.getActiveObject(); if (o && o.type === 'i-text') { o.set('text', textEl.value); renderAll(); }
    });
    bBtn.addEventListener('click', function () {
      var o = canvas.getActiveObject(); if (o && o.type === 'i-text') {
        o.set('fontWeight', o.fontWeight === 'bold' ? 'normal' : 'bold');
        bBtn.classList.toggle('active'); renderAll(); saveState();
      }
    });
    iBtn.addEventListener('click', function () {
      var o = canvas.getActiveObject(); if (o && o.type === 'i-text') {
        o.set('fontStyle', o.fontStyle === 'italic' ? 'normal' : 'italic');
        iBtn.classList.toggle('active'); renderAll(); saveState();
      }
    });
    uBtn.addEventListener('click', function () {
      var o = canvas.getActiveObject(); if (o && o.type === 'i-text') {
        o.set('underline', !o.underline); uBtn.classList.toggle('active'); renderAll(); saveState();
      }
    });
    alignEl.addEventListener('change', function () {
      var o = canvas.getActiveObject(); if (o && o.type === 'i-text') { o.set('textAlign', alignEl.value); renderAll(); saveState(); }
    });
    ffEl.addEventListener('change', function () {
      var o = canvas.getActiveObject(); if (o && o.type === 'i-text') { o.set('fontFamily', ffEl.value); renderAll(); saveState(); }
    });

    // brush color + width
    var bcEl = $('#brushColor'), bwEl = $('#brushWidth'), bwVal = $('#brushWidthVal');
    bcEl.addEventListener('input', function () { brushColor = bcEl.value; if (canvas.isDrawingMode) canvas.freeDrawingBrush.color = brushColor; });
    bwEl.addEventListener('input', function () { brushWidth = +bwEl.value; bwVal.textContent = brushWidth; if (canvas.isDrawingMode) canvas.freeDrawingBrush.width = brushWidth; });

    // update properties when selection changes
    canvas.on('selection:created', updateProps);
    canvas.on('selection:updated', updateProps);
    canvas.on('selection:cleared', updateProps);
    canvas.on('object:modified', saveState);
    canvas.on('path:created', saveState);

    function updateProps() {
      var o = canvas.getActiveObject();
      var panel = $('#propsPanel');
      if (!o) { if (panel) panel.style.opacity = '0.5'; return; }
      if (panel) panel.style.opacity = '1';
      fillEl.value = o.fill || '#1a5fff';
      opEl.value = Math.round((o.opacity || 1) * 100); opVal.textContent = opEl.value;
      rotEl.value = Math.round(o.angle || 0); rotVal.textContent = rotEl.value;
      if (o.type === 'i-text') {
        fsEl.value = o.fontSize; fsVal.textContent = o.fontSize;
        ffEl.value = o.fontFamily || 'Cairo';
        textEl.value = o.text;
        bBtn.classList.toggle('active', o.fontWeight === 'bold');
        iBtn.classList.toggle('active', o.fontStyle === 'italic');
        uBtn.classList.toggle('active', o.underline);
        alignEl.value = o.textAlign || 'left';
        $('#textProps').classList.remove('hide');
      } else {
        $('#textProps').classList.add('hide');
      }
    }
  }

  /* ----- layers ----- */
  function initLayers() {
    canvas.on('object:added', updateLayers);
    canvas.on('object:removed', updateLayers);
    canvas.on('object:modified', updateLayers);
  }

  function updateLayers() {
    var list = $('#layerList');
    if (!list) return;
    var objs = canvas.getObjects();
    list.innerHTML = '';
    if (objs.length === 0) {
      list.innerHTML = '<p style="font-size:13px;color:var(--text-faint);text-align:center;padding:16px">No layers yet</p>';
      return;
    }
    objs.slice().reverse().forEach(function (obj, i) {
      var idx = objs.length - 1 - i;
      var item = document.createElement('div');
      item.className = 'layer-item';
      var label = obj.type;
      if (obj.type === 'i-text') label = obj.text ? '"' + obj.text.substring(0, 18) + '"' : 'Text';
      else if (obj.type === 'group') label = 'Group';
      var num = document.createElement('span');
      num.style.cssText = 'font-size:12px;opacity:.6';
      num.textContent = (i + 1);
      var lbl = document.createElement('span');
      lbl.textContent = label;
      var del = document.createElement('button');
      del.className = 'layer-del';
      del.title = 'Delete';
      del.textContent = '×';
      item.appendChild(num);
      item.appendChild(lbl);
      item.appendChild(del);
      item.addEventListener('click', function (e) {
        if (e.target.classList.contains('layer-del')) {
          canvas.remove(obj); renderAll(); saveState();
        } else {
          canvas.setActiveObject(obj); renderAll();
        }
      });
      var active = canvas.getActiveObject();
      if (active === obj) item.classList.add('selected');
      list.appendChild(item);
    });
  }

  /* ----- zoom ----- */
  function initZoom() {
    $('#btnZoomIn').addEventListener('click', function () {
      var z = canvas.getZoom() * 1.2; applyZoom(z);
    });
    $('#btnZoomOut').addEventListener('click', function () {
      var z = canvas.getZoom() / 1.2; applyZoom(Math.max(0.1, z));
    });
    $('#btnZoomFit').addEventListener('click', function () { fitCanvas(); });
  }

  function applyZoom(z) {
    if (!canvas) return;
    var cw = canvas.getWidth() / canvas.getZoom(), ch = canvas.getHeight() / canvas.getZoom();
    canvas.setZoom(z);
    canvas.setDimensions({ width: cw * z, height: ch * z });
    canvas.renderAll();
  }

  function initUpload() {
    var zone = $('#editorUploadZone');
    var btn = $('#btnEditorUpload');
    var input = $('#editorFileInput');
    var wrap = $('.editor-canvas-wrap');
    if (!zone || !btn || !input) return;

    function handleFile(file) {
      if (!file || !file.type.startsWith('image/')) return;
      var url = URL.createObjectURL(file);
      fabric.Image.fromURL(url, function (img) {
        var maxW = canvas.getWidth() * 0.9, maxH = canvas.getHeight() * 0.9;
        var scale = Math.min(maxW / img.width, maxH / img.height, 1);
        img.set({
          left: canvas.getWidth() / 2, top: canvas.getHeight() / 2,
          originX: 'center', originY: 'center',
          scaleX: scale, scaleY: scale
        });
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
        saveState();
        updateLayers();
        hideUploadZone();
        URL.revokeObjectURL(url);
      });
    }

    btn.addEventListener('click', function (e) { e.stopPropagation(); input.click(); });
    zone.addEventListener('click', function (e) {
      if (e.target === btn || e.target.closest('#btnEditorUpload')) return;
      input.click();
    });
    input.addEventListener('change', function () {
      if (input.files && input.files[0]) handleFile(input.files[0]);
      input.value = '';
    });

    zone.addEventListener('dragover', function (e) { e.preventDefault(); zone.style.borderColor = 'var(--primary)'; });
    zone.addEventListener('dragleave', function () { zone.style.borderColor = ''; });
    zone.addEventListener('drop', function (e) {
      e.preventDefault();
      zone.style.borderColor = '';
      if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
    });

    if (wrap) {
      wrap.addEventListener('dragover', function (e) { e.preventDefault(); });
      wrap.addEventListener('drop', function (e) {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
      });
    }
  }

  function initToolbarUpload() {
    var btn = $('#btnToolbarUpload');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var input = $('#editorFileInput');
      if (input) input.click();
    });
  }

  function showUploadZone() {
    var zone = $('#editorUploadZone');
    if (zone) zone.classList.remove('hide');
  }

  function hideUploadZone() {
    var zone = $('#editorUploadZone');
    if (zone) zone.classList.add('hide');
  }

  function initCustomSize() {
    var btn = $('#btnCustomSize');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var wInput = $('#customW'), hInput = $('#customH');
      var w = wInput ? parseInt(wInput.value, 10) : 0;
      var h = hInput ? parseInt(hInput.value, 10) : 0;
      if (!w || !h || w < 50 || h < 50 || w > 8000 || h > 8000) {
        I.toast('Please enter valid dimensions (50-8000px)', 'err');
        return;
      }
      $$('.preset-btn[data-preset]').forEach(function (b) { b.classList.remove('active'); });
      resizeCanvas(w, h);
    });
  }

  function resizeCanvas(w, h) {
    if (canvas.getObjects().length > 0) {
      I.openModal('Change Canvas Size', 'This will clear the current canvas. Continue?', function () {
        initCanvas(w, h); saveState(); fitCanvas(); showUploadZone();
      });
    } else {
      initCanvas(w, h); saveState(); fitCanvas(); showUploadZone();
    }
  }

  function fitCanvas() {
    var wrap = $('.editor-canvas-wrap');
    if (!wrap || !canvas) return;
    var availW = wrap.clientWidth - 32, availH = wrap.clientHeight - 32;
    var cw = canvas.getWidth(), ch = canvas.getHeight();
    if (cw === 0 || ch === 0) return;
    var ratio = Math.min(availW / cw, availH / ch, 1);
    canvas.setZoom(ratio);
    canvas.setDimensions({ width: cw * ratio, height: ch * ratio });
    canvas.renderAll();
  }

  /* ----- background ----- */
  function initBg() {
    var bgEl = $('#bgColor');
    bgEl.addEventListener('input', function () {
      bgColor = bgEl.value;
      canvas.backgroundColor = bgColor;
      renderAll(); saveState();
    });
  }

  /* ----- undo / redo ----- */
  function saveState() {
    if (isRestoring) return;
    var state = JSON.stringify(canvas.toJSON());
    if (undoStack.length > 0 && undoStack[undoStack.length - 1] === state) return;
    undoStack.push(state);
    if (undoStack.length > MAX_UNDO) undoStack.shift();
    redoStack = [];
  }

  function undo() {
    if (undoStack.length < 2) return;
    redoStack.push(undoStack.pop());
    var state = undoStack[undoStack.length - 1];
    isRestoring = true;
    canvas.loadFromJSON(state, function () { renderAll(); isRestoring = false; });
  }

  function redo() {
    if (redoStack.length === 0) return;
    var state = redoStack.pop();
    undoStack.push(state);
    isRestoring = true;
    canvas.loadFromJSON(state, function () { renderAll(); isRestoring = false; });
  }

  /* ----- actions ----- */
  function duplicateSelected() {
    var o = canvas.getActiveObject();
    if (!o) return;
    o.clone(function (cl) {
      cl.set({ left: o.left + 20, top: o.top + 20 });
      canvas.add(cl); canvas.setActiveObject(cl); renderAll(); saveState();
    });
  }

  function deleteSelected() {
    var objs = canvas.getActiveObjects();
    objs.forEach(function (o) { canvas.remove(o); });
    renderAll(); saveState();
  }

  function clearCanvas() {
    I.openModal('Clear Canvas', 'Remove all objects? This cannot be undone.', function () {
      canvas.clear(); canvas.backgroundColor = bgColor; renderAll(); saveState();
      showUploadZone();
    });
  }

  function exportPNG() {
    var dataURL = canvas.toDataURL({ format: 'png', multiplier: 2 });
    var a = document.createElement('a');
    a.download = 'imgsfix_editor.png';
    a.href = dataURL;
    a.click();
    I.toast('Exported!', 'ok');
  }

  function saveProject() {
    try {
      localStorage.setItem('imgsfix_project', JSON.stringify(canvas.toJSON()));
      I.toast('Project saved!', 'ok');
    } catch (e) {
      I.toast('Save failed (storage full?)', 'err');
    }
  }

  function loadProject() {
    var data = localStorage.getItem('imgsfix_project');
    if (!data) { I.toast('No saved project found', 'err'); return; }
    isRestoring = true;
    canvas.loadFromJSON(data, function () { renderAll(); isRestoring = false; saveState(); fitCanvas(); I.toast('Project loaded!', 'ok'); });
  }

  /* ----- keyboard ----- */
  function initKeyboard() {
    document.addEventListener('keydown', function (e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
      var o = canvas.getActiveObject();
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (o && o.type !== 'i-text' || (o && !o.isEditing)) { e.preventDefault(); deleteSelected(); }
      }
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
        if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) { e.preventDefault(); redo(); }
        if (e.key === 'd') { e.preventDefault(); duplicateSelected(); }
        if (e.key === 's') { e.preventDefault(); saveProject(); }
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
