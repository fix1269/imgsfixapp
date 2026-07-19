/* imgsfix — qr-reader.js
   QR/barcode scanner using html5-qrcode (100% client-side, no BarcodeDetector API)
*/
import { Html5Qrcode } from 'html5-qrcode';

(function () {
  var I = window.imgsfix;
  var $ = I.$;

  var html5QrCode = null;
  var scanning = false;

  var cameraBtn, imageBtn, cameraPanel, imagePanel;
  var resultBox, resultValue, resultFormat;
  var deviceSelect, startBtn, stopBtn;
  var scanImageInput, scanImageDrop, scanImagePreview;
  var fallbackMsg;

  function init() {
    if (!$('#qrReader')) return;

    cameraBtn     = $('#modeCamera');
    imageBtn      = $('#modeImage');
    cameraPanel   = $('#cameraPanel');
    imagePanel    = $('#imagePanel');
    resultBox     = $('#resultBox');
    resultValue   = $('#resultValue');
    resultFormat  = $('#resultFormat');
    deviceSelect  = $('#deviceSelect');
    startBtn      = $('#btnStartCam');
    stopBtn       = $('#btnStopCam');
    scanImageInput  = $('#scanImageInput');
    scanImageDrop   = $('#scanImageDrop');
    scanImagePreview = $('#scanImagePreview');
    fallbackMsg   = $('#fallbackMsg');

    // hide the old BarcodeDetector warning — we never need it
    if (fallbackMsg) fallbackMsg.classList.add('hide');

    // initialise html5-qrcode instance (attaches to the video element's parent)
    html5QrCode = new Html5Qrcode('qrReader');

    // enumerate cameras for the device dropdown
    Html5Qrcode.getCameras().then(function (cameras) {
      if (!cameras || cameras.length === 0) return;
      cameras.forEach(function (cam, i) {
        var opt = document.createElement('option');
        opt.value = cam.id;
        opt.textContent = cam.label || ('Camera ' + (i + 1));
        deviceSelect.appendChild(opt);
      });
    }).catch(function () { /* no camera permission yet — that's fine */ });

    /* ── BIG BUTTON: مسح عبر الكاميرا (Camera) ── */
    cameraBtn.addEventListener('click', function () {
      switchMode('camera');
      startCamera();
    });

    /* ── BIG BUTTON: مسح من ملف صورة (Image File) ── */
    imageBtn.addEventListener('click', function () {
      switchMode('image');
      scanImageInput.click();
    });

    // also keep the smaller Start/Stop buttons working
    startBtn.addEventListener('click', startCamera);
    stopBtn.addEventListener('click', stopCamera);

    // drop-zone click opens file picker
    scanImageDrop.addEventListener('click', function () { scanImageInput.click(); });
    scanImageDrop.addEventListener('dragover', function (e) {
      e.preventDefault(); scanImageDrop.classList.add('drag');
    });
    scanImageDrop.addEventListener('dragleave', function () {
      scanImageDrop.classList.remove('drag');
    });
    scanImageDrop.addEventListener('drop', function (e) {
      e.preventDefault(); scanImageDrop.classList.remove('drag');
      if (e.dataTransfer.files[0]) processImageFile(e.dataTransfer.files[0]);
    });

    scanImageInput.addEventListener('change', function (e) {
      if (e.target.files[0]) processImageFile(e.target.files[0]);
    });

    // result actions
    $('#btnCopyResult').addEventListener('click', function () {
      if (!resultValue.textContent) return;
      navigator.clipboard.writeText(resultValue.textContent)
        .then(function () { I.toast('Copied!', 'ok'); });
    });
    $('#btnOpenResult').addEventListener('click', function () {
      var v = resultValue.textContent;
      if (!v) return;
      if (/^https?:\/\//i.test(v)) window.open(v, '_blank');
      else I.toast('Not a URL', 'err');
    });
    $('#btnClearResult').addEventListener('click', function () {
      resultBox.classList.add('hide');
      resultValue.textContent = '';
      scanImagePreview.src = '';
      scanImagePreview.classList.add('hide');
      scanImageInput.value = '';
    });
  }

  function switchMode(mode) {
    if (mode === 'camera') {
      cameraBtn.classList.add('active');
      imageBtn.classList.remove('active');
      cameraPanel.classList.remove('hide');
      imagePanel.classList.add('hide');
    } else {
      imageBtn.classList.add('active');
      cameraBtn.classList.remove('active');
      imagePanel.classList.remove('hide');
      cameraPanel.classList.add('hide');
      stopCamera();
    }
  }

  function startCamera() {
    if (scanning) return;
    var cameraId = deviceSelect.value || { facingMode: 'environment' };
    var config = { fps: 10, qrbox: { width: 250, height: 250 } };

    html5QrCode.start(
      cameraId,
      config,
      function (decodedText, decodedResult) {
        showResult(decodedText, decodedResult.result.format && decodedResult.result.format.formatName);
        stopCamera();
      },
      function () { /* scan frame error — ignore */ }
    ).then(function () {
      scanning = true;
      startBtn.disabled = true;
      stopBtn.disabled = false;
    }).catch(function (err) {
      I.toast('Camera access denied or unavailable', 'err');
      console.error(err);
    });
  }

  function stopCamera() {
    if (!scanning) return;
    html5QrCode.stop().then(function () {
      scanning = false;
      if (startBtn) startBtn.disabled = false;
      if (stopBtn) stopBtn.disabled = true;
    }).catch(function () {});
  }

  function processImageFile(file) {
    if (!file.type.startsWith('image/')) {
      I.toast('Please use an image file', 'err');
      return;
    }
    stopCamera();
    var url = URL.createObjectURL(file);
    scanImagePreview.src = url;
    scanImagePreview.classList.remove('hide');

    html5QrCode.scanFile(file, true).then(function (decodedText) {
      URL.revokeObjectURL(url);
      showResult(decodedText, 'QR / Barcode');
    }).catch(function () {
      URL.revokeObjectURL(url);
      I.toast('No QR or barcode found in image', 'err');
    });
  }

  function showResult(value, format) {
    resultValue.textContent = value;
    if (resultFormat) resultFormat.textContent = format || 'QR';
    resultBox.classList.remove('hide');
    I.toast('Code detected!', 'ok');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
