/* imgsfix — main.js
   Shared logic: i18n (EN/AR), theme, depth-aware BASE,
   header/footer injection, reveal, FAQ, contact form,
   scroll-to-top, modal, toast, search filter, breadcrumbs.
*/
'use strict';

(function () {

  /* ----- BASE path (derived from this script's URL) -----
     main.js always lives at <base>/js/main.js, so the site base
     is its directory with "js/" stripped. This is correct on a
     root domain, a GitHub Pages project subpath (/imgsfix/),
     and from any subpage depth — unlike a pathname-depth guess.
  */
  var BASE = './';
  var scripts = document.getElementsByTagName('script');
  for (var i = 0; i < scripts.length; i++) {
    var s = scripts[i].src;
    if (s && /\/js\/main\.js([?#]|$)/.test(s)) {
      BASE = s.replace(/js\/main\.js.*$/, '');
      break;
    }
  }
  function link(p) { return BASE + p; }

  /* ----- selectors ----- */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ----- i18n dictionary ----- */
  var I18N = {
    en: {
      // nav
      nav_home: 'Home', nav_tools: 'Tools', nav_editor: 'Editor', nav_qr: 'QR Reader',
      nav_services: 'Services', nav_about: 'About', nav_contact: 'Contact', nav_faq: 'FAQ',
      cta_start: 'Start Editing', cta_browse: 'Browse Tools',
      // theme
      theme_toggle: 'Toggle theme', light: 'Light', dark: 'Dark',
      // hero
      hero_badge: '100% Client-Side · No Uploads · Private',
      hero_title: 'Fix & Transform Your Images Right in the Browser',
      hero_title_g: 'Right in the Browser',
      hero_lead: 'Compress, resize, convert, crop, enhance, and edit images with zero server round-trips. Your files never leave your device — privacy guaranteed.',
      hero_stat1: '8 Image Tools', hero_stat2: 'Zero Uploads', hero_stat3: 'Free Forever', hero_stat4: 'No Sign-Up', hero_stat5: 'EN / AR',
      // services
      services_badge: 'What We Do', services_title: 'Three Pillars of imgsfix',
      svc1_t: 'Image Tools', svc1_d: 'Eight focused utilities — compress, resize, convert, crop, remove background, cartoonize, enhance, and apply filters.',
      svc2_t: 'QR & Barcodes', svc2_d: 'Scan QR codes and barcodes from camera or image files instantly, all processed locally on your device.',
      svc3_t: 'Advanced Editor', svc3_d: 'A full-featured canvas editor with shapes, text, layers, presets, undo/redo, and project saving.',
      // tools
      tools_badge: 'Image Toolkit', tools_title: 'Eight Powerful Image Tools',
      tools_search_ph: 'Search tools…',
      t_compress_t: 'Compress', t_compress_d: 'Shrink image file size while keeping quality.',
      t_resize_t: 'Resize', t_resize_d: 'Change image dimensions to any size.',
      t_convert_t: 'Convert', t_convert_d: 'Switch between JPG, PNG, and WebP.',
      t_crop_t: 'Crop', t_crop_d: 'Trim and frame your image precisely.',
      t_removebg_t: 'Remove BG', t_removebg_d: 'Erase backgrounds with color sampling.',
      t_cartoon_t: 'Cartoonize', t_cartoon_d: 'Turn photos into cartoon-style art.',
      t_enhance_t: 'Enhance', t_enhance_d: 'Adjust brightness, contrast, sharpness.',
      t_filters_t: 'Filters', t_filters_d: 'Apply stylized filters with intensity.',
      open_tool: 'Open Tool',
      no_tools: 'No tools match your search.',
      // workflow
      workflow_badge: 'How It Works', workflow_title: 'Three Simple Steps',
      step1_t: 'Pick a Tool', step1_d: 'Choose from eight image tools, the QR reader, or the advanced editor.',
      step2_t: 'Drop Your File', step2_d: 'Drag & drop or browse — your image stays on your device, never uploaded.',
      step3_t: 'Download Result', step3_d: 'Process instantly and download the result. No waiting, no accounts.',
      // features
      features_badge: 'Why imgsfix', features_title: 'Built for Privacy & Speed',
      f1_t: '100% Private', f1_d: 'Files never leave your browser. No uploads, no servers.',
      f2_t: 'Lightning Fast', f2_d: 'Instant processing with Canvas API. No queues.',
      f3_t: 'Free Forever', f3_d: 'No subscriptions, no hidden costs, no sign-up required.',
      f4_t: 'Bilingual', f4_d: 'Full English and Arabic support with RTL layout.',
      // cta
      cta_title: 'Ready to Fix Your Images?',
      cta_desc: 'Start using imgsfix now — no downloads, no accounts, just open and go.',
      cta_go: 'Launch Tools', cta_editor: 'Open Editor',
      // footer
      footer_about: 'imgsfix is a privacy-focused, 100% client-side image toolkit. Everything happens in your browser — no uploads, no servers, no tracking.',
      footer_company: 'Company', footer_tools_h: 'Tools', footer_resources: 'Resources',
      footer_privacy: 'Privacy Policy', footer_terms: 'Terms of Use', footer_cookies: 'Cookie Policy', footer_disclaimer: 'Disclaimer',
      footer_rights: 'All rights reserved.', footer_made: 'Made with care for privacy.',
      // scroll top
      scroll_top: 'Back to top',
      // modal
      modal_confirm: 'Confirm', modal_cancel: 'Cancel',
      // tool common
      tc_drop: 'Drop your image here or click to browse', tc_browse: 'Browse Files', tc_supported: 'JPG · PNG · WebP · GIF · BMP',
      tc_download: 'Download', tc_reset: 'Reset', tc_clear: 'Clear', tc_processing: 'Processing…', tc_done: 'Done!',
      tc_original: 'Before', tc_result: 'After', tc_size: 'Size', tc_quality: 'Quality',
      // content nav
      page_about: 'About', page_services: 'Services', page_contact: 'Contact', page_faq: 'FAQ',
      page_privacy: 'Privacy Policy', page_terms: 'Terms', page_cookies: 'Cookies', page_disclaimer: 'Disclaimer',
      page_404: 'Page Not Found', go_home: 'Go Home',
      // breadcrumb
      bc_home: 'Home',
      // upload button
      t_upload: 'Upload Image',
      // tool settings
      tc_compress_settings: 'Compress Settings', tc_max_width: 'Max Width (px)', tc_before: 'Before', tc_after: 'After', tc_saved: 'Saved',
      tc_resize_settings: 'Resize Settings', tc_width_px: 'Width (px)', tc_height_px: 'Height (px)', tc_lock_ar: 'Lock aspect ratio', tc_apply: 'Apply',
      tc_convert_settings: 'Convert Settings', tc_format: 'Format',
      tc_crop_settings: 'Crop Settings', tc_free: 'Free',
      tc_removebg_settings: 'Remove BG Settings', tc_tolerance: 'Tolerance', tc_output_bg: 'Output Background', tc_transparent: 'Transparent', tc_white: 'White', tc_custom_color: 'Custom Color',
      tc_removebg_instruction: 'Click on the source image to sample the background color, then press Apply.',
      tc_no_color: 'No color sampled',
      tc_cartoon_settings: 'Cartoon Settings', tc_edge_intensity: 'Edge Intensity', tc_color_levels: 'Color Levels', tc_smoothness: 'Smoothness',
      tc_enhance_settings: 'Enhance Settings', tc_brightness: 'Brightness', tc_contrast: 'Contrast', tc_saturation: 'Saturation', tc_sharpness: 'Sharpness',
      tc_filters_settings: 'Filter Presets', tc_intensity: 'Intensity', tc_no_filter: 'No Filter',
      // QR reader
      qr_camera: 'Camera', qr_image_file: 'Image File', qr_start_cam: 'Start Camera', qr_stop: 'Stop',
      qr_drop: 'Drop an image with a QR/barcode or click to browse', qr_detected: 'Detected: ', qr_copy: 'Copy', qr_open_url: 'Open URL', qr_clear: 'Clear',
      qr_scan_desc: 'Scan QR codes and barcodes from your camera or image files — all locally in your browser.',
      // about page
      about_intro: 'imgsfix is a privacy-focused image toolkit that runs entirely in your browser — no uploads, no servers, no tracking.',
      about_mission: 'Our Mission',
      about_mission_p1: 'imgsfix exists for one simple reason: you should be able to fix, transform, and edit your images without surrendering them to a stranger\'s server. Every day, millions of people upload personal photos, business documents, and sensitive visuals to online tools that quietly copy, store, and sometimes analyze them. We built imgsfix to break that pattern.',
      about_mission_p2: 'Our mission is to provide a complete, professional-grade image toolkit that never sends a single byte of your files anywhere. Everything — compression, resizing, format conversion, cropping, background removal, cartoonization, enhancement, filters, QR scanning, and full canvas editing — happens right inside your browser, on your own device, using processing power you already have.',
      about_mission_p3: 'We believe privacy is not a premium feature or a marketing slogan. It is the baseline. A tool that respects your data should not need to promise it won\'t misuse it — it should simply never collect it in the first place. That is the standard imgsfix is built to.',
      about_how: 'How It Works', about_team: 'Our Team Philosophy', about_tech: 'Technology We Use',
      about_free: 'Our Commitment to Free Access', about_values: 'Our Privacy Values',
      // services page
      services_intro: 'Three pillars of free, privacy-focused image processing — all running 100% in your browser.',
      services_p1: 'imgsfix is organized around three complementary pillars. Together they cover the full range of everyday image tasks — from a quick resize to a multi-layer design — without ever requiring you to upload a file or create an account. Below is a detailed look at each pillar and the tools within it.',
      svc_tools_title: '🔧 Image Tools', svc_qr_title: '📷 QR & Barcode Reader', svc_editor_title: '🎨 Advanced Editor',
      svc_editor_key: 'Key Capabilities', svc_tie_title: 'What Ties Them Together',
      // faq page
      faq_intro: 'Frequently asked questions about imgsfix — how it works, privacy, supported formats, and more.',
      faq_a1: 'imgsfix is a free, privacy-focused image toolkit that runs entirely in your web browser. It offers eight image tools (compress, resize, convert, crop, remove background, cartoonize, enhance, and filters), a QR & barcode reader, and a full-featured advanced editor. Every operation is performed locally on your device using HTML5 Canvas and JavaScript — no file is ever uploaded to a server.',
      faq_not_found: 'Did not find what you were looking for?', faq_contact: 'Contact Us', faq_view_services: 'View Services',
      // privacy page
      privacy_intro: 'Your privacy is not a feature — it is the foundation. This policy explains exactly what imgsfix does and does not do with your data.',
      privacy_last_updated: 'Last updated: July 2026',
      // terms page
      terms_intro: 'The terms and conditions that govern your use of imgsfix. Please read them carefully.',
      page_terms_full: 'Terms of Use',
      // cookies page
      page_cookies_full: 'Cookie Policy', cookies_intro: 'The good news: imgsfix does not use tracking cookies. Here is exactly what we do and do not store on your device.',
      // disclaimer page
      disclaimer_intro: 'Important information about the nature of imgsfix and the limits of what it provides.',
      disclaimer_last_updated: 'Last updated: July 2026',
      // 404 page
      err404_title: 'Oops! This Page Got Lost',
      err404_desc: 'The page you are looking for might have been moved, renamed, or never existed. But do not worry — your images are safe, and our tools are just a click away.',
      // contact page
      contact_intro: 'Have feedback, a feature request, or a question? We would love to hear from you.',
      contact_desc: 'Whether you found a bug, have an idea for a new tool, or just want to say hello, this is the place. Fill out the form below and we will get back to you as soon as we can.',
      contact_name: 'Name', contact_name_ph: 'Your name',
      contact_email: 'Email', contact_email_ph: 'you@example.com',
      contact_subject: 'Subject', contact_subject_ph: 'What is this about?',
      contact_message: 'Message', contact_message_ph: 'Tell us what is on your mind…',
      contact_send: 'Send Message',
      contact_before_title: 'Before You Write…', contact_before_desc: 'You might find a quick answer in one of these pages. We have put together detailed content covering the most common questions:',
      contact_link_faq: 'Answers to questions about how imgsfix works, privacy, supported formats, browsers, offline use, and more.',
      contact_link_about: 'Our mission, how the tools work, our team philosophy, and the technology behind imgsfix.',
      contact_link_services: 'A full overview of the three pillars: image tools, QR reader, and the advanced editor.',
      contact_link_privacy: 'Detailed explanation of our zero-data-collection approach.',
      contact_link_terms: 'The terms governing your use of imgsfix.',
      contact_include_title: 'What to Include', contact_include_desc: 'To help us respond quickly and usefully, please include as much of the following as relevant:',
      contact_include_1: 'The name of the tool or page where you encountered an issue.',
      contact_include_2: 'Your browser and operating system (e.g., Chrome 120 on Windows, Safari on iPhone).',
      contact_include_3: 'The image format and approximate file size, if your question involves a specific file.',
      contact_include_4: 'Steps to reproduce any bug you are reporting.',
      contact_include_5: 'A description of what you expected to happen versus what actually happened.',
      contact_include_6: 'Feature requests are always welcome. If there is an image tool you wish imgsfix had, tell us about it — we prioritize additions that serve the most users while staying true to our privacy-first, client-side architecture.',
      // editor page
      editor_desc: 'A full-featured canvas editor with shapes, text, layers, presets, and undo/redo — all in your browser.',
      ed_undo: '↶ Undo', ed_redo: '↷ Redo', ed_duplicate: '⎘ Duplicate', ed_delete: '✕ Delete',
      ed_front: '⬆ Front', ed_forward: '↑ Forward', ed_backward: '↓ Backward', ed_back: '⬇ Back',
      ed_export: '📥 Export', ed_save: '💾 Save', ed_clear: '🗑 Clear',
      ed_presets: 'Presets', ed_width: 'Width', ed_height: 'Height', ed_custom_size: 'Custom Size',
      ed_tools: 'Tools', ed_select: '✋ Select', ed_brush: '🖌 Brush', ed_text: 'T Text',
      ed_rect: '▭ Rect', ed_circle: '● Circle', ed_triangle: '▲ Triangle', ed_line: '— Line', ed_arrow: '→ Arrow',
      ed_brush_settings: 'Brush', ed_color: 'Color',
      ed_properties: 'Properties', ed_fill: 'Fill',
      ed_text_label: 'Text', ed_align_left: 'Left', ed_align_center: 'Center', ed_align_right: 'Right',
      ed_zoom: 'Zoom', ed_fit: 'Fit', ed_background: 'Background', ed_layers: 'Layers', ed_no_layers: 'No layers yet',
      ed_shortcuts: 'Shortcuts', ed_sc_del: 'Delete object', ed_sc_undo: 'Undo', ed_sc_redo: 'Redo', ed_sc_dup: 'Duplicate', ed_sc_save: 'Save project',
      ed_drop: 'Drop an image here or click to browse',
      // tool labels with dynamic values
      tc_jpeg: 'JPEG', tc_png: 'PNG', tc_webp: 'WebP',
      ed_width_label: 'Width:', ed_opacity_label: 'Opacity:', ed_rotation_label: 'Rotation:', ed_font_size_label: 'Font Size:',
      ed_zoom_out: '\u2212', ed_zoom_in: '+',
      // about page detailed
      about_how_p1: 'When you open a tool on imgsfix and select an image, that file is read directly into your browser\'s memory using the File API. It is then drawn onto an HTML5 <code>&lt;canvas&gt;</code> element, where JavaScript manipulates the pixels in real time. When you are happy with the result, the canvas is exported back into a downloadable image file \u2014 again, entirely on your device.',
      about_how_p2: 'At no point in this process does your image travel over the internet. There is no upload step, no temporary server storage, no background processing queue, and no log of what you edited. If you close the tab, the image is gone from memory. The only copy that ever exists is the one you downloaded.',
      about_how_p3: 'This architecture is sometimes called "client-side" or "zero-knowledge" processing. It means we literally cannot see your files \u2014 not because we choose not to look, but because they are never sent to us in the first place.',
      about_team_p1: 'imgsfix is built by developers who were tired of the trade-off between convenience and privacy. We saw powerful online image editors that demanded account creation, tracked usage patterns, and stored user files indefinitely \u2014 and we asked a simple question: why? Modern browsers are more than capable of handling image processing locally. The server round-trip is unnecessary, and so is the privacy cost that comes with it.',
      about_team_p2: 'Our philosophy can be summed up in three principles:',
      about_team_l1: 'Privacy by architecture, not by promise. We don\'t rely on policies to protect your data \u2014 we rely on the fact that we never receive it.',
      about_team_l2: 'Free access for everyone. Useful tools should not be locked behind paywalls, trials, or sign-up walls. imgsfix is free to use, today and always.',
      about_team_l3: 'Open and transparent. The logic that processes your images runs in your browser where you can inspect it. No black boxes, no hidden behavior.',
      about_tech_p1: 'imgsfix is deliberately built on web standards rather than heavy frameworks. This keeps the site fast, lightweight, and easy to audit. The core technologies include:',
      about_tech_l1: 'HTML5 Canvas API \u2014 the foundation for all image manipulation. Every tool draws your image onto a canvas and reads or modifies the pixel data directly.',
      about_tech_l2: 'Vanilla JavaScript \u2014 no build step, no transpiler, no framework runtime. The code that runs is the code you can read.',
      about_tech_l3: 'File API & FileReader \u2014 lets your browser read selected or dropped files into memory without uploading them.',
      about_tech_l4: 'BarcodeDetector API \u2014 a native browser API used by the QR & barcode reader for fast, local scanning.',
      about_tech_l5: 'Fabric.js \u2014 a lightweight canvas library powering the advanced editor\'s shapes, text, layers, and object manipulation.',
      about_tech_l6: 'localStorage \u2014 used only to remember your theme (light/dark) and language (English/Arabic) preferences. No other data is stored.',
      about_tech_p2: 'We deliberately avoid analytics scripts, advertising trackers, and third-party processing services. The only external resource loaded is the Cairo font from Google Fonts, which is used for typography.',
      about_free_p1: 'imgsfix is free to use for everyone \u2014 individuals, students, freelancers, small businesses, and enterprises alike. There are no subscriptions, no premium tiers, no usage limits, and no watermarks added to your output. You do not need to create an account, provide an email address, or identify yourself in any way.',
      about_free_p2: 'We intend to keep it this way. The tools you see today will remain free, and new tools we add in the future will be free as well. We believe that privacy-respecting software should be accessible to everyone, not just those who can afford to pay for it.',
      about_free_p3: 'If you find imgsfix useful, the best way to support us is simply to share it with others who care about their privacy. Word of mouth is how a tool like this grows \u2014 no ad campaigns, no tracking pixels, just people telling people.',
      about_values_p1: 'Privacy is not a feature we added \u2014 it is the reason imgsfix exists. These are the values that guide every decision we make:',
      about_values_l1: 'No data collection. We do not collect, store, or transmit your images, your editing choices, or your personal information. There is no database of user activity because there is no server receiving it.',
      about_values_l2: 'No tracking. We do not use analytics, advertising pixels, fingerprinting scripts, or any technology that follows you across the web.',
      about_values_l3: 'No cookies. We do not set tracking cookies. The only local storage we use is for your theme and language preferences, which live on your device and never leave it.',
      about_values_l4: 'No accounts. You never need to sign up or log in. Your identity is your own business, and your images are your own property.',
      about_values_l5: 'Offline-friendly. Because processing happens locally, many tools continue to work even if your connection drops mid-session.',
      about_values_l6: 'Your data, your control. You can clear your preferences at any time from your browser. There is nothing to "delete from our servers" because we never had it.',
      about_values_p2: 'We invite you to read our full Privacy Policy and Cookie Policy for the complete picture. If you have questions, our FAQ covers the most common ones, and you can always reach out directly.',
      // services detailed
      svc_tools_p1: 'Our flagship pillar is a collection of eight focused, single-purpose utilities. Each tool does one thing exceptionally well, with a clean interface and real-time preview. Pick the tool that matches your task, drop in your image, adjust the settings, and download the result. No learning curve, no clutter, no uploads.',
      svc_tools_l1: 'Compress \u2014 Reduce the file size of JPG, PNG, and WebP images while keeping visual quality. Adjustable quality slider with a live before/after comparison so you can find the sweet spot between size and clarity.',
      svc_tools_l2: 'Resize \u2014 Change image dimensions to any width and height. Maintain aspect ratio with a single toggle, or set exact pixel dimensions for specific requirements like social media posts or email headers.',
      svc_tools_l3: 'Convert \u2014 Switch between JPG, PNG, and WebP formats instantly. Useful when a platform requires a specific format or when you need a transparent PNG from a JPG source.',
      svc_tools_l4: 'Crop \u2014 Trim and frame your image precisely with an interactive crop region. Drag to define the area, lock to common aspect ratios, and export only the part you need.',
      svc_tools_l5: 'Remove Background \u2014 Erase image backgrounds using color sampling. Click on the background color to remove it, adjust the tolerance for edge precision, and get a clean cutout without manual masking.',
      svc_tools_l6: 'Cartoonize \u2014 Turn photos into cartoon-style artwork. The tool applies edge detection and color quantization locally to produce a stylized, illustrated look from any photograph.',
      svc_tools_l7: 'Enhance \u2014 Adjust brightness, contrast, and sharpness with intuitive sliders. Rescue underexposed shots, punch up flat images, and bring out detail \u2014 all processed in real time on your device.',
      svc_tools_l8: 'Filters \u2014 Apply stylized filters with adjustable intensity. Choose from grayscale, sepia, vintage, cool, warm, and more, then fine-tune how strongly the effect is applied before downloading.',
      svc_tools_p2: 'Every tool above shares the same foundation: your image is loaded into browser memory, processed on an HTML5 canvas, and exported locally. The file never leaves your device at any point in the workflow.',
      svc_qr_p1: 'The second pillar is a fast, fully local QR code and barcode scanner. It supports two modes: live camera scanning and image file scanning. In camera mode, it uses your device\'s camera and the native BarcodeDetector API to detect codes in real time \u2014 point your camera at a QR code and the content appears instantly. In image mode, you can load any image file containing a QR or barcode and the reader will extract the encoded data.',
      svc_qr_p2: 'Supported formats include QR codes, EAN-13, EAN-8, UPC-A, UPC-E, Code 128, Code 39, and other common barcode symbologies, depending on your browser\'s capabilities. Detected results can be copied to the clipboard or, if the content is a URL, opened directly in a new tab.',
      svc_qr_p3: 'Just like the image tools, the QR reader processes everything on your device. Camera frames are analyzed locally and never streamed to a server. Image files you scan stay in your browser.',
      svc_qr_open: 'Open QR Reader',
      svc_editor_p1: 'The third pillar is a full-featured canvas editor for when a single-pass tool is not enough. Built on Fabric.js, it provides a professional editing environment with the features you would expect from desktop software \u2014 all running in your browser with zero uploads.',
      svc_editor_l1: 'Drawing tools \u2014 Select, freehand brush, text, rectangle, circle, triangle, line, and arrow.',
      svc_editor_l2: 'Object manipulation \u2014 Move, resize, rotate, duplicate, and delete any object on the canvas.',
      svc_editor_l3: 'Layer management \u2014 Bring forward, send backward, bring to front, and send to back for precise stacking order.',
      svc_editor_l4: 'Text controls \u2014 Editable text objects with font size, bold, italic, underline, and alignment options.',
      svc_editor_l5: 'Property panel \u2014 Adjust fill color, opacity, and rotation for any selected object.',
      svc_editor_l6: 'Preset canvas sizes \u2014 Start from Instagram post (1080\u00d71080), Instagram story (1080\u00d71920), YouTube thumbnail (1280\u00d7720), Facebook post (1200\u00d7630), or a custom size.',
      svc_editor_l7: 'Undo & redo \u2014 Full history navigation with keyboard shortcuts (Ctrl+Z / Ctrl+Y).',
      svc_editor_l8: 'Project saving \u2014 Save your work as a project file and load it later to continue editing.',
      svc_editor_l9: 'PNG export \u2014 Download your finished composition as a high-quality PNG.',
      svc_editor_p2: 'The editor is ideal for creating social media graphics, thumbnails, simple designs, annotations, and collages \u2014 all without installing software or surrendering your content to a cloud service.',
      svc_editor_open: 'Open Advanced Editor',
      svc_tie_p1: 'All three pillars share the same commitments: no uploads, no servers, no accounts, no tracking, and no cost. Whether you are compressing a single photo, scanning a QR code at a conference, or designing a multi-layer graphic, your data stays on your device from start to finish.',
      svc_tie_p2: 'Ready to get started? Browse the image tools, try the QR reader, or launch the advanced editor. If you have questions, our FAQ has answers, and you are always welcome to contact us.',
      // faq detailed
      faq_q1: 'What is imgsfix?', faq_q2: 'Is imgsfix really free?', faq_q3: 'Do you upload my images to a server?', faq_q4: 'What image formats are supported?', faq_q5: 'Does imgsfix work offline?', faq_q6: 'What browsers are supported?', faq_q7: 'How does the advanced editor work?', faq_q8: 'Is my data safe with imgsfix?', faq_q9: 'Can I use imgsfix for commercial purposes?', faq_q10: 'What languages are supported?',
      faq_a2: 'Yes, completely. There are no subscriptions, no premium tiers, no trial periods, no usage limits, and no watermarks on your output. You do not need to create an account or provide any personal information. imgsfix is free for everyone \u2014 individuals, students, freelancers, and businesses \u2014 and we intend to keep it that way.',
      faq_a3: 'No. imgsfix has no server backend for processing images. When you select or drop a file, it is loaded directly into your browser\'s memory using the File API and processed on an HTML5 canvas element. The pixels are manipulated by JavaScript running on your device. When you download the result, the file is generated locally from the canvas. Your image never travels over the internet at any point.',
      faq_a4: 'imgsfix works with the most common web image formats: JPG (JPEG), PNG, and WebP. The convert tool lets you switch between these three formats. Most tools also accept GIF and BMP as input. The advanced editor exports to PNG. Support for a specific format depends on your browser\'s built-in image decoding capabilities, but all modern browsers handle JPG, PNG, and WebP natively.',
      faq_a5: 'Once the page is loaded, most tools continue to work even if your internet connection drops, because all processing happens locally. The image tools, enhance, and filters do not need a network connection after initial load. The QR reader\'s camera mode and the advanced editor also work offline. The only external resource is the Google Fonts stylesheet, which is loaded once for typography \u2014 if it is unavailable, the site falls back to system fonts.',
      faq_a6: 'imgsfix works in all modern browsers that support the HTML5 Canvas API and modern JavaScript. This includes the latest versions of Chrome, Edge, Firefox, Safari, and Brave on desktop, as well as Chrome and Safari on mobile. The QR reader\'s camera scanning uses the native BarcodeDetector API, which is currently available in Chrome and Edge on desktop and Chrome on Android. On browsers without the BarcodeDetector API, you can still scan QR codes from image files.',
      faq_a7: 'The advanced editor is built on Fabric.js, a lightweight JavaScript canvas library. It provides a full editing environment with drawing tools (select, brush, text, rectangle, circle, triangle, line, arrow), object manipulation (move, resize, rotate, duplicate, delete), layer ordering, a property panel for fill and opacity, preset canvas sizes for social media, undo/redo with keyboard shortcuts, and the ability to save and load projects. Everything renders on a canvas in your browser \u2014 no server interaction is involved at any point.',
      faq_a8: 'Yes. Because all processing happens in your browser and no data is transmitted to any server, your images and edits are never stored anywhere outside your device. We do not use analytics, advertising trackers, or third-party data collection. The only thing stored locally is your theme and language preference in your browser\'s localStorage. You can clear this at any time from your browser settings. For the full details, see our Privacy Policy and Cookie Policy.',
      faq_a9: 'Yes. imgsfix is free to use for both personal and commercial projects. There are no licensing restrictions on the images you produce \u2014 the output is yours. You can use compressed, resized, converted, cropped, or edited images in your business materials, websites, social media, client work, or any other context. We do not add watermarks or claim any rights to your content. Please review our Terms of Use for the complete usage terms.',
      faq_a10: 'imgsfix currently supports two languages: English and Arabic. You can switch between them at any time using the language toggle in the header. When Arabic is selected, the entire interface switches to a right-to-left (RTL) layout for a natural reading experience. Your language preference is saved in your browser\'s localStorage so it persists across visits.',
      // privacy detailed
      privacy_short_label: 'The short version:', privacy_short_text: 'imgsfix does not collect, store, or transmit your data. There are no servers processing your images, no analytics tracking your behavior, no advertising cookies following you, and no accounts required. Everything happens in your browser. This is not a promise \u2014 it is a consequence of how the site is built.',
      privacy_h2_1: '1. Overview', privacy_p1_1: 'imgsfix is a privacy-first, client-side image toolkit. "Client-side" means that all processing \u2014 compression, resizing, conversion, cropping, background removal, cartoonization, enhancement, filters, QR scanning, and editing \u2014 takes place entirely within your web browser on your own device. No component of your image, your filename, or your editing activity is ever sent to us or to any third party.',
      privacy_p1_2: 'This privacy policy describes in detail how imgsfix handles (or, more precisely, does not handle) your information. Because the service is designed around the principle of data minimization, most of this document explains what we do not do.',
      privacy_h2_2: '2. No Data Collection', privacy_p2_1: 'We do not collect any personal data. Specifically, we do not collect:',
      privacy_p2_l1: 'Your name, email address, or any other identifying information (no accounts are required).', privacy_p2_l2: 'Your IP address or geographic location.', privacy_p2_l3: 'The images you process \u2014 they never leave your browser.', privacy_p2_l4: 'The filenames of your images.', privacy_p2_l5: 'Your editing choices, tool usage, or browsing behavior on the site.', privacy_p2_l6: 'Device information, browser version, or screen resolution.',
      privacy_p2_2: 'Because there is no server backend that receives or stores user data, there is no database that could be breached, sold, or subpoenaed. We cannot share what we do not have.',
      privacy_h2_3: '3. No Cookies', privacy_p3_1: 'imgsfix does not use tracking cookies. We do not set first-party cookies for analytics, advertising, session management, or any other purpose. We do not use third-party cookies.',
      privacy_p3_2: 'The only storage we use is the browser\'s localStorage API, which is not a cookie and is described in detail in section 5 below. For complete information, please see our separate Cookie Policy.',
      privacy_h2_4: '4. No Servers & Client-Side Processing', privacy_p4_1: 'imgsfix has no application server that receives or processes your files. When you use any tool, the following happens:',
      privacy_p4_l1: 'You select or drop a file, which your browser reads into local memory using the File API.', privacy_p4_l2: 'The image is drawn onto an HTML5 canvas element.', privacy_p4_l3: 'JavaScript running on your device manipulates the pixel data.', privacy_p4_l4: 'The result is exported from the canvas to a downloadable file, generated entirely in your browser.',
      privacy_p4_2: 'At no point is the file transmitted over the network. If you close the browser tab, the in-memory image is discarded. The only copy that persists is the one you choose to download and save on your own device.',
      privacy_h2_5: '5. localStorage Usage', privacy_p5_1: 'imgsfix uses the browser\'s localStorage API to remember two small preferences:',
      privacy_p5_l1: 'Theme preference (imgsfix_theme) \u2014 stores whether you prefer light or dark mode.', privacy_p5_l2: 'Language preference (imgsfix_lang) \u2014 stores whether you have selected English or Arabic.',
      privacy_p5_2: 'These values are stored on your device only. They are never transmitted to us or to any third party. They contain no personal information \u2014 just a short string indicating your preference. You can clear them at any time by clearing your browser\'s site data or localStorage. See our Cookie Policy for instructions on how to do this.',
      privacy_h2_6: '6. No Analytics & No Third-Party Tracking', privacy_p6_1: 'imgsfix does not use any analytics service. We do not embed Google Analytics, Matomo, Mixpanel, Amplitude, or any other measurement tool. We do not know how many people visit the site, which tools they use, or how long they stay.',
      privacy_p6_2: 'We also do not use advertising networks, marketing pixels, social media embeds, or any third-party script that could track your behavior. There are no "share" buttons that leak data to social platforms, and no comment systems that profile visitors.',
      privacy_p6_3: 'The only external resource the site loads is the Cairo font stylesheet from Google Fonts (see section 7).',
      privacy_h2_7: '7. Third-Party Services', privacy_p7_1: 'The only third-party service imgsfix interacts with is Google Fonts. The site loads the Cairo typeface from fonts.googleapis.com and fonts.gstatic.com to provide consistent typography. Google\'s servers may receive a request for the font file and may log standard HTTP information (such as IP address) as part of that request, in accordance with Google\'s own privacy policy.',
      privacy_p7_2: 'If you prefer not to load any external resources, your browser can be configured to block third-party font requests. imgsfix will fall back to your system\'s default fonts and continue to function normally. No functionality is lost \u2014 only the typography changes.',
      privacy_p7_3: 'Aside from Google Fonts, imgsfix loads the Fabric.js library from a CDN (cdnjs) for the advanced editor. This is a static JavaScript file and does not involve any tracking.',
      privacy_h2_8: '8. Your Rights', privacy_p8_1: 'Because imgsfix does not collect or store any personal data, traditional data-subject rights (such as access, correction, deletion, or portability of your data) are effectively already fulfilled \u2014 there is no data about you for us to provide, correct, or delete. However, you retain full control over the following:',
      privacy_p8_l1: 'Local preferences: You can clear your theme and language preferences at any time through your browser settings.', privacy_p8_l2: 'Your images: You decide which images to process and whether to download the results. Nothing is retained by the site.', privacy_p8_l3: 'External resources: You can block Google Fonts or other external resources using browser extensions or content blockers without affecting core functionality.', privacy_p8_l4: 'Use of the service: You may stop using imgsfix at any time. Because no account or data exists, there is nothing to cancel or delete.',
      privacy_h2_9: '9. Children\'s Privacy', privacy_p9_1: 'imgsfix is suitable for users of all ages. Because we collect no personal information and require no account, the service is safe for children to use under adult supervision. We do not knowingly collect any information from children or any other user, and there is no mechanism by which a child could disclose personal data to us through the site.',
      privacy_h2_10: '10. Changes to This Policy', privacy_p10_1: 'If we make material changes to this privacy policy, we will update the "last updated" date at the top of this page. Because the core architecture of imgsfix \u2014 client-side processing with no data collection \u2014 is fundamental to the project, we do not anticipate changes that would alter this approach. Any future changes would be transparently documented here.',
      privacy_h2_11: '11. Contact Information', privacy_p11_1: 'If you have any questions about this privacy policy or imgsfix\'s data practices, please visit our contact page. You can also find quick answers to common privacy questions in our FAQ, and more details about local storage in our Cookie Policy.',
      // terms detailed
      terms_last_updated: 'Last updated: July 2026', terms_welcome: 'Welcome to imgsfix. By accessing or using this website and its tools, you agree to be bound by these Terms of Use. If you do not agree with any part of these terms, please do not use the service. These terms are designed to be clear and fair \u2014 imgsfix is a free, privacy-focused tool, and these terms reflect that simplicity.',
      terms_h2_1: '1. Acceptance of Terms', terms_p1_1: 'By using imgsfix \u2014 including any of the image tools, the QR & barcode reader, or the advanced editor \u2014 you acknowledge that you have read, understood, and agree to these Terms of Use and our Privacy Policy. These terms constitute a legally binding agreement between you and imgsfix. If you are using the service on behalf of an organization, you represent that you have the authority to bind that organization to these terms.',
      terms_p1_2: 'If you do not agree to these terms, you must discontinue use of the service immediately. Because imgsfix requires no account or registration, your use of the tools itself constitutes acceptance.',
      terms_h2_2: '2. Use of the Service', terms_p2_1: 'imgsfix grants you a free, non-exclusive, non-transferable license to use the website and its tools for both personal and commercial purposes. You may use the service to process, edit, and transform images that you own or have the right to use.',
      terms_h3_permitted: 'Permitted Use', terms_permitted_l1: 'Processing images for personal, educational, or commercial projects.', terms_permitted_l2: 'Using the QR reader to scan codes you have the right to access.', terms_permitted_l3: 'Using the advanced editor to create original designs and compositions.', terms_permitted_l4: 'Downloading and using the output files in any context, royalty-free.',
      terms_h3_prohibited: 'Prohibited Use', terms_prohibited_l1: 'Using imgsfix to process images that you do not have the right to use, including copyrighted material you do not own or have permission to use.', terms_prohibited_l2: 'Using the service for any unlawful purpose or in violation of applicable laws.', terms_prohibited_l3: 'Attempting to reverse-engineer, decompile, or otherwise exploit the service for malicious purposes.', terms_prohibited_l4: 'Using automated scripts or bots to access the service in a manner that disrupts its availability for others.', terms_prohibited_l5: 'Using the output of the tools in a way that infringes the rights of third parties.',
      terms_p2_2: 'You are solely responsible for the images you process and the content you create using imgsfix. We do not monitor or review user activity \u2014 because we cannot, as no data reaches us \u2014 but you remain accountable for your own use of the service.',
      terms_h2_3: '3. Intellectual Property', terms_p3_1: 'The imgsfix website, including its design, code, tools, and branding, is the intellectual property of its creators. The software is provided for your use free of charge, but this does not constitute a transfer of ownership. You may not claim the imgsfix brand, logo, or site design as your own.',
      terms_p3_2: 'The images and files you process using imgsfix remain your property. We claim no ownership, license, or rights to any content you create, edit, or download through the service. The output of every tool \u2014 compressed images, resized photos, converted files, cropped pictures, edited designs \u2014 belongs entirely to you. We do not add watermarks, embed metadata claiming authorship, or retain any copy of your work.',
      terms_h2_4: '4. Disclaimer of Warranties', terms_p4_1: 'imgsfix is provided "as is" and "as available" without warranties of any kind, either express or implied. To the fullest extent permitted by applicable law, we disclaim all warranties, including but not limited to:',
      terms_p4_l1: 'Implied warranties of merchantability and fitness for a particular purpose.', terms_p4_l2: 'Warranties that the service will be uninterrupted, error-free, or secure.', terms_p4_l3: 'Warranties regarding the accuracy, reliability, or quality of the results produced by the tools.', terms_p4_l4: 'Warranties that the service will meet your specific requirements or expectations.',
      terms_p4_2: 'Because all processing occurs in your browser using its built-in capabilities, the quality and performance of the tools may vary depending on your device, browser, and the specific image being processed. You use the service at your own risk and are responsible for verifying the suitability of the output for your intended purpose.',
      terms_h2_5: '5. Limitation of Liability', terms_p5_1: 'To the maximum extent permitted by applicable law, imgsfix and its creators shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of, or inability to use, the service. This includes, without limitation:',
      terms_p5_l1: 'Loss of data, images, or profits.', terms_p5_l2: 'Business interruption or loss of business information.', terms_p5_l3: 'Damages resulting from the use of or inability to use the service.', terms_p5_l4: 'Damages resulting from errors, omissions, or inaccuracies in the output produced by the tools.',
      terms_p5_2: 'Because imgsfix is a free service provided without charge, you agree that this limitation of liability is a fair and reasonable allocation of risk. You are encouraged to keep backups of your original images and to verify the results of any processing before relying on them for important purposes.',
      terms_h2_6: '6. Changes to These Terms', terms_p6_1: 'We reserve the right to modify these Terms of Use at any time. When we do, we will update the "last updated" date at the top of this page. Changes take effect immediately upon posting. It is your responsibility to review these terms periodically for updates.',
      terms_p6_2: 'Continued use of imgsfix after changes are posted constitutes your acceptance of the revised terms. If you do not agree to the updated terms, you should stop using the service. Given the fundamental nature of imgsfix \u2014 free, private, client-side \u2014 we do not anticipate significant changes to the core terms.',
      terms_h2_7: '7. Governing Law', terms_p7_1: 'These Terms of Use shall be governed by and construed in accordance with applicable law, without regard to conflict of law principles. Any disputes arising from or relating to your use of imgsfix shall be resolved in the appropriate courts of the jurisdiction in which the service is operated.',
      terms_p7_2: 'If any provision of these terms is found to be unenforceable or invalid by a court of competent jurisdiction, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.',
      terms_h2_8: '8. Contact', terms_p8_1: 'If you have any questions or concerns about these Terms of Use, please visit our contact page. You may also find helpful information in our FAQ, Privacy Policy, and Disclaimer.',
      // cookies detailed
      cookies_last_updated: 'Last updated: July 2026', cookies_short_label: 'The short version:', cookies_short_text: 'imgsfix does not set tracking cookies of any kind. The only local storage we use is two small entries in your browser\'s localStorage to remember your theme (light/dark) and language (English/Arabic). This storage never leaves your device and contains no personal information. You can clear it at any time.',
      cookies_h2_1: '1. No Tracking Cookies', cookies_p1_1: 'imgsfix does not use cookies to track you. We do not set first-party cookies for analytics, advertising, session management, personalization, or any other purpose. We do not place third-party cookies on your device. There is no cookie banner or consent popup on imgsfix because there are no tracking cookies to consent to.',
      cookies_p1_2: 'Many websites use cookies to remember who you are, measure your behavior, serve targeted ads, or follow you across the web. imgsfix does none of this. We have no analytics, no advertising networks, no social media integrations, and no remarketing pixels \u2014 and therefore no need for the cookies that power them.',
      cookies_h2_2: '2. localStorage for Preferences Only', cookies_p2_1: 'Instead of cookies, imgsfix uses the browser\'s localStorage API to remember two small preferences. localStorage is a browser feature that lets a website store small amounts of data on your device. Unlike cookies, localStorage data is not automatically sent to a server with every request \u2014 it stays on your device and is only read by the page that created it.',
      cookies_p2_2: 'The two items we store are:',
      cookies_p2_l1: 'imgsfix_theme \u2014 a single word, either "light" or "dark", recording which visual theme you have selected. This lets the site load in your preferred theme on your next visit.', cookies_p2_l2: 'imgsfix_lang \u2014 a single word, either "en" or "ar", recording whether you have chosen English or Arabic. This lets the site display in your preferred language automatically.',
      cookies_p2_3: 'That is the complete list. These values contain no personal information \u2014 they are short strings that describe a visual preference. They are never transmitted to us or to any third party. They exist solely to make your experience more convenient, and you can delete them at any time without affecting the functionality of any tool.',
      cookies_h2_3: '3. Google Fonts', cookies_p3_1: 'imgsfix loads the Cairo typeface from Google Fonts (fonts.googleapis.com and fonts.gstatic.com). When your browser requests the font stylesheet and font files, Google\'s servers may set cookies on your device in accordance with Google\'s own privacy practices. These cookies are controlled by Google, not by imgsfix, and we have no access to them.',
      cookies_p3_2: 'If you prefer not to receive any cookies from Google, you can:', cookies_p3_l1: 'Block third-party fonts in your browser settings or with a content blocker extension.', cookies_p3_l2: 'Use a browser extension that blocks requests to Google Fonts domains.', cookies_p3_l3: 'Configure your browser to block third-party cookies entirely.',
      cookies_p3_4: 'If Google Fonts is blocked, imgsfix will fall back to your system\'s default fonts. All tools and features will continue to work normally \u2014 only the typography will change.',
      cookies_p3_5: 'For more about Google\'s data practices, please refer to Google\'s Privacy Policy.',
      cookies_h2_4: '4. How to View and Clear localStorage', cookies_p4_1: 'Because your preferences are stored locally on your device, you have full control over them. Here is how to view and clear imgsfix\'s localStorage in popular browsers:',
      cookies_h3_chrome: 'Google Chrome / Microsoft Edge', cookies_chrome_l1: 'Open imgsfix, then press F12 or Ctrl+Shift+I (Cmd+Option+I on Mac) to open Developer Tools.', cookies_chrome_l2: 'Go to the Application tab.', cookies_chrome_l3: 'In the left sidebar, expand Local Storage and select the imgsfix site.', cookies_chrome_l4: 'You will see imgsfix_theme and imgsfix_lang. Right-click and choose Clear to remove them.',
      cookies_h3_firefox: 'Mozilla Firefox', cookies_firefox_l1: 'Open imgsfix, then press F12 or Ctrl+Shift+I (Cmd+Option+I on Mac) to open Developer Tools.', cookies_firefox_l2: 'Go to the Storage tab.', cookies_firefox_l3: 'Expand Local Storage and select the imgsfix site.', cookies_firefox_l4: 'You will see the stored entries. Right-click and choose Delete to remove them.',
      cookies_h3_safari: 'Apple Safari', cookies_safari_l1: 'Open imgsfix, then press Cmd+Option+I to open Web Inspector.', cookies_safari_l2: 'Go to the Storage tab.', cookies_safari_l3: 'Expand Local Storage and select the imgsfix site.', cookies_safari_l4: 'Select the entries and press Delete to remove them.',
      cookies_h3_clearing: 'Clearing All Site Data', cookies_clearing_p1: 'You can also clear all localStorage for every site at once through your browser\'s privacy settings:',
      cookies_clearing_l1: 'Chrome: Settings \u2192 Privacy and security \u2192 Clear browsing data \u2192 Cached images and files / Cookies and site data.', cookies_clearing_l2: 'Firefox: Settings \u2192 Privacy & Security \u2192 Cookies and Site Data \u2192 Clear Data.', cookies_clearing_l3: 'Safari: Preferences \u2192 Privacy \u2192 Manage Website Data \u2192 Remove All.', cookies_clearing_l4: 'Edge: Settings \u2192 Cookies and site permissions \u2192 Manage and delete cookies and site data.',
      cookies_h2_5: '5. Your Control Over Preferences', cookies_p5_1: 'You are always in control of your imgsfix experience. Your theme and language preferences are optional conveniences \u2014 the tools work perfectly without them. If you clear localStorage, the site will simply use its defaults (light theme and your browser\'s detected language) until you choose again.',
      cookies_p5_2: 'There is no account to delete, no data to export, and no tracking history to review, because none of those things exist. Your relationship with imgsfix is as simple as it gets: you use the tools, your images stay on your device, and the only thing the site remembers is how you like it to look.',
      cookies_h2_6: '6. Changes to This Policy', cookies_p6_1: 'If we ever change our cookie or storage practices, we will update this page and revise the "last updated" date. Given that imgsfix\'s core design avoids cookies entirely, we do not anticipate changes that would introduce tracking. Any future change would be clearly documented here.',
      cookies_h2_7: '7. Contact', cookies_p7_1: 'Questions about this Cookie Policy? Visit our contact page to get in touch, or read our full Privacy Policy for the complete picture of how imgsfix handles (or rather, does not handle) your data.',
      // disclaimer detailed
      disclaimer_note_label: 'Please note:', disclaimer_note_text: 'imgsfix is a free tool provided "as is" without warranties of any kind. The information and tools on this site are offered for general use and convenience, not as professional advice. You are responsible for your images and your use of the results.',
      disclaimer_h2_1: 'General Disclaimer', disclaimer_p1_1: 'The information and tools provided by imgsfix are offered as a free, public service for general-purpose image processing. While we strive to make the tools accurate, reliable, and useful, imgsfix is provided on an "as is" and "as available" basis. We make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the service or the results it produces.',
      disclaimer_p1_2: 'Any reliance you place on imgsfix, its tools, or its output is strictly at your own risk. We will not be liable for any loss or damage of any kind arising from the use of, or reliance on, the service or the images it generates. You are encouraged to verify the results of any processing before using them in contexts where accuracy is critical.',
      disclaimer_h2_2: 'No Guarantee of Results', disclaimer_p2_1: 'imgsfix\'s tools process images using your browser\'s built-in capabilities and the HTML5 Canvas API. Because results depend on factors outside our control \u2014 including your browser, your device\'s processing power, the specific characteristics of your image, and the settings you choose \u2014 we cannot guarantee any particular outcome.',
      disclaimer_p2_l1: 'Compression results vary depending on the image content, format, and quality setting you select.', disclaimer_p2_l2: 'Background removal works best with solid, contrasting backgrounds and may not produce clean results on complex images.', disclaimer_p2_l3: 'Cartoonization and filters are stylistic transformations whose output is subjective.', disclaimer_p2_l4: 'Enhancement adjustments depend on the original image quality and may not fully restore damaged or low-resolution photos.', disclaimer_p2_l5: 'The QR reader\'s accuracy depends on image clarity, lighting, and browser support for the BarcodeDetector API.',
      disclaimer_p2_2: 'We recommend reviewing the output of each tool before relying on it. If a result does not meet your needs, you can adjust the settings and try again \u2014 there is no limit on how many times you use any tool, and no cost involved.',
      disclaimer_h2_3: 'User Responsibility for Images', disclaimer_p3_1: 'You are solely responsible for the images you process using imgsfix. By using the service, you confirm that:',
      disclaimer_p3_l1: 'You own the images you process, or you have obtained the necessary rights and permissions to use and modify them.', disclaimer_p3_l2: 'Your use of the images and the processed output does not infringe on the copyright, trademark, privacy, or other rights of any third party.', disclaimer_p3_l3: 'You will not use imgsfix to process images for any unlawful or fraudulent purpose.',
      disclaimer_p3_2: 'Because all processing happens in your browser and no data is transmitted to us, we have no way of monitoring or reviewing the images you process. This means we also have no way to enforce these responsibilities \u2014 but it also means that your images remain entirely private. The responsibility for lawful and ethical use rests with you.',
      disclaimer_h2_4: 'Not Professional Advice', disclaimer_p4_1: 'The tools and content on imgsfix are provided for general image-processing purposes only. They do not constitute professional advice of any kind. Specifically:',
      disclaimer_p4_l1: 'imgsfix is not a substitute for professional image editing, graphic design, or photography services.', disclaimer_p4_l2: 'The tools do not provide legal, medical, financial, or technical advice.', disclaimer_p4_l3: 'QR code and barcode content should be verified independently \u2014 do not act on scanned URLs or data without confirming they are legitimate and safe.', disclaimer_p4_l4: 'Content on the about, services, FAQ, and policy pages is informational and should not be taken as professional guidance.',
      disclaimer_p4_2: 'If you require professional results or advice for a specific purpose \u2014 such as commercial print production, legal documentation, or critical business materials \u2014 you should consult an appropriate professional. imgsfix is a convenient, free, and private tool, but it is not a replacement for professional services when those are warranted.',
      disclaimer_h2_5: 'Use at Your Own Risk', disclaimer_p5_1: 'Your use of imgsfix is entirely at your own risk. While we work to ensure the service is safe and functional, we cannot guarantee that it will be free of errors, bugs, or interruptions at all times. Browser updates, device limitations, or network conditions may occasionally affect performance.',
      disclaimer_p5_2: 'To protect yourself, we recommend:', disclaimer_p5_l1: 'Keeping backup copies of your original images before processing them.', disclaimer_p5_l2: 'Reviewing downloaded results before deleting or overwriting your originals.', disclaimer_p5_l3: 'Using a supported, up-to-date browser for the best experience.', disclaimer_p5_l4: 'Testing tools on non-critical images first if you are unsure how they will perform.',
      disclaimer_h2_6: 'External Links', disclaimer_p6_1: 'imgsfix may contain links to external websites (such as Google\'s privacy policy) that are not operated by us. We have no control over the content and practices of these third-party sites and cannot accept responsibility for their respective privacy policies or terms of use. You acknowledge that imgsfix is not responsible for the accuracy or reliability of any information, products, or services offered on external sites.',
      disclaimer_h2_7: 'Changes to This Disclaimer', disclaimer_p7_1: 'We reserve the right to update or modify this disclaimer at any time. Any changes will be posted on this page with an updated "last updated" date. Your continued use of imgsfix after changes are posted constitutes your acknowledgment of the revised disclaimer.',
      disclaimer_h2_8: 'Contact', disclaimer_p8_1: 'If you have any questions about this disclaimer, please visit our contact page. You may also find relevant information in our Terms of Use, Privacy Policy, and FAQ.'
    },
    ar: {
      nav_home: 'الرئيسية', nav_tools: 'الأدوات', nav_editor: 'المحرر', nav_qr: 'قارئ QR',
      nav_services: 'الخدمات', nav_about: 'حول', nav_contact: 'اتصل', nav_faq: 'الأسئلة',
      cta_start: 'ابدأ التحرير', cta_browse: 'تصفح الأدوات',
      theme_toggle: 'تبديل المظهر', light: 'فاتح', dark: 'داكن',
      hero_badge: 'يعمل بالمتصفح 100% · بدون رفع · خصوصية تامة',
      hero_title: 'أصلح وحوّل صورك مباشرة في المتصفح',
      hero_title_g: 'مباشرة في المتصفح',
      hero_lead: 'ضغط، تغيير حجم، تحويل، قص، تحسين، وتحرير الصور بدون أي اتصال بالخادم. ملفاتك لا تغادر جهازك — خصوصية مضمونة.',
      hero_stat1: '٨ أدوات', hero_stat2: 'صفر رفع', hero_stat3: 'مجاني للأبد', hero_stat4: 'بدون تسجيل', hero_stat5: 'عربي / EN',
      services_badge: 'ماذا نقدم', services_title: 'ثلاث ركائز لـ imgsfix',
      svc1_t: 'أدوات الصور', svc1_d: 'ثماني أدوات مركزة — ضغط، تغيير حجم، تحويل، قص، إزالة الخلفية، كرتون، تحسين، ومرشحات.',
      svc2_t: 'QR والباركود', svc2_d: 'امسح رموز QR والباركود من الكاميرا أو ملفات الصور فوراً، كل ذلك محلياً على جهازك.',
      svc3_t: 'محرر متقدم', svc3_d: 'محرر لوحة كامل بالأشكال والنصوص والطبقات والإعدادات المسبقة والتراجع والإعادة.',
      tools_badge: 'حقيبة الأدوات', tools_title: 'ثماني أدوات قوية للصور',
      tools_search_ph: 'ابحث عن أداة…',
      t_compress_t: 'ضغط', t_compress_d: 'قلل حجم الملف مع الحفاظ على الجودة.',
      t_resize_t: 'تغيير الحجم', t_resize_d: 'غيّر أبعاد الصورة إلى أي حجم.',
      t_convert_t: 'تحويل', t_convert_d: 'بدّل بين JPG و PNG و WebP.',
      t_crop_t: 'قص', t_crop_d: 'اقتص وقم بإطار صورتك بدقة.',
      t_removebg_t: 'إزالة الخلفية', t_removebg_d: 'امسح الخلفيات بأخذ عينة اللون.',
      t_cartoon_t: 'كرتون', t_cartoon_d: 'حوّل الصور إلى فن كرتوني.',
      t_enhance_t: 'تحسين', t_enhance_d: 'اضبط السطوع والتباين والحدة.',
      t_filters_t: 'مرشحات', t_filters_d: 'طبّق مرشحات منمّقة مع التحكم بالشدة.',
      open_tool: 'افتح الأداة',
      no_tools: 'لا توجد أدوات مطابقة لبحثك.',
      workflow_badge: 'كيف يعمل', workflow_title: 'ثلاث خطوات بسيطة',
      step1_t: 'اختر أداة', step1_d: 'اختر من ثماني أدوات أو قارئ QR أو المحرر المتقدم.',
      step2_t: 'أفلت ملفك', step2_d: 'اسحب وأفلت أو تصفح — صورتك تبقى على جهازك، لا يتم رفعها.',
      step3_t: 'حمّل النتيجة', step3_d: 'عالج فوراً وحمّل النتيجة. بدون انتظار، بدون حسابات.',
      features_badge: 'لماذا imgsfix', features_title: 'مبني للخصوصية والسرعة',
      f1_t: 'خصوصية 100%', f1_d: 'الملفات لا تغادر متصفحك. لا رفع، لا خوادم.',
      f2_t: 'سريع كالبرق', f2_d: 'معالجة فورية بواسطة Canvas API. لا طوابير.',
      f3_t: 'مجاني للأبد', f3_d: 'لا اشتراكات، لا تكاليف خفية، لا تسجيل مطلوب.',
      f4_t: 'ثنائي اللغة', f4_d: 'دعم كامل للعربية والإنجليزية مع تخطيط RTL.',
      cta_title: 'جاهز لإصلاح صورك؟', cta_desc: 'ابدأ باستخدام imgsfix الآن — بدون تنزيل، بدون حسابات، فقط افتح واعمل.',
      cta_go: 'شغّل الأدوات', cta_editor: 'افتح المحرر',
      footer_about: 'imgsfix أداة صور تركز على الخصوصية وتعمل بالمتصفح 100%. كل شيء يحدث في متصفحك — لا رفع، لا خوادم، لا تتبع.',
      footer_company: 'الشركة', footer_tools_h: 'الأدوات', footer_resources: 'موارد',
      footer_privacy: 'سياسة الخصوصية', footer_terms: 'شروط الاستخدام', footer_cookies: 'سياسة الكوكيز', footer_disclaimer: 'إخلاء المسؤولية',
      footer_rights: 'جميع الحقوق محفوظة.', footer_made: 'صُنع بعناية من أجل الخصوصية.',
      scroll_top: 'العودة للأعلى',
      modal_confirm: 'تأكيد', modal_cancel: 'إلغاء',
      tc_drop: 'أفلت صورتك هنا أو انقر للتصفح', tc_browse: 'تصفح الملفات', tc_supported: 'JPG · PNG · WebP · GIF · BMP',
      tc_download: 'تحميل', tc_reset: 'إعادة', tc_clear: 'مسح', tc_processing: 'جارٍ المعالجة…', tc_done: 'تم!',
      tc_original: 'قبل', tc_result: 'بعد', tc_size: 'الحجم', tc_quality: 'الجودة',
      page_about: 'حول', page_services: 'الخدمات', page_contact: 'اتصل', page_faq: 'الأسئلة',
      page_privacy: 'سياسة الخصوصية', page_terms: 'الشروط', page_cookies: 'الكوكيز', page_disclaimer: 'إخلاء المسؤولية',
      page_404: 'الصفحة غير موجودة', go_home: 'الذهاب للرئيسية',
      bc_home: 'الرئيسية',
      t_upload: 'رفع صورة',
      tc_compress_settings: 'إعدادات الضغط', tc_max_width: 'أقصى عرض (بكسل)', tc_before: 'قبل', tc_after: 'بعد', tc_saved: 'الموفّر',
      tc_resize_settings: 'إعدادات تغيير الحجم', tc_width_px: 'العرض (بكسل)', tc_height_px: 'الارتفاع (بكسل)', tc_lock_ar: 'قفل نسبة الأبعاد', tc_apply: 'تطبيق',
      tc_convert_settings: 'إعدادات التحويل', tc_format: 'الصيغة',
      tc_crop_settings: 'إعدادات القص', tc_free: 'حر',
      tc_removebg_settings: 'إعدادات إزالة الخلفية', tc_tolerance: 'التسامح', tc_output_bg: 'خلفية المخرج', tc_transparent: 'شفاف', tc_white: 'أبيض', tc_custom_color: 'لون مخصص',
      tc_removebg_instruction: 'انقر على الصورة المصدر لأخذ عينة لون الخلفية، ثم اضغط تطبيق.',
      tc_no_color: 'لم يُؤخذ أي لون',
      tc_cartoon_settings: 'إعدادات التحويل إلى كرتون', tc_edge_intensity: 'شدّة الحواف', tc_color_levels: 'مستويات الألوان', tc_smoothness: 'النعومة',
      tc_enhance_settings: 'إعدادات التحسين', tc_brightness: 'السطوع', tc_contrast: 'التباين', tc_saturation: 'التشبّع', tc_sharpness: 'الحدة',
      tc_filters_settings: 'أنماط المرشحات المسبقة', tc_intensity: 'الشدّة', tc_no_filter: 'بلا مرشح',
      qr_camera: 'الكاميرا', qr_image_file: 'ملف صورة', qr_start_cam: 'تشغيل الكاميرا', qr_stop: 'إيقاف',
      qr_drop: 'أفلِت صورة تحتوي على رمز QR/باركود أو انقر للتصفح', qr_detected: 'تم اكتشاف: ', qr_copy: 'نسخ', qr_open_url: 'فتح الرابط', qr_clear: 'مسح',
      qr_scan_desc: 'امسح رموز QR والباركود من كاميرتك أو ملفات الصور — كله محلياً في متصفحك.',
      about_intro: 'imgsfix هي مجموعة أدوات صور تركز على الخصوصية وتعمل بالكامل داخل متصفحك — لا رفع، لا خوادم، لا تتبع.',
      about_mission: 'مهمتنا',
      about_mission_p1: 'وُجد imgsfix لسبب بسيط: ينبغي أن تكون قادراً على إصلاح صورك وتحويلها وتعديلها دون تسليمها إلى خادم غريب. كل يوم، يرفع ملايين الأشخاص صوراً شخصية ومستندات عمل ومرئيات حساسة إلى أدوات عبر الإنترنت تنسخها وتخزّنها وأحياناً تحللها بصمت. بنينا imgsfix لكسر هذا النمط.',
      about_mission_p2: 'مهمتنا هي تقديم مجموعة أدوات صور كاملة ومستوى احترافي لا ترسل بايتاً واحداً من ملفاتك إلى أي مكان. كل شيء — الضغط، تغيير الحجم، تحويل الصيغ، القص، إزالة الخلفية، التحويل إلى كرتون، التحسين، المرشحات، مسح QR، والتحرير الكامل — يحدث داخل متصفحك، على جهازك الخاص، باستخدام قدرة المعالجة التي تملكها أصلاً.',
      about_mission_p3: 'نؤمن أن الخصوصية ليست ميزة مدفوعة أو شعاراً تسويقياً. إنها الحد الأدنى. أداة تحترم بياناتك لا ينبغي أن تعد بعدم إساءة استخدامها — بل ينبغي ألا تجمعها أصلاً. هذا هو المعيار الذي بُني imgsfix عليه.',
      about_how: 'كيف يعمل', about_team: 'فلسفة فريقنا', about_tech: 'التقنية التي نستخدمها',
      about_free: 'التزامنا بالوصول المجاني', about_values: 'قيمنا في الخصوصية',
      services_intro: 'ثلاثة أركان لمعالجة الصور المجانية التي تركز على الخصوصية — كلها تعمل بنسبة 100٪ في متصفحك.',
      services_p1: 'نُظّم imgsfix حول ثلاثة أركان متكاملة. تغطي معاً النطاق الكامل لمهام الصور اليومية — من تغيير حجم سريع إلى تصميم متعدد الطبقات — دون أن تتطلب منك أبداً رفع ملف أو إنشاء حساب. فيما يلي نظرة مفصلة على كل ركن والأدوات داخله.',
      svc_tools_title: '🔧 أدوات الصور', svc_qr_title: '📷 قارئ QR والباركود', svc_editor_title: '🎨 المحرر المتقدم',
      svc_editor_key: 'القدرات الرئيسية', svc_tie_title: 'ما يربطها معاً',
      faq_intro: 'أسئلة شائعة حول imgsfix — كيف يعمل، الخصوصية، الصيغ المدعومة، والمزيد.',
      faq_a1: 'imgsfix مجموعة أدوات صور مجانية تركز على الخصوصية وتعمل بالكامل داخل متصفحك. تقدم ثماني أدوات صور (ضغط، تغيير حجم، تحويل، قص، إزالة خلفية، تحويل إلى كرتون، تحسين، ومرشحات)، وقارئ QR والباركود، ومحرر متقدم كامل الميزات. كل عملية تتم محلياً على جهازك باستخدام HTML5 Canvas و JavaScript — لا يُرفع أي ملف إلى خادم أبداً.',
      faq_not_found: 'لم تجد ما تبحث عنه؟', faq_contact: 'تواصل معنا', faq_view_services: 'عرض الخدمات',
      privacy_intro: 'خصوصيتك ليست ميزة — بل هي الأساس. تشرح هذه السياسة بالضبط ما يفعله imgsfix وما لا يفعله ببياناتك.',
      privacy_last_updated: 'آخر تحديث: يوليو 2026',
      terms_intro: 'الشروط والأحكام التي تحكم استخدامك لـ imgsfix. يُرجى قراءتها بعناية.',
      page_terms_full: 'شروط الاستخدام',
      page_cookies_full: 'سياسة الكوكيز', cookies_intro: 'الخبر السار: imgsfix لا يستخدم كوكيز تتبع. إليك بالضبط ما نخزّنه وما لا نخزّنه على جهازك.',
      disclaimer_intro: 'معلومات مهمة عن طبيعة imgsfix وحدود ما يقدمه.',
      disclaimer_last_updated: 'آخر تحديث: يوليو 2026',
      err404_title: 'عذراً! ضاعت هذه الصفحة',
      err404_desc: 'قد تكون الصفحة التي تبحث عنها قد نُقلت أو أُعيدت تسميتها أو لم تكن موجودة أصلاً. لكن لا تقلق — صورك في أمان، وأدواتنا على بُعد نقرة واحدة.',
      contact_intro: 'هل لديك ملاحظات أو طلب ميزة أو سؤال؟ نحب أن نسمع منك.',
      contact_desc: 'سواء وجدت خطأً أو لديك فكرة لأداة جديدة أو تريد فقط قول مرحباً، فهذا هو المكان. املأ النموذج أدناه وسنعود إليك في أقرب وقت ممكن.',
      contact_name: 'الاسم', contact_name_ph: 'اسمك',
      contact_email: 'البريد الإلكتروني', contact_email_ph: 'you@example.com',
      contact_subject: 'الموضوع', contact_subject_ph: 'ما الموضوع؟',
      contact_message: 'الرسالة', contact_message_ph: 'أخبرنا بما يدور في ذهنك…',
      contact_send: 'إرسال الرسالة',
      contact_before_title: 'قبل أن تكتب…', contact_before_desc: 'قد تجد إجابة سريعة في إحدى هذه الصفحات. لقد جمعنا محتوى مفصلاً يغطي الأسئلة الأكثر شيوعاً:',
      contact_link_faq: 'إجابات لأسئلة حول كيفية عمل imgsfix، الخصوصية، الصيغ المدعومة، المتصفحات، الاستخدام دون اتصال، والمزيد.',
      contact_link_about: 'مهمتنا، كيف تعمل الأدوات، فلسفة فريقنا، والتقنية وراء imgsfix.',
      contact_link_services: 'نظرة شاملة على الأركان الثلاثة: أدوات الصور، قارئ QR، والمحرر المتقدم.',
      contact_link_privacy: 'شرح مفصل لنهجنا في عدم جمع البيانات.',
      contact_link_terms: 'الشروط التي تحكم استخدامك لـ imgsfix.',
      contact_include_title: 'ماذا تتضمّن', contact_include_desc: 'لمساعدتنا في الرد بسرعة وفائدة، يُرجى تضمين أكبر قدر ممكن مما يلي:',
      contact_include_1: 'اسم الأداة أو الصفحة التي واجهت فيها المشكلة.',
      contact_include_2: 'متصفحك ونظام التشغيل (مثلاً: Chrome 120 على Windows، Safari على iPhone).',
      contact_include_3: 'صيغة الصورة وحجم الملف التقريبي، إذا كان سؤالك يتعلق بملف محدد.',
      contact_include_4: 'خطوات إعادة إنتاج أي خطأ تبلغ عنه.',
      contact_include_5: 'وصف ما توقعته مقابل ما حدث فعلاً.',
      contact_include_6: 'طلبات الميزات مرحب بها دائماً. إذا كانت هناك أداة صور تتمنى وجودها في imgsfix، أخبرنا عنها — نعطي الأولوية للإضافات التي تخدم أكبر عدد من المستخدمين مع التزامنا ببنية الخصوصية أولاً.',
      editor_desc: 'محرر canvas كامل الميزات بأشكال ونصوص وطبقات وإعدادات مسبقة وتراجع/إعادة — كله في متصفحك.',
      ed_undo: '↶ تراجع', ed_redo: '↷ إعادة', ed_duplicate: '⎘ تكرار', ed_delete: '✕ حذف',
      ed_front: '⬆ للأمام', ed_forward: '↑ خطوة أمام', ed_backward: '↓ خطوة خلف', ed_back: '⬇ للخلف',
      ed_export: '📥 تصدير', ed_save: '💾 حفظ', ed_clear: '🗑 مسح',
      ed_presets: 'إعدادات مسبقة', ed_width: 'العرض', ed_height: 'الارتفاع', ed_custom_size: 'مقاس مخصص',
      ed_tools: 'الأدوات', ed_select: '✋ تحديد', ed_brush: '🖌 فرشاة', ed_text: 'T نص',
      ed_rect: '▭ مستطيل', ed_circle: '● دائرة', ed_triangle: '▲ مثلث', ed_line: '— خط', ed_arrow: '→ سهم',
      ed_brush_settings: 'الفرشاة', ed_color: 'اللون',
      ed_properties: 'الخصائص', ed_fill: 'التعبئة',
      ed_text_label: 'النص', ed_align_left: 'يسار', ed_align_center: 'وسط', ed_align_right: 'يمين',
      ed_zoom: 'التكبير', ed_fit: 'ملاءمة', ed_background: 'الخلفية', ed_layers: 'الطبقات', ed_no_layers: 'لا توجد طبقات بعد',
      ed_shortcuts: 'اختصارات', ed_sc_del: 'حذف كائن', ed_sc_undo: 'تراجع', ed_sc_redo: 'إعادة', ed_sc_dup: 'تكرار', ed_sc_save: 'حفظ المشروع',
      ed_drop: 'أفلت صورة هنا أو انقر للتصفح',
      // tool labels with dynamic values
      tc_jpeg: 'JPEG', tc_png: 'PNG', tc_webp: 'WebP',
      ed_width_label: 'العرض:', ed_opacity_label: 'الشفافية:', ed_rotation_label: 'الدوران:', ed_font_size_label: 'حجم الخط:',
      ed_zoom_out: '\u2212', ed_zoom_in: '+',
      // about page detailed
      about_how_p1: 'عندما تفتح أداة على imgsfix وتختار صورة، يُقرأ ذلك الملف مباشرةً إلى ذاكرة متصفحك باستخدام File API. ثم يُرسم على عنصر HTML5 canvas، حيث يعالج JavaScript البكسلات في الوقت الفعلي. عندما تكون راضياً عن النتيجة، يُصدَّر canvas إلى ملف صورة قابل للتنزيل \u2014 مرة أخرى، كله على جهازك.',
      about_how_p2: 'في أي لحظة من هذه العملية لا تسافر صورتك عبر الإنترنت. لا توجد خطوة رفع، ولا تخزين مؤقت على الخادم، ولا قائمة معالجة في الخلفية، ولا سجل بما حررته. إذا أغلقت التبويب، تختفي الصورة من الذاكرة. النسخة الوحيدة التي توجد هي تلك التي نزّلتها.',
      about_how_p3: 'تُسمى هذه البنية أحياناً «المعالجة من جهة العميل» أو «المعالجة بدون معرفة». وهي تعني أننا حرفياً لا نستطيع رؤية ملفاتك \u2014 ليس لأننا نختار ألا ننظر، بل لأنها لا تُرسل إلينا أصلاً.',
      about_team_p1: 'بُني imgsfix بواسطة مطورين سئموا الموازنة بين الراحة والخصوصية. رأينا محررات صور قوية عبر الإنترنت تتطلب إنشاء حساب وتتبع أنماط الاستخدام وتخزين ملفات المستخدمين إلى أجل غير مسمى \u2014 فطرحنا سؤالاً بسيطاً: لماذا؟ المتصفحات الحديثة قادرة تماماً على معالجة الصور محلياً. رحلة الخادم غير ضرورية، وكذلك ثمن الخصوصية الذي يرافقها.',
      about_team_p2: 'يمكن تلخيص فلسفتنا في ثلاثة مبادئ:',
      about_team_l1: 'الخصوصية بالبنية لا بالوعد. لا نعتمد على السياسات لحماية بياناتك \u2014 بل نعتمد على حقيقة أننا لا نتلقاها أبداً.',
      about_team_l2: 'وصول مجاني للجميع. الأدوات المفيدة لا ينبغي أن تُحجز خلف جدران الدفع أو التجارب أو التسجيل. imgsfix مجاني للاستخدام، اليوم ودائماً.',
      about_team_l3: 'مفتوح وشفاف. المنطق الذي يعالج صورك يعمل في متصفحك حيث يمكنك فحصه. لا صناديق سوداء، لا سلوك خفي.',
      about_tech_p1: 'بُني imgsfix عمداً على معايير الويب بدلاً من أطر عمل ثقيلة. هذا يبقي الموقع سريعاً وخفيفاً وسهل المراجعة. تشمل التقنيات الأساسية:',
      about_tech_l1: 'HTML5 Canvas API \u2014 أساس جميع معالجات الصور. كل أداة ترسم صورتك على canvas وتقرأ أو تعدّل بيانات البكسلات مباشرة.',
      about_tech_l2: 'JavaScript خام \u2014 لا خطوة بناء، لا مترجم، لا وقت تشغيل لإطار عمل. الكود الذي يعمل هو الكود الذي يمكنك قراءته.',
      about_tech_l3: 'File API و FileReader \u2014 يتيحان لمتصفحك قراءة الملفات المختارة أو المفلترة إلى الذاكرة دون رفعها.',
      about_tech_l4: 'BarcodeDetector API \u2014 واجهة برمجية أصلية في المتصفح يستخدمها قارئ QR والباركود للمسح السريع المحلي.',
      about_tech_l5: 'Fabric.js \u2014 مكتبة canvas خفيفة تشغّل المحرر المتقدم بالأشكال والنصوص والطبقات ومعالجة الكائنات.',
      about_tech_l6: 'localStorage \u2014 يُستخدم فقط لتذكّر تفضيلاتك للسمة (فاتح/داكن) واللغة (إنجليزي/عربي). لا تُخزَّن أي بيانات أخرى.',
      about_tech_p2: 'نتجنب عمداً سكربتات التحليل ومتعقبات الإعلانات وخدمات المعالجة الخارجية. المورد الخارجي الوحيد الذي يُحمَّل هو خط Cairo من Google Fonts، ويُستخدم للطباعة.',
      about_free_p1: 'imgsfix مجاني للاستخدام للجميع \u2014 أفراداً وطلاباً ومستقلين ومؤسسات صغيرة وكبيرة. لا اشتراكات، ولا مستويات مدفوعة، ولا حدود استخدام، ولا علامات مائية على مخرجاتك. لا تحتاج إلى إنشاء حساب أو تقديم بريد إلكتروني أو التعريف بنفسك بأي طريقة.',
      about_free_p2: 'ننوي إبقاء الأمر هكذا. الأدوات التي تراها اليوم ستبقى مجانية، والأدوات الجديدة التي نضيفها مستقبلاً ستكون مجانية أيضاً. نؤمن أن البرمجيات التي تحترم الخصوصية ينبغي أن تكون متاحة للجميع، لا فقط لمن يستطيع الدفع.',
      about_free_p3: 'إذا وجدت imgsfix مفيداً، فإن أفضل طريقة لدعمنا هي مشاركته مع آخرين يهتمون بخصوصيتهم. التوصية الشفهية هي كيف تنمو أداة كهذه \u2014 لا حملات إعلانية، لا بكسلات تتبع، بل شخص يخبر شخصاً.',
      about_values_p1: 'الخصوصية ليست ميزة أضفناها \u2014 بل هي سبب وجود imgsfix. هذه هي القيم التي توجّه كل قرار نتخذه:',
      about_values_l1: 'لا جمع للبيانات. لا نجمع أو نخزّن أو ننقل صورك أو اختياراتك في التحرير أو معلوماتك الشخصية. لا توجد قاعدة بيانات لنشاط المستخدمين لأنه لا يوجد خادم يتلقاها.',
      about_values_l2: 'لا تتبع. لا نستخدم أدوات تحليل أو بكسلات إعلانية أو سكربتات بصمة أو أي تقنية تتبعك عبر الويب.',
      about_values_l3: 'لا كوكيز. لا نضع كوكيز تتبع. التخزين المحلي الوحيد الذي نستخدمه هو لتفضيلاتك للسمة واللغة، وهي تعيش على جهازك ولا تغادره أبداً.',
      about_values_l4: 'لا حسابات. لا تحتاج أبداً للتسجيل أو الدخول. هويتك شأنك الخاص، وصورك ملكك.',
      about_values_l5: 'يعمل دون اتصال. لأن المعالجة محلية، تستمر العديد من الأدوات في العمل حتى لو انقطع اتصالك أثناء الجلسة.',
      about_values_l6: 'بياناتك، أنت تتحكم بها. يمكنك مسح تفضيلاتك في أي وقت من متصفحك. لا شيء «تحذفه من خوادمنا» لأننا لم نمتلكه أصلاً.',
      about_values_p2: 'ندعوك لقراءة سياسة الخصوصية وسياسة الكوكيز كاملة. إذا كان لديك أسئلة، فإن الأسئلة الشائعة تغطي الأكثر شيوعاً، ويمكنك دائماً التواصل معنا مباشرة.',
      // services detailed
      svc_tools_p1: 'ركننا الرئيسي هو مجموعة من ثماني أدوات مركزة أحادية الغرض. كل أداة تفعل شيئاً واحداً بشكل ممتاز، بواجهة نظيفة ومعاينة فورية. اختر الأداة التي تناسب مهمتك، أفلِت صورتك، اضبط الإعدادات، ونزّل النتيجة. لا منحنى تعلّم، لا فوضى، لا رفع.',
      svc_tools_l1: 'ضغط \u2014 قلّص حجم ملفات JPG و PNG و WebP مع الحفاظ على الجودة البصرية. شريط جودة قابل للتعديل مع مقارنة قبل/بعد حية لتجد التوازن الأمثل بين الحجم والوضوح.',
      svc_tools_l2: 'تغيير الحجم \u2014 غيّر أبعاد الصورة إلى أي عرض وارتفاع. حافظ على نسبة الأبعاد بمفتاح واحد، أو اضبط بكسلات دقيقة لمتطلبات محددة كمنشورات وسائل التواصل أو ترويسات البريد.',
      svc_tools_l3: 'تحويل \u2014 بدّل بين صيغ JPG و PNG و WebP فوراً. مفيد عندما تتطلب منصة صيغة معينة أو تحتاج PNG شفاف من مصدر JPG.',
      svc_tools_l4: 'قص \u2014 قمّص صورك بدقة مع منطقة قص تفاعلية. اسحب لتحديد المنطقة، اقفل على نسب أبعاد شائعة، وصدّر الجزء الذي تحتاجه فقط.',
      svc_tools_l5: 'إزالة الخلفية \u2014 امسح خلفيات الصور باستخدام أخذ عينات الألوان. انقر على لون الخلفية لإزالته، اضبط التسامح لدقة الحواف، واحصل على قصاصة نظيفة دون قناع يدوي.',
      svc_tools_l6: 'تحويل إلى كرتون \u2014 حوّل الصور إلى أعمال فنية بأسلوب الكرتون. تطبّق الأداة كشف الحواف وتكميم الألوان محلياً لإنتاج مظهر مصوّر من أي صورة.',
      svc_tools_l7: 'تحسين \u2014 اضبط السطوع والتباين والحدة بمنزلقات بديهية. أنقذ اللقطات المعتمة، عزّز الصور المسطحة، وأبرز التفاصيل \u2014 كلها تُعالَج في الوقت الفعلي على جهازك.',
      svc_tools_l8: 'مرشحات \u2014 طبّق مرشحات منمّقة بشدّة قابلة للتعديل. اختر من تدرّج الرمادي والبني القديم والكلاسيكي والبارد والدافئ والمزيد، ثم اضبط قوة التطبيق قبل التنزيل.',
      svc_tools_p2: 'كل أداة أعلاه تشترك في الأساس نفسه: صورتك تُحمَّل إلى ذاكرة المتصفح، تُعالَج على canvas من HTML5، وتُصدَّر محلياً. الملف لا يغادر جهازك في أي مرحلة من سير العمل.',
      svc_qr_p1: 'الركن الثاني هو قارئ سريع ومحلي بالكامل لرموز QR والباركود. يدعم وضعين: المسح بالكاميرا الحية والمسح من ملف صورة. في وضع الكاميرا، يستخدم كاميرا جهازك وواجهة BarcodeDetector الأصلية لكشف الرموز في الوقت الفعلي \u2014 وجّه كاميرتك نحو رمز QR ويظهر المحتوى فوراً. في وضع الصورة، يمكنك تحميل أي ملف صورة يحتوي على QR أو باركود ويستخرج القارئ البيانات المشفّرة.',
      svc_qr_p2: 'تشمل الصيغ المدعومة رموز QR و EAN-13 و EAN-8 و UPC-A و UPC-E و Code 128 و Code 39 وغيرها من أنظمة الباركود الشائعة، حسب قدرات متصفحك. يمكن نسخ النتائج المكتشفة إلى الحافظة أو، إذا كان المحتوى رابطاً، فتحه مباشرة في تبويب جديد.',
      svc_qr_p3: 'تماماً مثل أدوات الصور، يعالج قارئ QR كل شيء على جهازك. تُحلَّل إطارات الكاميرا محلياً ولا تُبَث إلى أي خادم. ملفات الصور التي تمسحها تبقى في متصفحك.',
      svc_qr_open: 'فتح قارئ QR',
      svc_editor_p1: 'الركن الثالث هو محرر canvas كامل الميزات لwhen لا تكفي أداة المرور الواحد. مبني على Fabric.js، يوفر بيئة تحرير احترافية بميزات تتوقعها من برمجيات سطح المكتب \u2014 كلها تعمل في متصفحك دون أي رفع.',
      svc_editor_l1: 'أدوات الرسم \u2014 تحديد، فرشاة حرّة، نص، مستطيل، دائرة، مثلث، خط، وسهم.',
      svc_editor_l2: 'معالجة الكائنات \u2014 تحريك، تغيير حجم، تدوير، تكرار، وحذف أي كائن على canvas.',
      svc_editor_l3: 'إدارة الطبقات \u2014 إحضار للأمام، إرسال للخلف، إحضار للمقدمة، وإرسال للمؤخرة لترتيب دقيق.',
      svc_editor_l4: 'تحكم بالنص \u2014 كائنات نصية قابلة للتحرير بحجم الخط، عريض، مائل، تحته خط، وخيارات محاذاة.',
      svc_editor_l5: 'لوحة الخصائص \u2014 اضبط لون التعبئة والشفافية والدوران لأي كائن مختار.',
      svc_editor_l6: 'أحجام canvas مسبقة \u2014 ابدأ من منشور إنستغرام (1080\u00d71080)، قصة إنستغرام (1080\u00d71920)، صورة يوتيوب (1280\u00d7720)، منشور فيسبوك (1200\u00d7630)، أو مقاس مخصص.',
      svc_editor_l7: 'تراجع وإعادة \u2014 تنقل كامل في السجل باختصارات لوحة المفاتيح (Ctrl+Z / Ctrl+Y).',
      svc_editor_l8: 'حفظ المشروع \u2014 احفظ عملك كملف مشروع وحمّله لاحقاً لمواصلة التحرير.',
      svc_editor_l9: 'تصدير PNG \u2014 نزّل تكوينك النهائي كـ PNG عالي الجودة.',
      svc_editor_p2: 'المحرر مثالي لإنشاء رسومات وسائل التواصل والصور المصغّرة والتصاميم البسيطة والتعليقات والكولاجات \u2014 كلها دون تثبيت برمجيات أو تسليم محتواك لخدمة سحابية.',
      svc_editor_open: 'فتح المحرر المتقدم',
      svc_tie_p1: 'تشترك الأركان الثلاثة في الالتزامات نفسها: لا رفع، لا خوادم، لا حسابات، لا تتبع، ولا تكلفة. سواء كنت تضغط صورة واحدة أو تمسح رمز QR في مؤتمر أو تصمم رسماً متعدد الطبقات، تبقى بياناتك على جهازك من البداية للنهاية.',
      svc_tie_p2: 'جاهز للبدء؟ تصفّح أدوات الصور، جرّب قارئ QR، أو أطلق المحرر المتقدم. إذا كان لديك أسئلة، فإن الأسئلة الشائعة لديها إجابات، ومرحب بك دائماً للتواصل معنا.',
      // faq detailed
      faq_q1: 'ما هو imgsfix؟', faq_q2: 'هل imgsfix مجاني فعلاً؟', faq_q3: 'هل ترفعون صوري إلى خادم؟', faq_q4: 'ما صيغ الصور المدعومة؟', faq_q5: 'هل يعمل imgsfix دون اتصال؟', faq_q6: 'ما المتصفحات المدعومة؟', faq_q7: 'كيف يعمل المحرر المتقدم؟', faq_q8: 'هل بياناتي آمنة مع imgsfix؟', faq_q9: 'هل يمكنني استخدام imgsfix لأغراض تجارية؟', faq_q10: 'ما اللغات المدعومة؟',
      faq_a2: 'نعم، بالكامل. لا اشتراكات، ولا مستويات مدفوعة، ولا فترات تجريبية، ولا حدود استخدام، ولا علامات مائية على مخرجاتك. لا تحتاج لإنشاء حساب أو تقديم أي معلومات شخصية. imgsfix مجاني للجميع \u2014 أفراداً وطلاباً ومستقلين ومؤسسات \u2014 وننوي إبقاء الأمر هكذا.',
      faq_a3: 'لا. ليس لدى imgsfix خادم خلفي لمعالجة الصور. عندما تختار أو تفلِت ملفاً، يُحمَّل مباشرةً إلى ذاكرة متصفحك باستخدام File API ويُعالَج على عنصر canvas من HTML5. تُعالَج البكسلات بواسطة JavaScript يعمل على جهازك. عندما تنزّل النتيجة، يُولَّد الملف محلياً من canvas. صورتك لا تسافر عبر الإنترنت في أي مرحلة.',
      faq_a4: 'يعمل imgsfix مع أكثر صيغ صور الويب شيوعاً: JPG (JPEG) و PNG و WebP. أداة التحويل تتيح لك التبديل بين هذه الصيغ الثلاث. معظم الأدوات تقبل أيضاً GIF و BMP كمدخلات. المحرر المتقدم يصدّر إلى PNG. يعتمد دعم صيغة معينة على قدرات متصفحك المدمجة لفك ترميز الصور، لكن جميع المتصفحات الحديثة تتعامل مع JPG و PNG و WebP أصلياً.',
      faq_a5: 'بمجرد تحميل الصفحة، تستمر معظم الأدوات في العمل حتى لو انقطع اتصالك بالإنترنت، لأن كل المعالجة محلية. أدوات الصور والتحسين والمرشحات لا تحتاج اتصالاً بالشبكة بعد التحميل الأولي. وضع كاميرا قارئ QR والمحرر المتقدم يعملان أيضاً دون اتصال. المورد الخارجي الوحيد هو صفحة أنماط Google Fonts، التي تُحمَّل مرة واحدة للطباعة \u2014 إذا لم تكن متاحة، يلجأ الموقع إلى خطوط النظام.',
      faq_a6: 'يعمل imgsfix في جميع المتصفحات الحديثة التي تدعم HTML5 Canvas API و JavaScript الحديث. يشمل ذلك أحدث إصدارات Chrome و Edge و Firefox و Safari و Brave على سطح المكتب، وكذلك Chrome و Safari على الهاتف. مسح الكاميرا لقارئ QR يستخدم واجهة BarcodeDetector الأصلية، المتاحة حالياً في Chrome و Edge على سطح المكتب و Chrome على أندرويد. على المتصفحات بدون BarcodeDetector API، يمكنك مسح رموز QR من ملفات الصور.',
      faq_a7: 'المحرر المتقدم مبني على Fabric.js، مكتبة JavaScript خفيفة لـ canvas. يوفر بيئة تحرير كاملة بأدوات رسم (تحديد، فرشاة، نص، مستطيل، دائرة، مثلث، خط، سهم)، معالجة كائنات (تحريك، تغيير حجم، تدوير، تكرار، حذف)، ترتيب طبقات، لوحة خصائص للتعبئة والشفافية، أحجام canvas مسبقة لوسائل التواصل، تراجع/إعادة باختصارات لوحة المفاتيح، والقدرة على حفظ وتحميل المشاريع. كل شيء يُرسم على canvas في متصفحك \u2014 لا يوجد تفاعل مع خادم في أي مرحلة.',
      faq_a8: 'نعم. لأن كل المعالجة تحدث في متصفحك ولا تُنقل أي بيانات إلى أي خادم، فإن صورك وتعديلاتك لا تُخزَّن في أي مكان خارج جهازك. لا نستخدم أدوات تحليل أو متعقبات إعلانية أو جمع بيانات من أطراف ثالثة. الشيء الوحيد المخزَّن محلياً هو تفضيلك للسمة واللغة في localStorage لمتصفحك. يمكنك مسح هذا في أي وقت من إعدادات متصفحك. للتفاصيل الكاملة، راجع سياسة الخصوصية وسياسة الكوكيز.',
      faq_a9: 'نعم. imgsfix مجاني للاستخدام للمشاريع الشخصية والتجارية على حد سواء. لا توجد قيود ترخيص على الصور التي تنتجها \u2014 المخرج ملكك. يمكنك استخدام الصور المضغوطة والمغيَّرة حجمها والمحوَّلة والمقصوصة والمحرّرة في مواد عملك ومواقعك ووسائل تواصلك وعملائك أو أي سياق آخر. لا نضيف علامات مائية ولا نطالب بأي حقوق على محتواك. يُرجى مراجعة شروط الاستخدام للاطلاع على شروط الاستخدام الكاملة.',
      faq_a10: 'يدعم imgsfix حالياً لغتين: الإنجليزية والعربية. يمكنك التبديل بينهما في أي وقت باستخدام مفتاح اللغة في الترويسة. عند اختيار العربية، تتحول الواجهة بالكامل إلى تخطيط من اليمين لليسار (RTL) لتجربة قراءة طبيعية. يُحفَظ تفضيلك للغة في localStorage لمتصفحك فيستمر عبر الزيارات.',
      // privacy detailed
      privacy_short_label: 'الخلاصة:', privacy_short_text: 'imgsfix لا يجمع أو يخزّن أو ينقل بياناتك. لا خوادم تعالج صورك، لا أدوات تحليل تتتبع سلوكك، لا كوكيز إعلارية تتبعك، ولا حسابات مطلوبة. كل شيء يحدث في متصفحك. هذا ليس وعداً \u2014 بل نتيجة لكيفية بناء الموقع.',
      privacy_h2_1: '1. نظرة عامة', privacy_p1_1: 'imgsfix هو مجموعة أدوات صور تركز على الخصوصية وتعمل من جهة العميل. يعني «من جهة العميل» أن كل المعالجة \u2014 الضغط وتغيير الحجم والتحويل والقص وإزالة الخلفية والتحويل إلى كرتون والتحسين والمرشحات ومسح QR والتحرير \u2014 تجري بالكامل داخل متصفحك على جهازك. لا يُرسل أي جزء من صورتك أو اسم ملفك أو نشاط تحريرك إلينا أو لأي طرف ثالث.',
      privacy_p1_2: 'تشرح سياسة الخصوصية هذه بالتفصيل كيف يتعامل imgsfix (أو بالأحرى، لا يتعامل) مع معلوماتك. لأن الخدمة مصمّمة حول مبدأ تقليل البيانات، فإن معظم هذا المستند يشرح ما لا نفعله.',
      privacy_h2_2: '2. لا جمع للبيانات', privacy_p2_1: 'لا نجمع أي بيانات شخصية. تحديداً، لا نجمع:',
      privacy_p2_l1: 'اسمك أو بريدك الإلكتروني أو أي معلومات تعريف أخرى (لا حسابات مطلوبة).', privacy_p2_l2: 'عنوان IP أو موقعك الجغرافي.', privacy_p2_l3: 'الصور التي تعالجها \u2014 لا تغادر متصفحك أبداً.', privacy_p2_l4: 'أسماء ملفات صورك.', privacy_p2_l5: 'اختياراتك في التحرير أو استخدام الأدوات أو سلوك التصفح على الموقع.', privacy_p2_l6: 'معلومات الجهاز أو إصدار المتصفح أو دقة الشاشة.',
      privacy_p2_2: 'لأنه لا يوجد خادم خلفي يتلقى أو يخزّن بيانات المستخدمين، لا توجد قاعدة بيانات يمكن اختراقها أو بيعها أو استدعاؤها قضائياً. لا نستطيع مشاركة ما لا نملكه.',
      privacy_h2_3: '3. لا كوكيز', privacy_p3_1: 'لا يستخدم imgsfix كوكيز تتبع. لا نضع كوكيز خاصة بنا للتحليل أو الإعلان أو إدارة الجلسات أو أي غرض آخر. لا نستخدم كوكيز أطراف ثالثة.',
      privacy_p3_2: 'التخزين الوحيد الذي نستخدمه هو واجهة localStorage في المتصفح، وهي ليست كوكيز وتُوصف بالتفصيل في القسم 5 أدناه. للمعلومات الكاملة، يُرجى مراجعة سياسة الكوكيز المنفصلة.',
      privacy_h2_4: '4. لا خوادم ومعالجة من جهة العميل', privacy_p4_1: 'ليس لدى imgsfix خادم تطبيق يتلقى أو يعالج ملفاتك. عندما تستخدم أي أداة، يحدث الآتي:',
      privacy_p4_l1: 'تختار أو تفلِت ملفاً، يقرأه متصفحك إلى الذاكرة المحلية باستخدام File API.', privacy_p4_l2: 'تُرسم الصورة على عنصر canvas من HTML5.', privacy_p4_l3: 'JavaScript يعمل على جهازك يعالج بيانات البكسلات.', privacy_p4_l4: 'تُصدَّر النتيجة من canvas إلى ملف قابل للتنزيل، يُولَّد بالكامل في متصفحك.',
      privacy_p4_2: 'في أي لحظة لا يُنقل الملف عبر الشبكة. إذا أغلقت تبويب المتصفح، تُتلَف الصورة من الذاكرة. النسخة الوحيدة التي تبقى هي تلك التي تختار تنزيلها وحفظها على جهازك.',
      privacy_h2_5: '5. استخدام localStorage', privacy_p5_1: 'يستخدم imgsfix واجهة localStorage في المتصفح لتذكّر تفضيلين صغيرين:',
      privacy_p5_l1: 'تفضيل السمة (imgsfix_theme) \u2014 يخزّن ما إذا كنت تفضّل الوضع الفاتح أم الداكن.', privacy_p5_l2: 'تفضيل اللغة (imgsfix_lang) \u2014 يخزّن ما إذا كنت اخترت الإنجليزية أم العربية.',
      privacy_p5_2: 'تُخزَّن هذه القيم على جهازك فقط. لا تُنقل إلينا أو لأي طرف ثالث أبداً. لا تحتوي على معلومات شخصية \u2014 مجرد سلسلة قصيرة تشير إلى تفضيلك. يمكنك مسحها في أي وقت بمسح بيانات موقع متصفحك أو localStorage. راجع سياسة الكوكيز لتعليمات حول كيفية القيام بذلك.',
      privacy_h2_6: '6. لا تحليلات ولا تتبع من أطراف ثالثة', privacy_p6_1: 'لا يستخدم imgsfix أي خدمة تحليل. لا نضمّن Google Analytics أو Matomo أو Mixpanel أو Amplitude أو أي أداة قياس أخرى. لا نعرف كم شخصاً يزور الموقع أو أي الأدوات يستخدمون أو كم يبقون.',
      privacy_p6_2: 'كما لا نستخدم شبكات إعلانية أو بكسلات تسويق أو تضمينات وسائل تواصل أو أي سكربت طرف ثالث يمكنه تتبع سلوكك. لا توجد أزرار «مشاركة» تُنزف البيانات لمنصات التواصل، ولا أنظمة تعليقات تُنمّط الزوار.',
      privacy_p6_3: 'المورد الخارجي الوحيد الذي يحمّله الموقع هو صفحة أنماط خط Cairo من Google Fonts (راجع القسم 7).',
      privacy_h2_7: '7. خدمات الأطراف الثالثة', privacy_p7_1: 'الخدمة الخارجية الوحيدة التي يتفاعل معها imgsfix هي Google Fonts. يحمّل الموقع خط Cairo من fonts.googleapis.com و fonts.gstatic.com لتوفير طباعة متناسقة. قد تتلقى خوادم Google طلباً لملف الخط وقد تسجّل معلومات HTTP قياسية (مثل عنوان IP) كجزء من ذلك الطلب، وفقاً لسياسة الخصوصية الخاصة بـ Google.',
      privacy_p7_2: 'إذا كنت تفضّل عدم تحميل أي موارد خارجية، يمكن تهيئة متصفحك لحظر طلبات الخطوط الخارجية. سيلجأ imgsfix إلى خطوط نظامك الافتراضية ويستمر في العمل بشكل طبيعي. لا تُفقد أي وظيفة \u2014 فقط تتغير الطباعة.',
      privacy_p7_3: 'بجانب Google Fonts، يحمّل imgsfix مكتبة Fabric.js من CDN (cdnjs) للمحرر المتقدم. هذا ملف JavaScript ثابت ولا يتضمن أي تتبع.',
      privacy_h2_8: '8. حقوقك', privacy_p8_1: 'لأن imgsfix لا يجمع أو يخزّن أي بيانات شخصية، فإن حقوق البيانات التقليدية (مثل الوصول أو التصحيح أو الحذف أو نقل بياناتك) محققة فعلياً بالفعل \u2014 لا توجد بيانات عنك لنقدمها أو نصححها أو نحذفها. ومع ذلك، تحتفظ بالتحكم الكامل في الآتي:',
      privacy_p8_l1: 'التفضيلات المحلية: يمكنك مسح تفضيلاتك للسمة واللغة في أي وقت عبر إعدادات متصفحك.', privacy_p8_l2: 'صورك: أنت تقرر أي الصور تعالج وما إذا كنت ستنزّل النتائج. لا يُحتفَظ بأي شيء بواسطة الموقع.', privacy_p8_l3: 'الموارد الخارجية: يمكنك حظر Google Fonts أو موارد خارجية أخرى باستخدام إضافات المتصفح أو حاجبات المحتوى دون التأثير على الوظائف الأساسية.', privacy_p8_l4: 'استخدام الخدمة: يمكنك التوقف عن استخدام imgsfix في أي وقت. لأنه لا يوجد حساب أو بيانات، لا شيء يُلغى أو يُحذف.',
      privacy_h2_9: '9. خصوصية الأطفال', privacy_p9_1: 'imgsfix مناسب لمستخدمين من جميع الأعمار. لأننا لا نجمع أي معلومات شخصية ولا نطلب حساباً، فإن الخدمة آمنة للأطفال للاستخدام تحت إشراف بالغ. لا نجمع عمداً أي معلومات من الأطفال أو أي مستخدم آخر، ولا توجد آلية يمكن من خلالها للطفل الإفصاح عن بيانات شخصية لنا عبر الموقع.',
      privacy_h2_10: '10. التغييرات على هذه السياسة', privacy_p10_1: 'إذا أجرينا تغييرات جوهرية على سياسة الخصوصية هذه، سنحدّث تاريخ «آخر تحديث» في أعلى هذه الصفحة. لأن البنية الأساسية لـ imgsfix \u2014 معالجة من جهة العميل دون جمع بيانات \u2014 جوهرية للمشروع، لا نتوقع تغييرات تُغيّر هذا النهج. أي تغييرات مستقبلية ستُوثَّق بشفافية هنا.',
      privacy_h2_11: '11. معلومات الاتصال', privacy_p11_1: 'إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه أو ممارسات بيانات imgsfix، يُرجى زيارة صفحة الاتصال بنا. يمكنك أيضاً إيجاد إجابات سريعة لأسئلة الخصوصية الشائعة في الأسئلة الشائعة، ومزيد من التفاصيل حول التخزين المحلي في سياسة الكوكيز.',
      // terms detailed
      terms_last_updated: 'آخر تحديث: يوليو 2026', terms_welcome: 'مرحباً بك في imgsfix. بدخولك أو استخدامك لهذا الموقع وأدواته، فإنك توافق على الالتزام بشروط الاستخدام هذه. إذا لم توافق على أي جزء من هذه الشروط، يُرجى عدم استخدام الخدمة. صُمِّمت هذه الشروط لتكون واضحة وعادلة \u2014 imgsfix أداة مجانية تركز على الخصوصية، وتعكس هذه الشروط تلك البساطة.',
      terms_h2_1: '1. قبول الشروط', terms_p1_1: 'باستخدامك imgsfix \u2014 بما في ذلك أي من أدوات الصور أو قارئ QR والباركود أو المحرر المتقدم \u2014 فإنك تقرّ بأنك قرأت وفهمت ووافقت على شروط الاستخدام هذه وسياسة الخصوصية. تشكل هذه الشروط اتفاقاً ملزماً قانونياً بينك وبين imgsfix. إذا كنت تستخدم الخدمة نيابة عن مؤسسة، فإنك تمثّل أن لديك الصلاحية لإلزام تلك المؤسسة بهذه الشروط.',
      terms_p1_2: 'إذا لم توافق على هذه الشروط، يجب أن تتوقف عن استخدام الخدمة فوراً. لأن imgsfix لا يتطلب حساباً أو تسجيلاً، فإن استخدامك للأدوات نفسه يشكل قبولاً.',
      terms_h2_2: '2. استخدام الخدمة', terms_p2_1: 'يمنحك imgsfix ترخيصاً مجانياً غير حصري وغير قابل للتحويل لاستخدام الموقع وأدواته للأغراض الشخصية والتجارية. يمكنك استخدام الخدمة لمعالجة وتحرير وتحويل الصور التي تملكها أو لديك حق استخدامها.',
      terms_h3_permitted: 'الاستخدام المسموح', terms_permitted_l1: 'معالجة الصور لمشاريع شخصية أو تعليمية أو تجارية.', terms_permitted_l2: 'استخدام قارئ QR لمسح الرموز التي لديك حق الوصول إليها.', terms_permitted_l3: 'استخدام المحرر المتقدم لإنشاء تصاميم وتركيبات أصلية.', terms_permitted_l4: 'تنزيل واستخدام ملفات المخرجات في أي سياق، بدون حقوق ملكية.',
      terms_h3_prohibited: 'الاستخدام المحظور', terms_prohibited_l1: 'استخدام imgsfix لمعالجة صور لا تملك حق استخدامها، بما في ذلك المواد المحمية بحقوق الطبع التي لا تملكها أو ليس لديك إذن باستخدامها.', terms_prohibited_l2: 'استخدام الخدمة لأي غرض غير قانوني أو بانتهاك القوانين المعمول بها.', terms_prohibited_l3: 'محاولة الهندسة العكسية أو فك التجميع أو استغلال الخدمة لأغراض خبيثة.', terms_prohibited_l4: 'استخدام سكربتات آلية أو بوتات للوصول إلى الخدمة بطريقة تعطل توافرها للآخرين.', terms_prohibited_l5: 'استخدام مخرجات الأدوات بطريقة تنتهك حقوق أطراف ثالثة.',
      terms_p2_2: 'أنت وحدك مسؤول عن الصور التي تعالجها والمحتوى الذي تنشئه باستخدام imgsfix. لا نراقب أو نراجع نشاط المستخدمين \u2014 لأننا لا نستطيع، إذ لا تصلنا أي بيانات \u2014 لكنك تبقى مسؤولاً عن استخدامك الخاص للخدمة.',
      terms_h2_3: '3. الملكية الفكرية', terms_p3_1: 'موقع imgsfix، بما في ذلك تصميمه وكوده وأدواته وعلامته التجارية، هو ملكية فكرية لمبتكريه. تُقدَّم البرمجية لاستخدامك مجاناً، لكن هذا لا يشكل نقلاً للملكية. لا يمكنك المطالبة بعلامة imgsfix أو شعارها أو تصميم موقعها كملك لك.',
      terms_p3_2: 'الصور والملفات التي تعالجها باستخدام imgsfix تبقى ملكك. لا نطالب بأي ملكية أو ترخيص أو حقوق لأي محتوى تنشئه أو تحرّره أو تنزّله عبر الخدمة. مخرج كل أداة \u2014 الصور المضغوطة والمغيَّرة حجمها والمحوَّلة والمقصوصة والتصاميم المحرّرة \u2014 ملكك بالكامل. لا نضيف علامات مائية أو ندمج بيانات وصفية تدّعي التأليف أو نحتفظ بأي نسخة من عملك.',
      terms_h2_4: '4. إخلاء الضمانات', terms_p4_1: 'يُقدَّم imgsfix «كما هو» و«كما هو متاح» دون ضمانات من أي نوع، سواء صريحة أو ضمنية. بأقصى حد يسمح به القانون المعمول به، نتنصل من جميع الضمانات، بما في ذلك على سبيل المثال لا الحصر:',
      terms_p4_l1: 'الضمانات الضمنية للقابلية للتسويق والملاءمة لغرض معين.', terms_p4_l2: 'ضمانات أن الخدمة ستكون متواصلة أو خالية من الأخطاء أو آمنة.', terms_p4_l3: 'ضمانات تتعلق بدقة أو موثوقية أو جودة النتائج التي تنتجها الأدوات.', terms_p4_l4: 'ضمانات أن الخدمة ستلبي متطلباتك أو توقعاتك المحددة.',
      terms_p4_2: 'لأن كل المعالجة تجري في متصفحك باستخدام قدراته المدمجة، فقد تختلف جودة وأداء الأدوات حسب جهازك ومتصفحك والصورة المحددة التي تُعالَج. تستخدم الخدمة على مسؤوليتك الخاصة وتكون مسؤولاً عن التحقق من ملاءمة المخرج لغرضك المقصود.',
      terms_h2_5: '5. تحديد المسؤولية', terms_p5_1: 'بأقصى حد يسمح به القانون المعمول به، لن يكون imgsfix ومبتكروه مسؤولين عن أي أضرار مباشرة أو غير مباشرة أو عرضية أو خاصة أو تبعية أو عقابية تنشأ عن أو تتعلق باستخدامك أو عدم قدرتك على استخدام الخدمة. يشمل ذلك، على سبيل المثال لا الحصر:',
      terms_p5_l1: 'فقدان البيانات أو الصور أو الأرباح.', terms_p5_l2: 'انقطاع الأعمال أو فقدان معلومات الأعمال.', terms_p5_l3: 'أضرار ناتجة عن استخدام أو عدم القدرة على استخدام الخدمة.', terms_p5_l4: 'أضرار ناتجة عن أخطاء أو سهو أو عدم دقة في المخرج الذي تنتجه الأدوات.',
      terms_p5_2: 'لأن imgsfix خدمة مجانية تُقدَّم بدون رسوم، فإنك توافق على أن هذا التحديد للمسؤولية هو توزيع عادل ومعقول للمخاطرة. يُشجَّع على الاحتفاظ بنسخ احتياطية من صورك الأصلية والتحقق من نتائج أي معالجة قبل الاعتماد عليها لأغراض مهمة.',
      terms_h2_6: '6. التغييرات على هذه الشروط', terms_p6_1: 'نحتفظ بالحق في تعديل شروط الاستخدام هذه في أي وقت. عندما نفعل، سنحدّث تاريخ «آخر تحديث» في أعلى هذه الصفحة. تسري التغييرات فور النشر. من مسؤوليتك مراجعة هذه الشروط دورياً للتحديثات.',
      terms_p6_2: 'استمرار استخدام imgsfix بعد نشر التغييرات يشكل قبولك للشروط المعدّلة. إذا لم توافق على الشروط المحدّثة، يجب أن تتوقف عن استخدام الخدمة. نظراً للطبيعة الأساسية لـ imgsfix \u2014 مجاني، خاص، من جهة العميل \u2014 لا نتوقع تغييرات جوهرية على الشروط الأساسية.',
      terms_h2_7: '7. القانون الحاكم', terms_p7_1: 'تخضع شروط الاستخدام هذه للقانون المعمول به وتُفسَّر وفقاً له، دون مراعاة لمبادئ تعارض القوانين. تُحَلّ أي نزاعات تنشأ عن أو تتعلق باستخدامك لـ imgsfix في المحاكم المختصة في الولاية التي تُشغَّل فيها الخدمة.',
      terms_p7_2: 'إذا وُجد أن أي حكم من هذه الشروط غير قابل للإنفاذ أو غير صالح من قبل محكمة مختصة، يُحَدّ أو يُلغى ذلك الحكم بأدنى حد ضروري، وتبقى الأحكام المتبقية سارية المفعول بالكامل.',
      terms_h2_8: '8. الاتصال', terms_p8_1: 'إذا كان لديك أي أسئلة أو مخاوف حول شروط الاستخدام هذه، يُرجى زيارة صفحة الاتصال بنا. قد تجد أيضاً معلومات مفيدة في الأسئلة الشائعة وسياسة الخصوصية وإخلاء المسؤولية.',
      // cookies detailed
      cookies_last_updated: 'آخر تحديث: يوليو 2026', cookies_short_label: 'الخلاصة:', cookies_short_text: 'لا يضع imgsfix كوكيز تتبع من أي نوع. التخزين المحلي الوحيد الذي نستخدمه هو إدخالين صغيرين في localStorage لمتصفحك لتذكّر سمتك (فاتح/داكن) ولغتك (إنجليزي/عربي). هذا التخزين لا يغادر جهازك أبداً ولا يحتوي على معلومات شخصية. يمكنك مسحه في أي وقت.',
      cookies_h2_1: '1. لا كوكيز تتبع', cookies_p1_1: 'لا يستخدم imgsfix الكوكيز لتتبعك. لا نضع كوكيز خاصة بنا للتحليل أو الإعلان أو إدارة الجلسات أو التخصيص أو أي غرض آخر. لا نضع كوكيز أطراف ثالثة على جهازك. لا توجد لافتة كوكيز أو نافذة موافقة على imgsfix لأنه لا توجد كوكيز تتبع للموافقة عليها.',
      cookies_p1_2: 'العديد من المواقع تستخدم الكوكيز لتذكّر من أنت أو قياس سلوكك أو عرض إعلانات مستهدفة أو تتبعك عبر الويب. imgsfix لا يفعل أيًا من هذا. ليس لدينا أدوات تحليل أو شبكات إعلانية أو تكاملات وسائل تواصل أو بكسلات إعادة تسويق \u2014 وبالتالي لا حاجة للكوكيز التي تشغلها.',
      cookies_h2_2: '2. localStorage للتفضيلات فقط', cookies_p2_1: 'بدلاً من الكوكيز، يستخدم imgsfix واجهة localStorage في المتصفح لتذكّر تفضيلين صغيرين. localStorage ميزة في المتصفح تتيح لموقع تخزين كميات صغيرة من البيانات على جهازك. على عكس الكوكيز، لا تُرسل بيانات localStorage تلقائياً إلى خادم مع كل طلب \u2014 تبقى على جهازك ولا يقرؤها إلا الصفحة التي أنشأتها.',
      cookies_p2_2: 'العنصران اللذان نخزّنهما هما:',
      cookies_p2_l1: 'imgsfix_theme \u2014 كلمة واحدة، إما "light" أو "dark"، تسجّل أي سمة بصرية اخترتها. هذا يتيح للموقع التحميل بسمتك المفضلة في زيارتك القادمة.', cookies_p2_l2: 'imgsfix_lang \u2014 كلمة واحدة، إما "en" أو "ar"، تسجّل ما إذا كنت اخترت الإنجليزية أم العربية. هذا يتيح للموقع العرض بلغتك المفضلة تلقائياً.',
      cookies_p2_3: 'هذه هي القائمة الكاملة. لا تحتوي هذه القيم على معلومات شخصية \u2014 هي سلاسل قصيرة تصف تفضيلاً بصرياً. لا تُنقل إلينا أو لأي طرف ثالث أبداً. وجودها فقط لتجربة أكثر راحة، ويمكنك حذفها في أي وقت دون التأثير على وظائف أي أداة.',
      cookies_h2_3: '3. Google Fonts', cookies_p3_1: 'يحمّل imgsfix خط Cairo من Google Fonts (fonts.googleapis.com و fonts.gstatic.com). عندما يطلب متصفحك صفحة الأنماط وملفات الخط، قد تضع خوادم Google كوكيز على جهازك وفقاً لممارسات الخصوصية الخاصة بـ Google. تتحكم Google في هذه الكوكيز، لا imgsfix، ولا نملك أي وصول إليها.',
      cookies_p3_2: 'إذا كنت تفضّل عدم تلقي أي كوكيز من Google، يمكنك:', cookies_p3_l1: 'حظر الخطوط الخارجية في إعدادات متصفحك أو باستخدام إضافة حاجب محتوى.', cookies_p3_l2: 'استخدام إضافة متصفح تحظر الطلبات إلى نطاقات Google Fonts.', cookies_p3_l3: 'تهيئة متصفحك لحظر كوكيز الأطراف الثالثة بالكامل.',
      cookies_p3_4: 'إذا حُظرت Google Fonts، سيلجأ imgsfix إلى خطوط نظامك الافتراضية. ستستمر جميع الأدوات والميزات في العمل بشكل طبيعي \u2014 فقط تتغير الطباعة.',
      cookies_p3_5: 'لمزيد حول ممارسات بيانات Google، يُرجى الرجوع إلى سياسة الخصوصية الخاصة بـ Google.',
      cookies_h2_4: '4. كيفية عرض ومسح localStorage', cookies_p4_1: 'لأن تفضيلاتك مخزّنة محلياً على جهازك، فلديك تحكم كامل بها. إليك كيفية عرض ومسح localStorage الخاص بـ imgsfix في المتصفحات الشائعة:',
      cookies_h3_chrome: 'Google Chrome / Microsoft Edge', cookies_chrome_l1: 'افتح imgsfix، ثم اضغط F12 أو Ctrl+Shift+I (Cmd+Option+I على Mac) لفتح أدوات المطوّر.', cookies_chrome_l2: 'اذهب إلى تبويب Application.', cookies_chrome_l3: 'في الشريط الجانبي الأيسر، وسّع Local Storage واختر موقع imgsfix.', cookies_chrome_l4: 'سترى imgsfix_theme و imgsfix_lang. انقر بزر الفأرة الأيمن واختر Clear لإزالتها.',
      cookies_h3_firefox: 'Mozilla Firefox', cookies_firefox_l1: 'افتح imgsfix، ثم اضغط F12 أو Ctrl+Shift+I (Cmd+Option+I على Mac) لفتح أدوات المطوّر.', cookies_firefox_l2: 'اذهب إلى تبويب Storage.', cookies_firefox_l3: 'وسّع Local Storage واختر موقع imgsfix.', cookies_firefox_l4: 'سترى الإدخالات المخزّنة. انقر بزر الفأرة الأيمن واختر Delete لإزالتها.',
      cookies_h3_safari: 'Apple Safari', cookies_safari_l1: 'افتح imgsfix، ثم اضغط Cmd+Option+I لفتح مفتش الويب.', cookies_safari_l2: 'اذهب إلى تبويب Storage.', cookies_safari_l3: 'وسّع Local Storage واختر موقع imgsfix.', cookies_safari_l4: 'اختر الإدخالات واضغط Delete لإزالتها.',
      cookies_h3_clearing: 'مسح جميع بيانات الموقع', cookies_clearing_p1: 'يمكنك أيضاً مسح كل localStorage لكل المواقع دفعة واحدة عبر إعدادات الخصوصية في متصفحك:',
      cookies_clearing_l1: 'Chrome: الإعدادات ← الخصوصية والأمان ← مسح بيانات التصفح ← الصور وملفات التخزين المؤقت / الكوكيز وبيانات الموقع.', cookies_clearing_l2: 'Firefox: الإعدادات ← الخصوصية والأمان ← الكوكيز وبيانات الموقع ← مسح البيانات.', cookies_clearing_l3: 'Safari: التفضيلات ← الخصوصية ← إدارة بيانات الموقع ← إزالة الكل.', cookies_clearing_l4: 'Edge: الإعدادات ← الكوكيز وأذونات الموقع ← إدارة وحذف الكوكيز وبيانات الموقع.',
      cookies_h2_5: '5. تحكمك في تفضيلاتك', cookies_p5_1: 'أنت دائماً تتحكم في تجربتك مع imgsfix. تفضيلاتك للسمة واللغة هي تسهيلات اختيارية \u2014 الأدوات تعمل بشكل مثالي بدونها. إذا مسحت localStorage، فسيستخدم الموقع ببساطة افتراضاته (السمة الفاتحة ولغة متصفحك المكتشفة) حتى تختار مرة أخرى.',
      cookies_p5_2: 'لا يوجد حساب لحذفه، ولا بيانات لتصديرها، ولا سجل تتبع لمراجعته، لأن أياً من هذه الأشياء غير موجود. علاقتك مع imgsfix بسيطة قدر الإمكان: تستخدم الأدوات، تبقى صورك على جهازك، والشيء الوحيد الذي يتذكّره الموقع هو كيف تحب أن يبدو.',
      cookies_h2_6: '6. التغييرات على هذه السياسة', cookies_p6_1: 'إذا غيّرنا أبداً ممارساتنا للكوكيز أو التخزين، سنحدّث هذه الصفحة ونراجع تاريخ «آخر تحديث». نظراً لأن التصميم الأساسي لـ imgsfix يتجنب الكوكيز تماماً، لا نتوقع تغييرات من شأنها إدخال التتبع. أي تغيير مستقبلي ستُوثَّق بوضوح هنا.',
      cookies_h2_7: '7. الاتصال', cookies_p7_1: 'أسئلة حول سياسة الكوكيز هذه؟ زر صفحة الاتصال بنا للتواصل، أو اقرأ سياسة الخصوصية الكاملة للصورة المتكاملة لكيفية تعامل imgsfix (أو بالأحرى، عدم تعامله) مع بياناتك.',
      // disclaimer detailed
      disclaimer_note_label: 'يُرجى الانتباه:', disclaimer_note_text: 'imgsfix أداة مجانية تُقدَّم «كما هي» دون ضمانات من أي نوع. المعلومات والأدوات على هذا الموقع تُقدَّم للاستخدام العام والراحة، لا كنصيحة احترافية. أنت مسؤول عن صورك واستخدامك للنتائج.',
      disclaimer_h2_1: 'إخلاء المسؤولية العام', disclaimer_p1_1: 'تُقدَّم المعلومات والأدوات بواسطة imgsfix كخدمة عامة مجانية لمعالجة الصور للأغراض العامة. بينما نسعى لجعل الأدوات دقيقة وموثوقة ومفيدة، فإن imgsfix يُقدَّم على أساس «كما هو» و«كما هو متاح». لا نقدّم أي إقرارات أو ضمانات من أي نوع، صريحة أو ضمنية، حول اكتمال أو دقة أو موثوقية أو ملاءمة أو توافر الخدمة أو النتائج التي ينتجها.',
      disclaimer_p1_2: 'أي اعتماد تضعه على imgsfix أو أدواته أو مخرجاته يكون على مسؤوليتك الخاصة بالكامل. لن نكون مسؤولين عن أي فقدان أو ضرر من أي نوع ينشأ عن استخدام أو الاعتماد على الخدمة أو الصور التي ينتجها. يُشجَّع على التحقق من نتائج أي معالجة قبل استخدامها في سياقات تكون فيها الدقة حرجة.',
      disclaimer_h2_2: 'لا ضمان للنتائج', disclaimer_p2_1: 'تعالج أدوات imgsfix الصور باستخدام قدرات متصفحك المدمجة و HTML5 Canvas API. لأن النتائج تعتمد على عوامل خارج سيطرتنا \u2014 بما في ذلك متصفحك وقوة معالجة جهازك وخصائص صورتك المحددة والإعدادات التي تختارها \u2014 لا نستطيع ضمان أي نتيجة معينة.',
      disclaimer_p2_l1: 'تختلف نتائج الضغط حسب محتوى الصورة والصيغة وإعداد الجودة الذي تختاره.', disclaimer_p2_l2: 'يعمل إزالة الخلفية بشكل أفضل مع الخلفيات الصلبة المتباينة وقد لا ينتج نتائج نظيفة على الصور المعقدة.', disclaimer_p2_l3: 'التحويل إلى كرتون والمرشحات هي تحويلات أسلوبية ومخرجاتها ذاتية.', disclaimer_p2_l4: 'تعتمد تعديلات التحسين على جودة الصورة الأصلية وقد لا تستعيد بالكامل الصور التالفة أو منخفضة الدقة.', disclaimer_p2_l5: 'تعتمد دقة قارئ QR على وضوح الصورة والإضاءة ودعم المتصفح لواجهة BarcodeDetector API.',
      disclaimer_p2_2: 'نوصي بمراجعة مخرج كل أداة قبل الاعتماد عليه. إذا لم تُلبِّ النتيجة احتياجاتك، يمكنك ضبط الإعدادات والمحاولة مرة أخرى \u2014 لا حدّ لعدد مرات استخدام أي أداة، ولا تكلفة متضمنة.',
      disclaimer_h2_3: 'مسؤولية المستخدم عن الصور', disclaimer_p3_1: 'أنت وحدك مسؤول عن الصور التي تعالجها باستخدام imgsfix. باستخدامك الخدمة، تؤكد أن:',
      disclaimer_p3_l1: 'تملك الصور التي تعالجها، أو حصلت على الحقوق والأذونات اللازمة لاستخدامها وتعديلها.', disclaimer_p3_l2: 'استخدامك للصور والمخرجات المعالجة لا ينتهك حقوق الطبع أو العلامات التجارية أو الخصوصية أو حقوق أي طرف ثالث.', disclaimer_p3_l3: 'لن تستخدم imgsfix لمعالجة الصور لأي غرض غير قانوني أو احتيالي.',
      disclaimer_p3_2: 'لأن كل المعالجة تجري في متصفحك ولا تُنقل أي بيانات إلينا، لا نملك وسيلة لمراقبة أو مراجعة الصور التي تعالجها. هذا يعني أيضاً أننا لا نملك وسيلة لفرض هذه المسؤوليات \u2014 لكنه يعني أيضاً أن صورك تبقى خاصة بالكامل. مسؤولية الاستخدام القانوني والأخلاقي تقع عليك.',
      disclaimer_h2_4: 'ليست نصيحة احترافية', disclaimer_p4_1: 'تُقدَّم الأدوات والمحتوى على imgsfix لأغراض معالجة الصور العامة فقط. لا تشكل نصيحة احترافية من أي نوع. تحديداً:',
      disclaimer_p4_l1: 'imgsfix ليس بديلاً عن خدمات تحرير الصور أو التصميم الجرافيكي أو التصوير الاحترافية.', disclaimer_p4_l2: 'لا تقدّم الأدوات نصائح قانونية أو طبية أو مالية أو تقنية.', disclaimer_p4_l3: 'يجب التحقق من محتوى رموز QR والباركود بشكل مستقل \u2014 لا تتصرف بناءً على الروابط أو البيانات الممسوحة دون التأكد من أنها مشروعة وآمنة.', disclaimer_p4_l4: 'المحتوى في صفحات حول والخدمات والأسئلة الشائعة والسياسات معلوماتي ولا ينبغي اعتباره توجيهاً احترافياً.',
      disclaimer_p4_2: 'إذا كنت تتطلب نتائج أو نصائح احترافية لغرض محدد \u2014 كإنتاج الطباعة التجارية أو الوثائق القانونية أو مواد الأعمال الحرجة \u2014 فيجب استشارة مختص مناسب. imgsfix أداة مريحة ومجانية وخاصة، لكنها ليست بديلاً عن الخدمات الاحترافية عندما تكون مبررة.',
      disclaimer_h2_5: 'الاستخدام على مسؤوليتك الخاصة', disclaimer_p5_1: 'استخدامك لـ imgsfix على مسؤوليتك الخاصة بالكامل. بينما نعمل لضمان أن الخدمة آمنة وتعمل، لا نستطيع ضمان أنها ستكون خالية من الأخطاء أو البق أو الانقطاعات في جميع الأوقات. قد تؤثر تحديثات المتصفح أو قيود الجهاز أو ظروف الشبكة على الأداء أحياناً.',
      disclaimer_p5_2: 'لحماية نفسك، نوصي بـ:', disclaimer_p5_l1: 'الاحتفاظ بنسخ احتياطية من صورك الأصلية قبل معالجتها.', disclaimer_p5_l2: 'مراجعة النتائج المنزّلة قبل حذف أو استبدال أصولك.', disclaimer_p5_l3: 'استخدام متصفح مدعوم ومحدّث لأفضل تجربة.', disclaimer_p5_l4: 'اختبار الأدوات على صور غير حرجة أولاً إذا لم تكن متأكداً من أدائها.',
      disclaimer_h2_6: 'روابط خارجية', disclaimer_p6_1: 'قد يحتوي imgsfix على روابط لمواقع خارجية (مثل سياسة خصوصية Google) لا يُشغلها imgsfix. لا نملك أي سيطرة على محتوى وممارسات هذه المواقع الخارجية ولا نستطيع تحمّل المسؤولية عن سياسات الخصوصية أو شروط الاستخدام الخاصة بها. أنت تقرّ بأن imgsfix ليس مسؤولاً عن دقة أو موثوقية أي معلومات أو منتجات أو خدمات تُقدَّم على المواقع الخارجية.',
      disclaimer_h2_7: 'التغييرات على هذا الإخلاء', disclaimer_p7_1: 'نحتفظ بالحق في تحديث أو تعديل هذا الإخلاء في أي وقت. أي تغييرات ستُنشر على هذه الصفحة مع تاريخ «آخر تحديث» محدّث. استمرارك في استخدام imgsfix بعد نشر التغييرات يشكل إقرارك بالإخلاء المعدّل.',
      disclaimer_h2_8: 'الاتصال', disclaimer_p8_1: 'إذا كان لديك أي أسئلة حول هذا الإخلاء، يُرجى زيارة صفحة الاتصال بنا. قد تجد أيضاً معلومات ذات صلة في شروط الاستخدام وسياسة الخصوصية والأسئلة الشائعة.'
    }
  };

  var LS_THEME = 'imgsfix_theme';
  var LS_LANG = 'imgsfix_lang';
  var lang = localStorage.getItem(LS_LANG);
  if (!lang) {
    lang = (navigator.language && navigator.language.indexOf('ar') === 0) ? 'ar' : 'en';
  }

  function t(key) {
    return (I18N[lang] && I18N[lang][key]) || (I18N.en[key]) || key;
  }

  /* ----- theme ----- */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(LS_THEME, theme);
    $$('.theme-toggle .tt-track .light-icon').forEach(function (e) { e.style.opacity = theme === 'light' ? '0' : '1'; });
    $$('.theme-toggle .tt-track .dark-icon').forEach(function (e) { e.style.opacity = theme === 'dark' ? '0' : '1'; });
    var ti = $('.theme-indicator .ti-label');
    if (ti) ti.textContent = theme === 'dark' ? t('dark') : t('light');
  }
  function toggleTheme() {
    var cur = document.documentElement.getAttribute('data-theme');
    applyTheme(cur === 'dark' ? 'light' : 'dark');
  }

  /* ----- language ----- */
  function applyLanguage(l) {
    lang = l;
    localStorage.setItem(LS_LANG, l);
    document.documentElement.setAttribute('lang', l);
    document.documentElement.setAttribute('dir', l === 'ar' ? 'rtl' : 'ltr');
    $$('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var val = t(key);
      if (val) el.textContent = val;
    });
    $$('[data-i18n-ph]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-ph');
      var val = t(key);
      if (val) el.setAttribute('placeholder', val);
    });
    $$('.lang-switch button').forEach(function (b) {
      b.classList.toggle('active', b.dataset.lang === l);
    });
    document.dispatchEvent(new CustomEvent('imgsfix:langchange', { detail: { lang: l } }));
  }

  /* ----- toast ----- */
  var toastTimer;
  function toast(msg, kind) {
    var el = $('.toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'toast';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.className = 'toast show' + (kind ? ' ' + kind : '');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.className = 'toast' + (kind ? ' ' + kind : ''); }, 2800);
  }

  /* ----- header ----- */
  function buildHeader() {
    var h = document.createElement('header');
    h.className = 'site-header';
    h.setAttribute('role', 'banner');
    h.innerHTML =
      '<div class="container header-inner">' +
        '<a class="logo" href="' + link('index.html') + '" aria-label="imgsfix">' +
          '<span class="logo-mark">ifix</span>' +
          '<span class="logo-text">img<span>sfix</span></span>' +
        '</a>' +
        '<nav class="nav-links" aria-label="Main navigation">' +
          '<a href="' + link('index.html') + '" data-i18n="nav_home">Home</a>' +
          '<a href="' + link('index.html#tools') + '" data-i18n="nav_tools">Tools</a>' +
          '<a href="' + link('pages/advanced-editor.html') + '" data-i18n="nav_editor">Editor</a>' +
          '<a href="' + link('pages/qr-reader.html') + '" data-i18n="nav_qr">QR Reader</a>' +
          '<a href="' + link('pages/services.html') + '" data-i18n="nav_services">Services</a>' +
          '<a href="' + link('pages/about.html') + '" data-i18n="nav_about">About</a>' +
          '<a href="' + link('pages/faq.html') + '" data-i18n="nav_faq">FAQ</a>' +
          '<a href="' + link('pages/contact.html') + '" data-i18n="nav_contact">Contact</a>' +
        '</nav>' +
        '<div class="header-actions">' +
          '<div class="lang-switch hide-mobile" role="group" aria-label="Language">' +
            '<button data-lang="en">EN</button><button data-lang="ar">ع</button>' +
          '</div>' +
          '<button class="theme-toggle" aria-label="Toggle theme" title="Toggle theme">' +
            '<span class="tt-track"><span class="light-icon">☀</span><span class="dark-icon">☾</span></span>' +
            '<span class="tt-thumb">◐</span>' +
          '</button>' +
          '<a class="btn btn-primary btn-sm hide-mobile btn-labeled" href="' + link('index.html#tools') + '" data-i18n="cta_start">Start Editing</a>' +
          '<button class="menu-btn" aria-label="Open menu" aria-expanded="false"><span class="bars"><span></span><span></span><span></span></span></button>' +
        '</div>' +
      '</div>' +
      '<nav class="mobile-nav" aria-label="Mobile navigation">' +
        '<div class="mn-header">' +
          '<a class="logo" href="' + link('index.html') + '" aria-label="imgsfix">' +
            '<span class="logo-mark">ifix</span><span class="logo-text">img<span>sfix</span></span>' +
          '</a>' +
          '<button class="mn-close" aria-label="Close menu">\u00d7</button>' +
        '</div>' +
        '<div class="mn-body">' +
          '<a class="mn-link" href="' + link('index.html') + '" data-i18n="nav_home">Home</a>' +
          '<a class="mn-link" href="' + link('index.html#tools') + '" data-i18n="nav_tools">Tools</a>' +
          '<a class="mn-link" href="' + link('pages/advanced-editor.html') + '" data-i18n="nav_editor">Editor</a>' +
          '<a class="mn-link" href="' + link('pages/qr-reader.html') + '" data-i18n="nav_qr">QR Reader</a>' +
          '<a class="mn-link" href="' + link('pages/services.html') + '" data-i18n="nav_services">Services</a>' +
          '<a class="mn-link" href="' + link('pages/about.html') + '" data-i18n="nav_about">About</a>' +
          '<a class="mn-link" href="' + link('pages/faq.html') + '" data-i18n="nav_faq">FAQ</a>' +
          '<a class="mn-link" href="' + link('pages/contact.html') + '" data-i18n="nav_contact">Contact</a>' +
        '</div>' +
        '<div class="mn-actions">' +
          '<div class="lang-switch" role="group" aria-label="Language">' +
            '<button data-lang="en">EN</button><button data-lang="ar">ع</button>' +
          '</div>' +
          '<a class="btn btn-primary btn-block" href="' + link('index.html#tools') + '" data-i18n="cta_start">Start Editing</a>' +
        '</div>' +
      '</nav>';
    document.body.insertBefore(h, document.body.firstChild);
    // events
    $$('.theme-toggle').forEach(function (b) { b.addEventListener('click', toggleTheme); });
    $$('.lang-switch button').forEach(function (b) { b.addEventListener('click', function () { applyLanguage(b.dataset.lang); }); });
    var mb = $('.menu-btn', h);
    var mn = $('.mobile-nav', h);
    var mc = $('.mn-close', h);
    if (mb && mn) {
      function closeMenu() { mn.classList.remove('open'); mb.classList.remove('open'); mb.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; }
      function openMenu() { mn.classList.add('open'); mb.classList.add('open'); mb.setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden'; }
      mb.addEventListener('click', function () { mn.classList.contains('open') ? closeMenu() : openMenu(); });
      if (mc) mc.addEventListener('click', closeMenu);
      $$('a', mn).forEach(function (a) { a.addEventListener('click', closeMenu); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && mn.classList.contains('open')) closeMenu(); });
    }
    // active link
    var path = location.pathname.split('/').pop() || 'index.html';
    $$('.nav-links a, .mobile-nav a.mn-link').forEach(function (a) {
      var href = a.getAttribute('href') || '';
      var tail = href.split('/').pop();
      if (tail === path) a.classList.add('active');
    });
  }

  /* ----- footer ----- */
  function buildFooter() {
    var f = document.createElement('footer');
    f.className = 'site-footer';
    f.setAttribute('role', 'contentinfo');
    f.innerHTML =
      '<div class="container">' +
        '<div class="footer-grid">' +
          '<div class="footer-brand">' +
            '<a class="logo" href="' + link('index.html') + '">' +
              '<span class="logo-mark">ifix</span><span class="logo-text">img<span>sfix</span></span>' +
            '</a>' +
            '<p data-i18n="footer_about">imgsfix is a privacy-focused, 100% client-side image toolkit. Everything happens in your browser — no uploads, no servers, no tracking.</p>' +
            '<div class="social-icons" style="margin-top:16px">' +
              '<a href="#" onclick="return false;" aria-label="Facebook" title="Facebook"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.69.24 2.69.24v2.97h-1.52c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z"/></svg></a>' +
              '<a href="#" onclick="return false;" aria-label="Instagram" title="Instagram"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.31-1.46.72-2.13 1.38C1.35 2.68.94 3.35.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.79.72 1.46 1.38 2.13.67.67 1.34 1.08 2.13 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.79-.31 1.46-.72 2.13-1.38.67-.67 1.08-1.34 1.38-2.13.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91-.31-.79-.72-1.46-1.38-2.13C21.32 1.35 20.65.94 19.86.63 19.1.33 18.22.13 16.95.07 15.67.01 15.26 0 12 0z"/><path d="M12 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zm0 10.16A4 4 0 1 1 16 12a4 4 0 0 1-4 4z"/><circle cx="18.41" cy="5.59" r="1.44"/></svg></a>' +
              '<a href="#" onclick="return false;" aria-label="X / Twitter" title="X / Twitter"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.45l8.6-9.83L0 1.15h7.6l5.24 6.93 6.06-6.93zm-1.29 19.5h2.04L6.48 3.24H4.29L17.61 20.65z"/></svg></a>' +
              '<a href="#" onclick="return false;" aria-label="LinkedIn" title="LinkedIn"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg></a>' +
              '<a href="#" onclick="return false;" aria-label="YouTube" title="YouTube"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.2C0 8.08 0 12 0 12s0 3.92.5 5.8a3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14C24 15.92 24 12 24 12s0-3.92-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z"/></svg></a>' +
              '<a href="#" onclick="return false;" aria-label="TikTok" title="TikTok"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.3 0 .6.04.88.13V9.4a6.33 6.33 0 0 0-1-.05A6.34 6.34 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43V8.69a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.12z"/></svg></a>' +
              '<a href="#" onclick="return false;" aria-label="Telegram" title="Telegram"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M11.94 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.06 0zm7.06 6.06c.16.13.2.36.1.54L14.9 16.5c-.1.18-.3.3-.5.3H10.6c-.2 0-.4-.12-.5-.3l-1.8-3.06 6.36-6.36-6.66 5.16-3.06-1.8c-.2-.12-.3-.34-.26-.56.04-.22.2-.4.42-.46L18.3 5.9c.24-.06.5 0 .7.16z"/></svg></a>' +
              '<a href="#" onclick="return false;" aria-label="WhatsApp" title="WhatsApp"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M17.5 14.38c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35zM12 2a10 10 0 0 0-8.6 15.06L2 22l5.06-1.33A10 10 0 1 0 12 2z"/></svg></a>' +
            '</div>' +
          '</div>' +
          '<div class="footer-col">' +
            '<h4 data-i18n="footer_tools_h">Tools</h4>' +
            '<ul>' +
              '<li><a href="' + link('pages/tools/compress.html') + '" data-i18n="t_compress_t">Compress</a></li>' +
              '<li><a href="' + link('pages/tools/resize.html') + '" data-i18n="t_resize_t">Resize</a></li>' +
              '<li><a href="' + link('pages/tools/convert.html') + '" data-i18n="t_convert_t">Convert</a></li>' +
              '<li><a href="' + link('pages/tools/crop.html') + '" data-i18n="t_crop_t">Crop</a></li>' +
              '<li><a href="' + link('pages/qr-reader.html') + '" data-i18n="nav_qr">QR Reader</a></li>' +
              '<li><a href="' + link('pages/advanced-editor.html') + '" data-i18n="nav_editor">Editor</a></li>' +
            '</ul>' +
          '</div>' +
          '<div class="footer-col">' +
            '<h4 data-i18n="footer_company">Company</h4>' +
            '<ul>' +
              '<li><a href="' + link('pages/about.html') + '" data-i18n="page_about">About</a></li>' +
              '<li><a href="' + link('pages/services.html') + '" data-i18n="page_services">Services</a></li>' +
              '<li><a href="' + link('pages/contact.html') + '" data-i18n="page_contact">Contact</a></li>' +
              '<li><a href="' + link('pages/faq.html') + '" data-i18n="page_faq">FAQ</a></li>' +
            '</ul>' +
          '</div>' +
          '<div class="footer-col">' +
            '<h4 data-i18n="footer_resources">Resources</h4>' +
            '<ul>' +
              '<li><a href="' + link('pages/privacy-policy.html') + '" data-i18n="footer_privacy">Privacy Policy</a></li>' +
              '<li><a href="' + link('pages/terms.html') + '" data-i18n="footer_terms">Terms of Use</a></li>' +
              '<li><a href="' + link('pages/cookies.html') + '" data-i18n="footer_cookies">Cookie Policy</a></li>' +
              '<li><a href="' + link('pages/disclaimer.html') + '" data-i18n="footer_disclaimer">Disclaimer</a></li>' +
            '</ul>' +
          '</div>' +
        '</div>' +
        '<div class="footer-bottom">' +
          '<span>© ' + new Date().getFullYear() + ' imgsfix. <span data-i18n="footer_rights">All rights reserved.</span></span>' +
          '<span class="fb-right">' +
            '<span class="theme-indicator"><span class="ti-dot"></span><span class="ti-label">Light</span></span>' +
            '<span data-i18n="footer_made">Made with care for privacy.</span>' +
          '</span>' +
        '</div>' +
      '</div>';
    document.body.appendChild(f);
  }

  /* ----- scroll-to-top ----- */
  function initScrollTop() {
    var btn = document.createElement('button');
    btn.className = 'scroll-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = '↑';
    document.body.appendChild(btn);
    window.addEventListener('scroll', function () {
      btn.classList.toggle('show', window.scrollY > 400);
    });
    btn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  /* ----- reveal on scroll ----- */
  function initReveal() {
    var els = $$('.reveal');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ----- FAQ accordion ----- */
  function initFaq() {
    $$('.faq-q').forEach(function (q) {
      q.addEventListener('click', function () {
        var item = q.closest('.faq-item');
        var a = $('.faq-a', item);
        var open = item.classList.toggle('open');
        a.style.maxHeight = open ? a.scrollHeight + 'px' : '0';
      });
    });
  }

  /* ----- contact form ----- */
  function initContactForm() {
    var form = $('#contactForm');
    if (!form) return;
    var ok = $('.form-success', form);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      $$('.form-field', form).forEach(function (f) {
        var inp = $('input,textarea', f);
        if (!inp) return;
        if (inp.value.trim() === '') { f.classList.add('invalid'); valid = false; }
        else { f.classList.remove('invalid'); }
        if (inp.type === 'email' && inp.value.trim() !== '') {
          if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(inp.value.trim())) { f.classList.add('invalid'); valid = false; }
        }
      });
      if (valid) {
        if (ok) ok.classList.add('show');
        form.reset();
        toast(t('tc_done'), 'ok');
      } else {
        toast('Please fill all fields correctly.', 'err');
      }
    });
  }

  /* ----- search filter ----- */
  function initSearch() {
    var box = $('.search-box input');
    if (!box) return;
    var grid = $('.tools-grid');
    if (!grid) return;
    var empty = $('.search-empty');
    box.addEventListener('input', function () {
      var q = box.value.toLowerCase().trim();
      var visible = 0;
      $$('.tool-card', grid).forEach(function (card) {
        var text = (card.textContent || '').toLowerCase();
        var match = q === '' || text.indexOf(q) !== -1;
        card.classList.toggle('hide', !match);
        if (match) visible++;
      });
      if (empty) empty.classList.toggle('hide', visible > 0);
    });
  }

  /* ----- modal helper ----- */
  function openModal(title, body, onConfirm) {
    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML =
      '<div class="modal-box" role="dialog" aria-modal="true">' +
        '<button class="modal-close" aria-label="Close">×</button>' +
        '<h3></h3><p></p>' +
        '<div class="modal-actions">' +
          '<button class="btn btn-secondary btn-sm modal-cancel" data-i18n="modal_cancel">Cancel</button>' +
          '<button class="btn btn-primary btn-sm modal-ok" data-i18n="modal_confirm">Confirm</button>' +
        '</div>' +
      '</div>';
    $('h3', overlay).textContent = title;
    $('p', overlay).textContent = body;
    document.body.appendChild(overlay);
    requestAnimationFrame(function () { overlay.classList.add('show'); });
    function close() { overlay.classList.remove('show'); setTimeout(function () { overlay.remove(); }, 250); }
    $('.modal-close', overlay).addEventListener('click', close);
    $('.modal-cancel', overlay).addEventListener('click', close);
    $('.modal-ok', overlay).addEventListener('click', function () { if (onConfirm) onConfirm(); close(); });
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
  }

  /* ----- init ----- */
  function init() {
    buildHeader();
    buildFooter();
    initScrollTop();
    var savedTheme = localStorage.getItem(LS_THEME) || 'light';
    applyTheme(savedTheme);
    applyLanguage(lang);
    initReveal();
    initFaq();
    initContactForm();
    initSearch();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  /* ----- public API ----- */
  window.imgsfix = {
    t: t, applyTheme: applyTheme, applyLanguage: applyLanguage, toggleTheme: toggleTheme,
    toast: toast, openModal: openModal, $: $, $$: $$, BASE: BASE, link: link,
    get lang() { return lang; }
  };

})();
