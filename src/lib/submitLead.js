// Google Apps Script Web App URL
// After deploying your Apps Script, paste the URL here:
const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbxS_wwL_xRG8vgSWvEhfS4JwliHhjIy2efccT-vJEqm_A8iuCV8RgjDyZ1rCGPN5sIa-w/exec'

/**
 * Submit lead data to Google Sheets via Apps Script Web App.
 * Uses text/plain to avoid CORS preflight (Apps Script doesn't send CORS headers on preflight).
 */
export async function submitLead(data) {
  if (!SHEETS_URL || SHEETS_URL === 'REPLACE_WITH_YOUR_APPS_SCRIPT_URL') {
    console.warn('submitLead: SHEETS_URL not configured')
    return
  }
  try {
    await fetch(SHEETS_URL, {
      method: 'POST',
      // text/plain avoids preflight; Apps Script parses e.postData.contents fine
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(data),
      mode: 'no-cors',
    })
  } catch (err) {
    // Silently fail — don't block the user experience
    console.error('submitLead error:', err)
  }
}
