/* imgsfix — tool-core.js
   Shared workspace: file loading, drag/drop, preview,
   before/after slider, progress, download/reset, paste.
   Each tool page provides opts.onProcess(image, canvas, ctx) to do its work.
*/
'use strict';
(function () {
  var I = window.imgsfix;
  var $ = I.$, $$ = I.$$;

  function initTool(opts) {
    opts = opts || {};
    var stage = $('#toolStage');
    if (!stage) return;
    var dropZone = $('#dropZone');
    var fileInput = $('#fileInput');
    var baWrap = $('#baWrap');
    var beforeCanvas = $('#beforeCanvas');
    var afterCanvas = $('#afterCanvas');
    var progress = $('#progress');
    var progressText = $('#progressText');
    var resultActions = $('#resultActions');
    var emptyState = $('#emptyState');
    var infoBar = $('#infoBar');
    var originalImage = null;
    var currentFileName = 'image.png';

    if (!fileInput || !dropZone) return;

    /* file validation */
    function validateFile(file) {
      if (!file) return false;
      if (!file.type.startsWith('image/')) {
        I.toast(I.t('tc_supported') + ' only', 'err');
        return false;
      }
      if (file.size > 50 * 1024 * 1024) {
        I.toast('File too large (max 50MB)', 'err');
        return false;
      }
      return true;
    }

    function loadFile(file) {
      if (!validateFile(file)) return;
      currentFileName = file.name || 'image.png';
      var reader = new FileReader();
      reader.onload = function (e) {
        var img = new Image();
        img.onload = function () {
          originalImage = img;
          showBeforeAfter(img);
          if (infoBar) infoBar.textContent = img.width + ' × ' + img.height + 'px · ' + formatSize(file.size);
          if (opts.onImage) opts.onImage(img);
          // auto-process if callback exists
          if (opts.autoProcess !== false) process();
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }

    function formatSize(bytes) {
      if (bytes < 1024) return bytes + 'B';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + 'KB';
      return (bytes / 1024 / 1024).toFixed(2) + 'MB';
    }

    function showBeforeAfter(img) {
      if (emptyState) emptyState.classList.add('hide');
      if (baWrap) baWrap.classList.remove('hide');
      if (progress) progress.classList.remove('hide');
      if (resultActions) {
        resultActions.classList.remove('hide');
        resultActions.style.display = '';
      }
      // draw before
      var bc = beforeCanvas, bctx = bc.getContext('2d');
      bc.width = img.width; bc.height = img.height;
      bctx.drawImage(img, 0, 0);
      // after canvas same dims
      var ac = afterCanvas, actx = ac.getContext('2d');
      ac.width = img.width; ac.height = img.height;
      actx.drawImage(img, 0, 0);
      // init slider at 50%
      setSlider(50);
    }

    function process() {
      if (!originalImage) return;
      showProgress(0, I.t('tc_processing'));
      var ac = afterCanvas, actx = ac.getContext('2d');
      actx.clearRect(0, 0, ac.width, ac.height);
      actx.drawImage(originalImage, 0, 0);
      // simulate progress then run callback
      var prog = 0;
      var timer = setInterval(function () {
        prog += 20;
        showProgress(prog, I.t('tc_processing'));
        if (prog >= 100) {
          clearInterval(timer);
          try {
            if (opts.onProcess) opts.onProcess(originalImage, ac, actx);
          } catch (err) {
            console.error(err);
            I.toast('Processing error', 'err');
          }
          showProgress(100, I.t('tc_done'));
          setTimeout(function () { if (progress) progress.classList.add('hide'); }, 800);
          I.toast(I.t('tc_done'), 'ok');
        }
      }, 60);
    }

    function showProgress(pct, label) {
      var bar = $('.progress-bar', progress);
      if (bar) bar.style.width = pct + '%';
      if (progressText) progressText.textContent = label;
    }

    /* before/after slider */
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
      baWrap.addEventListener('pointerdown', function (e) {
        dragging = true; move(e);
      });
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', function () { dragging = false; });
    }

    /* download */
    function download() {
      var ac = afterCanvas;
      if (!ac || !originalImage) return;
      var fmt = opts.format || 'image/png';
      var ext = opts.ext || 'png';
      var link = document.createElement('a');
      link.download = currentFileName.replace(/\.[^.]+$/, '') + '_imgsfix.' + ext;
      link.href = ac.toDataURL(fmt, (opts.quality !== undefined ? opts.quality : 0.92));
      link.click();
      I.toast(I.t('tc_done'), 'ok');
    }

    /* reset */
    function reset() {
      if (!originalImage) return;
      showBeforeAfter(originalImage);
      if (opts.onReset) opts.onReset();
      I.toast(I.t('tc_reset'), 'ok');
    }

    /* clear */
    function clear() {
      originalImage = null;
      if (beforeCanvas) { beforeCanvas.width = 0; beforeCanvas.height = 0; }
      if (afterCanvas) { afterCanvas.width = 0; afterCanvas.height = 0; }
      if (baWrap) baWrap.classList.add('hide');
      if (progress) progress.classList.add('hide');
      if (resultActions) {
        resultActions.classList.add('hide');
        resultActions.style.display = 'none';
      }
      if (emptyState) emptyState.classList.remove('hide');
      if (infoBar) infoBar.textContent = '';
      if (fileInput) fileInput.value = '';
      if (opts.onClear) opts.onClear();
    }

    /* wire up events */
    dropZone.addEventListener('click', function () { fileInput.click(); });
    if (emptyState) {
      emptyState.addEventListener('click', function (e) {
        if (e.target.id === 'btnUpload' || e.target.closest('#btnUpload')) return;
        fileInput.click();
      });
    }
    var btnUpload = $('#btnUpload');
    if (btnUpload) btnUpload.addEventListener('click', function (e) { e.stopPropagation(); fileInput.click(); });
    fileInput.addEventListener('change', function (e) {
      if (e.target.files && e.target.files[0]) loadFile(e.target.files[0]);
    });
    dropZone.addEventListener('dragover', function (e) { e.preventDefault(); dropZone.classList.add('drag'); });
    dropZone.addEventListener('dragleave', function () { dropZone.classList.remove('drag'); });
    dropZone.addEventListener('drop', function (e) {
      e.preventDefault(); dropZone.classList.remove('drag');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) loadFile(e.dataTransfer.files[0]);
    });
    // paste support
    document.addEventListener('paste', function (e) {
      if (e.clipboardData && e.clipboardData.files && e.clipboardData.files[0]) {
        loadFile(e.clipboardData.files[0]);
      }
    });

    var dlBtn = $('#btnDownload'), rsBtn = $('#btnReset'), clBtn = $('#btnClear');
    if (dlBtn) dlBtn.addEventListener('click', download);
    if (rsBtn) rsBtn.addEventListener('click', reset);
    if (clBtn) clBtn.addEventListener('click', clear);

    initSlider();

    return {
      process: process,
      reset: reset,
      clear: clear,
      download: download,
      getOriginal: function () { return originalImage; },
      getAfterCanvas: function () { return afterCanvas; }
    };
  }

  window.initTool = initTool;
})();
