console.log("Email Writer Extension - Content Script Loaded");

// ==================== Helper functions ====================

function getSenderNameFromEmail() {
  // Try to find the sender of the original email (the one being replied to)
  // Common Gmail selectors: ".gD" (sender name in email header), ".from"
  const senderElement = document.querySelector('.gD, .from');
  if (senderElement) return senderElement.innerText.trim();
  return "";
}

function getRecipientNameFromCompose() {
  // The "To" field in compose window – input with aria-label="To"
  const toField = document.querySelector('input[aria-label="To"]');
  if (toField) {
    // The value may be "Name <email>" – try to extract just the name
    const value = toField.value;
    const match = value.match(/^([^<]+)/); // text before <
    return match ? match[1].trim() : value;
  }
  return "";
}

function getSubjectFromCompose() {
  const subjectField = document.querySelector('input[name="subjectbox"]');
  return subjectField ? subjectField.value : "";
}

function getEmailContent() {
  const selectors = [".h7", ".a3s.aiL", "gmail_quote", '[role="presentation"]'];
  for (const selector of selectors) {
    const content = document.querySelector(selector);
    if (content) {
      return content.innerText.trim();
    }
  }
  return "";
}

function findComposeToolbar() {
  const selectors = [".btC", ".aDh", '[role="toolbar]', ".gU.Up"];
  for (const selector of selectors) {
    const toolbar = document.querySelector(selector);
    if (toolbar) return toolbar;
  }
  return null;
}
function createAIButton() {
  const button = document.createElement("div");
  button.className = "T-I J-J5-Ji aoO v7 T-I-atl L3";
  button.style.marginRight = "8px";
  button.innerHTML = "AI Reply";
  button.setAttribute("role", "button");
  button.setAttribute("data-tooltip", "Generate AI Reply");
  return button;
}

// Popup Management
let popupIframe = null;

function openPopup(settings) {
  if(popupIframe) closePopup();

  popupIframe = document.createElement("iframe");
  popupIframe.src = chrome.runtime.getURL("popup.html");
  popupIframe.style.position = 'fixed';
  popupIframe.style.top = '100px';
  popupIframe.style.right = '20px';
  popupIframe.style.zIndex = '9999';
  popupIframe.style.width = '300px';
  popupIframe.style.height = 'auto';
  popupIframe.style.border = 'none';
  popupIframe.style.borderRadius = '8px';
  popupIframe.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
  popupIframe.style.background = 'transparent';
  document.body.appendChild(popupIframe);

  // Listen for messages from the popup
  window.addEventListener('message', handlePopupMessage);
}

function closePopup() {
  if (popupIframe) {
    popupIframe.remove();
    popupIframe = null;
  }
  window.removeEventListener('message', handlePopupMessage);
}

async function handlePopupMessage(event) {
  if (event.data.type === 'AI_REPLY_SETTINGS') {
    const settings = event.data.settings;
    // Get all the data from Gmail
    const emailContent = getEmailContent();
    const senderName = getSenderNameFromEmail();
    const receiverName = getRecipientNameFromCompose();
    const subject = getSubjectFromCompose();

    // Call the backend
    try {
      const response = await fetch("http://localhost:8080/api/email/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailContent,
          tone: settings.tone,
          senderName: senderName || undefined,
          receiverName: receiverName || undefined,
          subject: subject || undefined,
          includeNames: settings.includeNames,
          includeSignature: settings.includeSignature,
          keepFormatting: settings.keepFormatting
        })
      });

      if (!response.ok) throw new Error("API request failed");

      const generatedReply = await response.text();
      // Insert into compose box
      const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');
      if (composeBox) {
        composeBox.focus();
        document.execCommand("insertText", false, generatedReply);
      }

      // Notify popup that we're done
      window.postMessage({ type: 'AI_REPLY_COMPLETE' }, '*');
      closePopup();
    } catch (error) {
      console.error(error);
      alert("Failed to generate AI reply: " + error.message);
      closePopup();
    }
  } else if (event.data.type === 'CLOSE_POPUP') {
    closePopup();
  }
}



function injectButton() {
  const existingButton = document.querySelector(".ai-reply-button");
  if (existingButton) existingButton.remove();

  const toolbar = findComposeToolbar();
  if (!toolbar) {
    console.log("Toolbar not found");
    return;
  }

  console.log("Toolbar found, creating AI button");
  const button = createAIButton();
  button.classList.add("ai-reply-button");

  button.addEventListener("click", () => {
    // Instead of calling API directly, open popup for settings
    openPopup();
  });

  toolbar.insertBefore(button, toolbar.firstChild);
}

// Observe for compose window

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    const addedNodes = Array.from(mutation.addedNodes);
    const hasComposeElements = addedNodes.some(
      node =>
        node.nodeType === Node.ELEMENT_NODE &&
        (node.matches('.aDh, .btC, [role="dialog"]') ||
          node.querySelector('.aDh, .btC, [role="dialog"]'))
    );

    if (hasComposeElements) {
      console.log("Compose Window Detected");
      setTimeout(injectButton, 500); // Delay to ensure the compose window is fully loaded
    }
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
