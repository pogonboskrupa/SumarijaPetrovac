// ========================================
// 🚀 MAIN - Entry Points i Routing
// ========================================
// Google Apps Script za Šumarija API
// Deploy kao Web App: Deploy > New deployment > Web app
//
// Ovaj fajl sadrži glavne entry point funkcije (doGet, doPost, doOptions)
// i routing logiku za sve API endpoint-e

// Provjera da li su svi potrebni fajlovi uključeni u Apps Script projekat
function _checkRequiredFunctions() {
  var missing = [];
  var required = [
    'handleLogin', 'handleStats', 'handleDashboard', 'handleSortimenti',
    'handlePrimaci', 'handleOtpremaci', 'handleKupci', 'handleOdjeli',
    'handlePrimacDetail', 'handleOtpremacDetail', 'handlePrimacOdjeli',
    'handleOtpremacOdjeli', 'handleAddSjeca', 'handleAddOtprema',
    'handlePendingUnosi', 'handleMyPending', 'handleUpdatePending',
    'handleDeletePending', 'handleGetOdjeliList', 'handleMjesecniSortimenti',
    'handlePrimaciDaily', 'handleOtremaciDaily', 'handleDailyChart',
    'handleStanjeOdjela', 'handleSyncStanjeOdjela', 'handleSyncIndex',
    'createJsonResponse'
  ];
  for (var i = 0; i < required.length; i++) {
    try {
      if (typeof this[required[i]] !== 'function') {
        missing.push(required[i]);
      }
    } catch (e) {
      missing.push(required[i]);
    }
  }
  return missing;
}

