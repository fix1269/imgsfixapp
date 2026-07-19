/* imgsfix — compress.js
   Image compression tool powered by browser-image-compression.
   ES module — imports the library, then wires up the workspace DOM.
   Implements the same 3 RULES used by tool-core.js:
     RULE 1  loadFile   — hide emptyState + dropZone, show ba-wrap, draw canvases, slider 50%
     RULE 2  wipeMetadata — revoke any previous compressed blob URL + clear size card before a fresh load
     RULE 3  resetState / clearAll — restore defaults / full hard reset
*/
import imageCompression from 'browser-image-compression';

(function () {
  'use strict';

  /* ----- imgsfix API (provided by main.js) ----- */
  var I = window.imgsfix;
  var $ = I.$, $$ = I.$$, t = I.t, toast = I.toast;

  /* ----- upload SVG (window.imgsfixUploadIcon from main.js, inline fallback) ----- */
  var uploadIcon = window.imgsfixUploadIcon ||
    '<svg class="ic-upload" viewBox="0 0 24 24" width="48" height="48" fill="none" ' +
    'stroke="currentColor" stroke-width="1.8" stroke-linecap="round" ' +
    'stroke-linejoin="round" aria-hidden="true"><path d="M12 16V4"/>' +
    '<path d="M7 9l5-5 5 5"/><path d="M5 20h14"/></svg>';

  /* ----- DOM references ----- */
  var quality = $('#quality');
  var qualityVal = $('#qualityVal');
  var maxWidth = $('#maxWidth');
  var btnApply = $('#btnApply');
  var btnDownload = $('#btnDownload');
  var btnReset = $('#btnReset');
  var btnClear = $('#btnClear');
  var btnUpload = $('#btnUpload');
  var sizeInfo = $('#sizeInfo');
  var sizeBefore = $('#sizeBefore');
  var sizeAfter = $('#sizeAfter');
  var sizeSaved = $('#sizeSaved');
  var emptyState = $('#emptyState');
  var dropZone = $('#dropZone');
  var baWrap = $('#baWrap');
  var beforeCanvas = $('#beforeCanvas');
  var afterCanvas = $('#afterCanvas');
  var fileInput = $('#fileInput');
  var progress = $('#progress');
  var progressText = $('#progressText');
  var resultActions = $('#resultActions');
  var infoBar = $('#infoBar');

  /* ----- inject upload SVG into the empty-state + drop-zone icons ----- */
  var esIcon = $('.es-icon', emptyState);
  var dzIcon = $('.dz-icon', dropZone);
  if (esIcon) esIcon.innerHTML = uploadIcon;
  if (dzIcon) dzIcon.innerHTML = uploadIcon;

  /* ----- state ----- */
  var originalFile = null;
  var originalImage = null;
  var objectURL = null;
  var compressedBlobUrl = null;
  var currentFileName = 'image.png';

  /* ----- helpers ----- */
  function formatSize(bytes) {
    if (bytes < 1024) return bytes + 'B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + 'KB';
    return (bytes / 1024 / 1024).toFixed(2) + 'MB';
  }

  function showProgress(pct, label) {
    var bar = $('.progress-bar', progress);
    if (bar) bar.style.width = pct + '%';
    if (progressText) progressText.textContent = label;
  }

  function setSlider(pct) {
    var clip = $('.ba-clip', baWrap);
    var slider = $('.ba-slider', baWrap);
    if (clip) clip.style.width = pct + '%';
    if (slider) slider.style.left = pct + '%';
  }

  function initSlider() {
    if (!baWrap) return;
    var dragging = false;
    function move(e) {
      if (!dragging) return;
      var rect = baWrap.getBoundingClientRect();
      var x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      var pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSlider(pct);
    }
    baWrap.addEventListener('pointerdown', function (e) { dragging = true; move(e); });
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', function () { dragging = false; });
  }

  function validateFile(file) {
    if (!file) return false;
    if (!file.type.startsWith('image/')) {
      toast(t('tc_supported') + ' only', 'err');
      return false;
    }
    if (file.size > 50 * 1024 * 1024) {
      toast('File too large (max 50MB)', 'err');
      return false;
    }
    return true;
  }

  /* ----- RULE 2: wipe metadata before a fresh load ----- */
  function wipeMetadata() {
    /* hide the size comparison card + clear its text */
    if (sizeInfo) sizeInfo.style.display = 'none';
    if (sizeBefore) sizeBefore.textContent = '—';
    if (sizeAfter) sizeAfter.textContent = '—';
    if (sizeSaved) sizeSaved.textContent = '—';
    /* revoke any previous compressed blob URL */
    if (compressedBlobUrl) {
      try { URL.revokeObjectURL(compressedBlobUrl); } catch (e) { /* noop */ }
      compressedBlobUrl = null;
    }
  }

  /* ----- RULE 1: load file, show before/after ----- */
  function loadFile(file) {
    if (!validateFile(file)) return;
    wipeMetadata();
    /* revoke the previous original object URL before creating a new one */
    if (objectURL) {
      try { URL.revokeObjectURL(objectURL); } catch (e) { /* noop */ }
      objectURL = null;
    }

    originalFile = file;
    currentFileName = file.name || 'image.png';
    objectURL = URL.createObjectURL(file);

    var img = new Image();
    img.onload = function () {
      originalImage = img;
      showBeforeAfter(img);
      if (infoBar) {
        infoBar.textContent =
          img.width + ' × ' + img.height + 'px · ' + formatSize(file.size);
      }
    };
    img.onerror = function () {
      toast('Failed to load image', 'err');
      clearAll();
    };
    img.src = objectURL;
  }

  function showBeforeAfter(img) {
    /* RULE 1: hide emptyState + dropZone, show ba-wrap + result actions */
    if (emptyState) emptyState.classList.add('hide');
    if (dropZone) dropZone.classList.add('hide');
    if (baWrap) baWrap.classList.remove('hide');
    if (progress) progress.classList.add('hide');
    if (resultActions) {
      resultActions.classList.remove('hide');
      resultActions.style.display = '';
    }

    /* before canvas — draw the original, make it visible */
    var bc = beforeCanvas, bctx = bc.getContext('2d');
    bc.width = img.width;
    bc.height = img.height;
    bctx.clearRect(0, 0, bc.width, bc.height);
    bctx.drawImage(img, 0, 0);
    bc.style.display = 'block';

    /* after canvas — same dims, seeded with original (compression overwrites it) */
    var ac = afterCanvas, actx = ac.getContext('2d');
    ac.width = img.width;
    ac.height = img.height;
    actx.clearRect(0, 0, ac.width, ac.height);
    actx.drawImage(img, 0, 0);

    setSlider(50);
  }

  /* ----- RULE 3: reset (restore defaults, redraw after canvas, drop compressed result) ----- */
  function resetState() {
    quality.value = 80;
    if (qualityVal) qualityVal.textContent = 80;
    maxWidth.value = 1920;
    /* redraw the after canvas with the original image */
    if (originalImage) {
      var ac = afterCanvas, actx = ac.getContext('2d');
      ac.width = originalImage.width;
      ac.height = originalImage.height;
      actx.clearRect(0, 0, ac.width, ac.height);
      actx.drawImage(originalImage, 0, 0);
    }
    wipeMetadata();
    toast(t('tc_reset'), 'ok');
  }

  /* ----- RULE 3: clear (HARD RESET — null everything) ----- */
  function clearAll() {
    /* revoke all object URLs */
    if (objectURL) {
      try { URL.revokeObjectURL(objectURL); } catch (e) { /* noop */ }
      objectURL = null;
    }
    if (compressedBlobUrl) {
      try { URL.revokeObjectURL(compressedBlobUrl); } catch (e) { /* noop */ }
      compressedBlobUrl = null;
    }
    originalFile = null;
    originalImage = null;
    currentFileName = 'image.png';

    /* clear canvases, zero dims, hide */
    if (beforeCanvas) {
      var bctx = beforeCanvas.getContext('2d');
      bctx.clearRect(0, 0, beforeCanvas.width, beforeCanvas.height);
      beforeCanvas.width = 0;
      beforeCanvas.height = 0;
      beforeCanvas.style.display = 'none';
    }
    if (afterCanvas) {
      var actx = afterCanvas.getContext('2d');
      actx.clearRect(0, 0, afterCanvas.width, afterCanvas.height);
      afterCanvas.width = 0;
      afterCanvas.height = 0;
    }

    /* hide all workspace elements, reveal empty state */
    if (baWrap) baWrap.classList.add('hide');
    if (progress) progress.classList.add('hide');
    if (resultActions) {
      resultActions.classList.add('hide');
      resultActions.style.display = 'none';
    }
    if (dropZone) dropZone.classList.add('hide');
    if (emptyState) emptyState.classList.remove('hide');
    if (infoBar) infoBar.textContent = '';

    /* hide the size comparison card + clear text */
    if (sizeInfo) sizeInfo.style.display = 'none';
    if (sizeBefore) sizeBefore.textContent = '—';
    if (sizeAfter) sizeAfter.textContent = '—';
    if (sizeSaved) sizeSaved.textContent = '—';

    /* reset controls to defaults */
    quality.value = 80;
    if (qualityVal) qualityVal.textContent = 80;
    maxWidth.value = 1920;

    if (fileInput) fileInput.value = '';
  }

  /* ----- draw a blob/image to the after canvas ----- */
  function drawAfter(url) {
    var tmp = new Image();
    tmp.onload = function () {
      var ac = afterCanvas, actx = ac.getContext('2d');
      ac.width = tmp.width;
      ac.height = tmp.height;
      actx.clearRect(0, 0, ac.width, ac.height);
      actx.drawImage(tmp, 0, 0);
    };
    tmp.src = url;
  }

  /* ===== wire up events ===== */

  /* quality slider live label */
  quality.addEventListener('input', function () {
    qualityVal.textContent = quality.value;
  });

  /* upload entry points */
  if (emptyState) {
    emptyState.addEventListener('click', function () { fileInput.click(); });
    emptyState.addEventListener('dragover', function (e) {
      e.preventDefault(); emptyState.classList.add('drag');
    });
    emptyState.addEventListener('dragleave', function () {
      emptyState.classList.remove('drag');
    });
    emptyState.addEventListener('drop', function (e) {
      e.preventDefault(); emptyState.classList.remove('drag');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) loadFile(e.dataTransfer.files[0]);
    });
  }
  if (dropZone) {
    dropZone.addEventListener('click', function () { fileInput.click(); });
    dropZone.addEventListener('dragover', function (e) {
      e.preventDefault(); dropZone.classList.add('drag');
    });
    dropZone.addEventListener('dragleave', function () {
      dropZone.classList.remove('drag');
    });
    dropZone.addEventListener('drop', function (e) {
      e.preventDefault(); dropZone.classList.remove('drag');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) loadFile(e.dataTransfer.files[0]);
    });
  }
  if (btnUpload) {
    btnUpload.addEventListener('click', function () { fileInput.click(); });
  }

  fileInput.addEventListener('change', function (e) {
    if (e.target.files && e.target.files[0]) loadFile(e.target.files[0]);
  });

  /* paste support */
  document.addEventListener('paste', function (e) {
    if (e.clipboardData && e.clipboardData.files && e.clipboardData.files[0]) {
      loadFile(e.clipboardData.files[0]);
    }
  });

  /* ----- apply compression ----- */
  btnApply.addEventListener('click', async function () {
    if (!originalFile) { toast('Load an image first', 'err'); return; }
    if (progress) progress.classList.remove('hide');
    showProgress(0, t('tc_processing'));

    var qPct = +quality.value;                 /* 10..100 */
    var maxW = +maxWidth.value || 1920;
    var maxSizeMB = Math.max(0.01, 10 * (qPct / 100)); /* higher quality → larger allowed size */

    try {
      var compressed = await imageCompression(originalFile, {
        maxSizeMB: maxSizeMB,
        maxWidthOrHeight: maxW,
        useWebWorker: true,
        libURL: (window.imgsfix.BASE || './') + 'assets/browser-image-compression.js',
        initialQuality: qPct / 100
      });

      /* revoke any previous compressed URL before creating a new one */
      if (compressedBlobUrl) {
        try { URL.revokeObjectURL(compressedBlobUrl); } catch (e) { /* noop */ }
      }
      compressedBlobUrl = URL.createObjectURL(compressed);
      drawAfter(compressedBlobUrl);

      /* size comparison */
      var beforeBytes = originalFile.size;
      var afterBytes = compressed.size;
      var savedBytes = beforeBytes - afterBytes;
      var savedPct = beforeBytes > 0 ? Math.round((savedBytes / beforeBytes) * 100) : 0;
      sizeBefore.textContent = formatSize(beforeBytes);
      sizeAfter.textContent = formatSize(afterBytes);
      sizeSaved.textContent = formatSize(Math.max(0, savedBytes)) + ' (' + savedPct + '%)';
      sizeInfo.style.display = 'block';

      showProgress(100, t('tc_done'));
      setTimeout(function () { if (progress) progress.classList.add('hide'); }, 800);
      toast(t('tc_done'), 'ok');
    } catch (err) {
      console.error(err);
      if (progress) progress.classList.add('hide');
      toast('Compression failed', 'err');
    }
  });

  /* ----- download ----- */
  btnDownload.addEventListener('click', function () {
    if (compressedBlobUrl) {
      var a = document.createElement('a');
      a.href = compressedBlobUrl;
      a.download = currentFileName.replace(/\.[^.]+$/, '') + '_compressed_imgsfix.webp';
      a.click();
      toast(t('tc_done'), 'ok');
    } else if (afterCanvas && originalImage) {
      /* fallback: export the after canvas directly */
      var link = document.createElement('a');
      link.download = currentFileName.replace(/\.[^.]+$/, '') + '_compressed_imgsfix.png';
      link.href = afterCanvas.toDataURL('image/png', 0.92);
      link.click();
      toast(t('tc_done'), 'ok');
    } else {
      toast('Apply compression first', 'err');
    }
  });

  /* ----- reset / clear ----- */
  btnReset.addEventListener('click', resetState);
  btnClear.addEventListener('click', clearAll);

  initSlider();
})();
