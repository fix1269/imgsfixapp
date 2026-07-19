/* imgsfix — crop.js
   Interactive image cropping with Cropper.js v2 (web components).
   Aspect ratio controls (Free, 1:1, 16:9), cropped result to canvas.
   Uniform upload icon, click + drag/drop, instant preview.
*/
'use strict';
import Cropper from 'cropperjs';

(function () {
  var I = window.imgsfix;
  var $ = I.$, $$ = I.$$;
  var ICON = window.imgsfixUploadIcon;

  var dropZone = $('#dropZone');
  var fileInput = $('#fileInput');
  var emptyState = $('#emptyState');
  var cropperContainer = $('#cropperContainer');
  var previewWrap = $('#previewWrap');
  var afterCanvas = $('#afterCanvas');
  var resultActions = $('#resultActions');
  var infoBar = $('#infoBar');
  var cropBtn = $('#btnCrop');
  var downloadBtn = $('#btnDownload');
  var resetBtn = $('#btnReset');

  var cropper = null;
  var originalImageSrc = null;
  var currentFileName = 'image';
  var croppedBlob = null;

  /* Inject uniform upload icons */
  if (emptyState) { var es = $('.es-icon', emptyState); if (es) es.innerHTML = ICON; }
  if (dropZone) { var dz = $('.dz-icon', dropZone); if (dz) dz.innerHTML = ICON; }

  function validateFile(file) {
    if (!file || !file.type.startsWith('image/')) {
      I.toast(I.t('tc_supported') + ' only', 'err');
      return false;
    }
    if (file.size > 52428800) { I.toast('File too large (max 50MB)', 'err'); return false; }
    return true;
  }

  function loadFile(file) {
    if (!validateFile(file)) return;
    currentFileName = (file.name || 'image').replace(/\.[^.]+$/, '');

    /* Instant preview using URL.createObjectURL */
    var previewUrl = URL.createObjectURL(file);
    var img = new Image();
    img.onload = function () {
      originalImageSrc = previewUrl;
      emptyState.classList.add('hide');
      previewWrap.classList.add('hide');
      cropperContainer.classList.remove('hide');
      resultActions.classList.remove('hide');
      resultActions.style.display = '';
      if (infoBar) infoBar.textContent = img.width + ' × ' + img.height + 'px';
      startCropper(previewUrl);
    };
    img.src = previewUrl;
  }

  function startCropper(src) {
    if (cropper) { cropper.destroy(); cropper = null; }
    cropperContainer.innerHTML = '';

    var cropImg = document.createElement('img');
    cropImg.src = src;
    cropImg.style.maxWidth = '100%';
    cropperContainer.appendChild(cropImg);

    var template =
      '<cropper-canvas background>' +
        '<cropper-image rotatable scalable translatable></cropper-image>' +
        '<cropper-shade hidden></cropper-shade>' +
        '<cropper-handle action="select" resizable></cropper-handle>' +
        '<cropper-selection initial-coverage="0.8" movable resizable></cropper-selection>' +
      '</cropper-canvas>';

    cropper = new Cropper(cropImg, { container: cropperContainer, template: template });
  }

  $$('[data-ratio]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      $$('[data-ratio]').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      if (!cropper) return;
      var selection = cropper.getCropperSelection();
      if (!selection) return;
      var ratio = btn.dataset.ratio;
      if (ratio === 'free') {
        selection.aspectRatio = 0;
      } else {
        selection.aspectRatio = parseFloat(ratio);
        if (selection.$change) selection.$change();
      }
    });
  });

  cropBtn.addEventListener('click', async function () {
    if (!cropper) { I.toast('Load an image first', 'err'); return; }
    var selection = cropper.getCropperSelection();
    if (!selection) { I.toast('Make a selection first', 'err'); return; }

    try {
      var canvas = await selection.$toCanvas();
      var ctx = afterCanvas.getContext('2d');
      afterCanvas.width = canvas.width;
      afterCanvas.height = canvas.height;
      ctx.drawImage(canvas, 0, 0);

      afterCanvas.toBlob(function (blob) {
        croppedBlob = blob;
      }, 'image/png');

      cropperContainer.classList.add('hide');
      previewWrap.classList.remove('hide');
      I.toast(I.t('tc_done'), 'ok');
    } catch (err) {
      console.error(err);
      I.toast('Crop failed', 'err');
    }
  });

  resetBtn.addEventListener('click', function () {
    if (!originalImageSrc) return;
    previewWrap.classList.add('hide');
    cropperContainer.classList.remove('hide');
    croppedBlob = null;
    startCropper(originalImageSrc);
    I.toast(I.t('tc_reset'), 'ok');
  });

  downloadBtn.addEventListener('click', function () {
    if (!croppedBlob) { I.toast('Crop first', 'err'); return; }
    var url = URL.createObjectURL(croppedBlob);
    var a = document.createElement('a');
    a.download = currentFileName + '_cropped.png';
    a.href = url;
    a.click();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    I.toast(I.t('tc_done'), 'ok');
  });

  [emptyState, dropZone].forEach(function (target) {
    if (!target) return;
    target.addEventListener('click', function () { fileInput.click(); });
    target.addEventListener('dragover', function (e) { e.preventDefault(); target.classList.add('drag'); });
    target.addEventListener('dragleave', function () { target.classList.remove('drag'); });
    target.addEventListener('drop', function (e) {
      e.preventDefault(); target.classList.remove('drag');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) loadFile(e.dataTransfer.files[0]);
    });
  });
  fileInput.addEventListener('change', function (e) {
    if (e.target.files && e.target.files[0]) loadFile(e.target.files[0]);
  });
  document.addEventListener('paste', function (e) {
    if (e.clipboardData && e.clipboardData.files && e.clipboardData.files[0]) loadFile(e.clipboardData.files[0]);
  });
})();