// Glavni handler za sve zahtjeve
function doGet(e) {
  try {
    // Provjeri da li su svi potrebni fajlovi uključeni
    var missingFunctions = _checkRequiredFunctions();
    if (missingFunctions.length > 0) {
      Logger.log('GREŠKA: Nedostaju funkcije: ' + missingFunctions.join(', '));
      Logger.log('Provjerite da su svi .gs fajlovi dodani u Apps Script projekat:');
      Logger.log('- main.gs, api-handlers.gs, authentication.gs, config.gs, services.gs, utils-triggers.gs');
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Nedostaju funkcije: ' + missingFunctions.join(', ') + '. Provjerite da su svi .gs fajlovi (api-handlers.gs, authentication.gs, config.gs, services.gs, utils-triggers.gs) dodani u Apps Script projekat.'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    Logger.log('=== DOGET CALLED ===');
    Logger.log('Full e.parameter: ' + JSON.stringify(e.parameter));
    Logger.log('e.queryString: ' + e.queryString);

    const path = e.parameter.path;
    const callback = e.parameter.callback; // JSONP callback
    Logger.log('Extracted path: ' + path);

    // Ako nema path parametra, servirati HTML stranicu
    if (!path) {
      Logger.log('No path parameter - serving HTML');
      return HtmlService.createHtmlOutputFromFile('index')
        .setTitle('Šumarija - Aplikacija za praćenje drvne mase')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    }

    var result;
    if (path === 'login') {
      result = handleLogin(e.parameter.username, e.parameter.password);
    } else if (path === 'stats') {
      result = handleStats(e.parameter.year, e.parameter.username, e.parameter.password);
    } else if (path === 'dashboard') {
      result = handleDashboard(e.parameter.year, e.parameter.username, e.parameter.password);
    } else if (path === 'sortimenti') {
      result = handleSortimenti(e.parameter.year, e.parameter.username, e.parameter.password);
    } else if (path === 'primaci') {
      result = handlePrimaci(e.parameter.year, e.parameter.username, e.parameter.password);
    } else if (path === 'otpremaci') {
      result = handleOtpremaci(e.parameter.year, e.parameter.username, e.parameter.password);
    } else if (path === 'kupci') {
      result = handleKupci(e.parameter.year, e.parameter.username, e.parameter.password);
    } else if (path === 'odjeli') {
      result = handleOdjeli(e.parameter.year, e.parameter.username, e.parameter.password);
    } else if (path === 'primac-detail') {
      result = handlePrimacDetail(e.parameter.year, e.parameter.username, e.parameter.password);
    } else if (path === 'otpremac-detail') {
      result = handleOtpremacDetail(e.parameter.year, e.parameter.username, e.parameter.password);
    } else if (path === 'primac-odjeli') {
      result = handlePrimacOdjeli(e.parameter.year, e.parameter.username, e.parameter.password, e.parameter.limit);
    } else if (path === 'otpremac-odjeli') {
      result = handleOtpremacOdjeli(e.parameter.year, e.parameter.username, e.parameter.password, e.parameter.limit);
    } else if (path === 'odjeli-all') {
      result = handleOdjeliAll(e.parameter.year, e.parameter.username, e.parameter.password);
    } else if (path === 'primac-detail-admin') {
      result = handlePrimacDetailAdmin(e.parameter.year, e.parameter.username, e.parameter.password, e.parameter.primacName);
    } else if (path === 'primac-odjeli-admin') {
      result = handlePrimacOdjeliAdmin(e.parameter.year, e.parameter.username, e.parameter.password, e.parameter.primacName, e.parameter.limit);
    } else if (path === 'add-sjeca') {
      result = handleAddSjeca(e.parameter);
    } else if (path === 'add-otprema') {
      result = handleAddOtprema(e.parameter);
    } else if (path === 'pending-unosi') {
      result = handlePendingUnosi(e.parameter.year, e.parameter.username, e.parameter.password);
    } else if (path === 'my-pending') {
      result = handleMyPending(e.parameter.username, e.parameter.password, e.parameter.tip);
    } else if (path === 'update-pending') {
      result = handleUpdatePending(e.parameter);
    } else if (path === 'delete-pending') {
      result = handleDeletePending(e.parameter);
    } else if (path === 'get-odjeli-list') {
      result = handleGetOdjeliList();
    } else if (path === 'mjesecni-sortimenti') {
      result = handleMjesecniSortimenti(e.parameter.year, e.parameter.username, e.parameter.password);
    } else if (path === 'primaci-daily') {
      result = handlePrimaciDaily(e.parameter.year, e.parameter.month, e.parameter.username, e.parameter.password);
    } else if (path === 'otpremaci-daily') {
      result = handleOtremaciDaily(e.parameter.year, e.parameter.month, e.parameter.username, e.parameter.password);
    } else if (path === 'daily-chart') {
      result = handleDailyChart(e.parameter.year, e.parameter.month, e.parameter.username, e.parameter.password);
    } else if (path === 'stanje-odjela') {
      result = handleStanjeOdjela(e.parameter.username, e.parameter.password);
    } else if (path === 'sync-stanje-odjela') {
      result = handleSyncStanjeOdjela(e.parameter.username, e.parameter.password);
    } else if (path === 'sync-index') {
      result = handleSyncIndex(e.parameter.username, e.parameter.password);
    } else if (path === 'primaci-by-radiliste') {
      result = handlePrimaciByRadiliste(e.parameter.year, e.parameter.username, e.parameter.password);
    } else if (path === 'primaci-by-izvodjac') {
      result = handlePrimaciByIzvodjac(e.parameter.year, e.parameter.username, e.parameter.password);
    } else if (path === 'primaci-sortimenti-by-primac') {
      result = handlePrimaciSortimentiByPrimac(e.parameter.year, e.parameter.month, e.parameter.username, e.parameter.password);
    } else if (path === 'otpremaci-sortimenti-by-otpremac') {
      result = handleOtremaciSortimentiByOtpremac(e.parameter.year, e.parameter.month, e.parameter.username, e.parameter.password);
    } else if (path === 'primke') {
      result = handlePrimke(e.parameter.username, e.parameter.password);
    } else if (path === 'otpreme') {
      result = handleOtpreme(e.parameter.username, e.parameter.password);
    } else if (path === 'get_dinamika') {
      result = handleGetDinamika(e.parameter.year, e.parameter.username, e.parameter.password);
    } else if (path === 'manifest') {
      result = handleManifest();
    } else if (path === 'manifest_data') {
      result = handleManifestData(e.parameter.username, e.parameter.password);
    } else if (path === 'delta_primka') {
      result = handleDeltaPrimka(e.parameter.username, e.parameter.password, e.parameter.fromRow, e.parameter.toRow);
    } else if (path === 'delta_otprema') {
      result = handleDeltaOtprema(e.parameter.username, e.parameter.password, e.parameter.fromRow, e.parameter.toRow);
    } else if (path === 'save_dinamika') {
      Logger.log('save_dinamika endpoint called');
      Logger.log('Parameters: ' + JSON.stringify(e.parameter));
      result = handleSaveDinamika(e.parameter.username, e.parameter.password, e.parameter.godina, e.parameter.mjeseci);
    } else if (path === 'stanje-zaliha') {
      result = handleStanjeZaliha(e.parameter.username, e.parameter.password, e.parameter.poslovodja);
    } else if (path === 'poslovodja-aktivnost') {
      result = handlePoslovodjaAktivnost(e.parameter.username, e.parameter.password, e.parameter.radiliste);
    } else if (path === 'upload-image') {
      result = handleUploadImage(e.parameter.username, e.parameter.password, e.parameter.type, e.parameter.imageData);
    } else if (path === 'get-images') {
      result = handleGetImages(e.parameter.username, e.parameter.password);
    } else if (path === 'poslovodja-radilista') {
      result = handlePoslovodjaRadilista(e.parameter.username, e.parameter.password, e.parameter.poslovodja);
    } else {
      Logger.log('Unknown path: ' + path);
      result = createJsonResponse({ error: 'Unknown path: ' + path }, false);
    }

    // JSONP: ako je prisutan callback parametar, wrappuj odgovor
    if (callback && result) {
      var content = result.getContent();
      return ContentService.createTextOutput(callback + '(' + content + ')')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }

    return result;
  } catch (error) {
    Logger.log('doGet error: ' + error.toString());
    if (error instanceof ReferenceError) {
      var errorMsg = error.toString() + '. Provjerite da su svi .gs fajlovi (api-handlers.gs, authentication.gs, config.gs, services.gs, utils-triggers.gs) dodani u Apps Script projekat.';
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: errorMsg
      })).setMimeType(ContentService.MimeType.JSON);
    }
    return createJsonResponse({ error: error.toString() }, false);
  }
}

