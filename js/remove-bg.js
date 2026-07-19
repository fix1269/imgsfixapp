/* imgsfix — remove-bg.js
   100% client-side background removal using @imgly/background-removal (WASM).
   No external API calls. Shows progress bar during local processing.
   Uniform upload icon, click + drag/drop, instant preview.
*/
'use strict';
import { removeBackground, preload } from '@imgly/background-removal';

(function () {
  var I = window.imgsfix;
  var $ = I.$;
  var ICON = window.imgsfixUploadIcon;

  var emptyState = $('#emptyState');
  var fileInput = $('#fileInput');
  var uploadArea = $('#uploadArea');
  var workArea = $('#workArea');
  var originalPreview = $('#originalPreview');
  var resultPreview = $('#resultPreview');
  var resultPreviewWrap = $('#resultPreviewWrap');
  var loadingArea = $('#loadingArea');
  var progressBar = $('#bgProgressBar');
  var progressLabel = $('#progressLabel');
  var removeBtn = $('#btnRemoveBg');
  var newBtn = $('#btnNewImage');
  var downloadBtn = $('#btnDownload');
  var infoBar = $('#infoBar');

  var currentFile = null;
  var currentFileName = 'image';
  var resultBlob = null;
  var modelPreloaded = false;

  /* Inject uniform upload icon */
  if (emptyState) { var es = $('.es-icon', emptyState); if (es) es.innerHTML = ICON; }

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
    currentFile = file;
    currentFileName = (file.name || 'image').replace(/\.[^.]+$/, '');

    /* Instant preview using URL.createObjectURL */
    originalPreview.src = URL.createObjectURL(file);
    uploadArea.classList.add('hide');
    workArea.classList.remove('hide');
    resultPreviewWrap.style.display = 'none';
    loadingArea.style.display = 'flex';
    loadingArea.querySelector('.spinner').style.display = '';
    progressBar.style.width = '0%';
    progressLabel.textContent = 'Ready — click "Remove Background"';
    downloadBtn.disabled = true;
    if (infoBar) infoBar.textContent = file.name;
  }

  async function doRemoveBg() {
    if (!currentFile) return;
    resultPreviewWrap.style.display = 'none';
    loadingArea.style.display = 'flex';
    progressBar.style.width = '0%';
    progressLabel.textContent = 'Loading AI model…';
    removeBtn.disabled = true;

    try {
      if (!modelPreloaded) {
        progressLabel.textContent = 'Downloading WASM model (one-time, cached after)…';
        await preload({
          progress: function (key, current, total) {
            var pct = total > 0 ? Math.round((current / total) * 100) : 0;
            progressBar.style.width = pct + '%';
            progressLabel.textContent = 'Loading model: ' + pct + '%';
          },
        });
        modelPreloaded = true;
      }

      progressLabel.textContent = 'Processing image locally…';
      progressBar.style.width = '10%';

      resultBlob = await removeBackground(currentFile, {
        output: { format: 'image/png', quality: 0.8 },
        progress: function (key, current, total) {
          var pct = total > 0 ? Math.round((current / total) * 100) : 0;
          progressBar.style.width = pct + '%';
          progressLabel.textContent = 'Processing: ' + key + ' (' + pct + '%)';
        },
      });

      progressBar.style.width = '100%';
      progressLabel.textContent = I.t('tc_done');

      var url = URL.createObjectURL(resultBlob);
      resultPreview.onload = function () {
        loadingArea.style.display = 'none';
        resultPreviewWrap.style.display = 'block';
        URL.revokeObjectURL(url);
      };
      resultPreview.src = url;
      downloadBtn.disabled = false;
      removeBtn.disabled = false;
      I.toast(I.t('tc_done'), 'ok');
    } catch (err) {
      console.error(err);
      progressLabel.textContent = 'Error: ' + (err.message || 'processing failed');
      progressBar.style.width = '0%';
      removeBtn.disabled = false;
      I.toast('Background removal failed', 'err');
    }
  }

  function reset() {
    currentFile = null;
    resultBlob = null;
    uploadArea.classList.remove('hide');
    workArea.classList.add('hide');
    fileInput.value = '';
    if (infoBar) infoBar.textContent = '';
  }

  function download() {
    if (!resultBlob) { I.toast('Process an image first', 'err'); return; }
    var url = URL.createObjectURL(resultBlob);
    var a = document.createElement('a');
    a.download = currentFileName + '_nobg.png';
    a.href = url;
    a.click();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    I.toast(I.t('tc_done'), 'ok');
  }

  emptyState.addEventListener('click', function () { fileInput.click(); });
  emptyState.addEventListener('dragover', function (e) { e.preventDefault(); emptyState.classList.add('drag'); });
  emptyState.addEventListener('dragleave', function () { emptyState.classList.remove('drag'); });
  emptyState.addEventListener('drop', function (e) {
    e.preventDefault(); emptyState.classList.remove('drag');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) loadFile(e.dataTransfer.files[0]);
  });
  fileInput.addEventListener('change', function (e) {
    if (e.target.files && e.target.files[0]) loadFile(e.target.files[0]);
  });

  removeBtn.addEventListener('click', doRemoveBg);
  newBtn.addEventListener('click', reset);
  downloadBtn.addEventListener('click', download);
})();
