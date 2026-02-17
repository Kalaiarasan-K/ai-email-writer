// popup.js – runs inside the popup iframe
document.getElementById('generateBtn').addEventListener('click', async () => {
  const tone = document.getElementById('tone').value;
  const includeNames = document.getElementById('includeNames').checked;
  const includeSignature = document.getElementById('includeSignature').checked;
  const keepFormatting = document.getElementById('keepFormatting').checked;

  // Disable button and show "Generating..."
  const btn = document.getElementById('generateBtn');
  btn.disabled = true;
  btn.textContent = 'Generating...';

  // Send the settings to the content script via a custom event
  // (because the popup is isolated, we use postMessage to the parent window)
  window.parent.postMessage({
    type: 'AI_REPLY_SETTINGS',
    settings: { tone, includeNames, includeSignature, keepFormatting }
  }, '*');

  // The content script will handle the API call and close the popup
});

// Optional: close popup when receiving a success message
window.addEventListener('message', (event) => {
  if (event.data.type === 'AI_REPLY_COMPLETE') {
    window.parent.postMessage({ type: 'CLOSE_POPUP' }, '*');
  }
});