// ========================================
// OPTIONS Handler - CORS Preflight Support
// ========================================
// Handles OPTIONS preflight requests from browsers
// Required for CORS to work properly with cross-origin fetch
function doOptions(e) {
  Logger.log('=== DO OPTIONS CALLED (CORS Preflight) ===');

  // Return CORS headers for preflight requests
  const output = ContentService.createTextOutput('');
  output.setMimeType(ContentService.MimeType.JSON);

  // Try setHeader (V8 runtime), fallback if not available (Rhino)
  try {
    if (typeof output.setHeader === 'function') {
      output.setHeader('Access-Control-Allow-Origin', '*');
      output.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      output.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      output.setHeader('Access-Control-Max-Age', '86400'); // 24 hours cache
      Logger.log('[OPTIONS] CORS headers set successfully');
    } else {
      Logger.log('[OPTIONS] WARNING: setHeader not available');
    }
  } catch (e) {
    Logger.log('[OPTIONS] WARNING: setHeader failed: ' + e.toString());
  }

  return output;
}

// ========================================
// POST Handler
// ========================================
// Handles POST requests (save_dinamika, upload-image)
function doPost(e) {
  try {
    const path = e.parameter.path;
    const postData = JSON.parse(e.postData.contents);

    if (path === 'save_dinamika') {
      return handleSaveDinamika(postData);
    } else if (path === 'upload-image') {
      // Upload image via POST (base64 data is too large for GET URL)
      return handleUploadImage(
        postData.username,
        postData.password,
        postData.type,
        postData.imageData
      );
    }

    return createJsonResponse({ error: 'Unknown POST path' }, false);
  } catch (error) {
    Logger.log('doPost error: ' + error.toString());
    return createJsonResponse({ error: error.toString() }, false);
  }
}
