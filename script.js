const chatLog = document.getElementById('chatLog');
const emptyState = document.getElementById('emptyState');
const composer = document.getElementById('composer');
const promptInput = document.getElementById('promptInput');
const sendBtn = document.getElementById('sendBtn');
const modelSelect = document.getElementById('modelSelect');
const clearBtn = document.getElementById('clearBtn');
const accountBox = document.getElementById('accountBox');
const accountName = document.getElementById('accountName');
const logoutBtn = document.getElementById('logoutBtn');
const signInBtn = document.getElementById('signInBtn');

// Full conversation history sent to the model on every turn.
let history = [];
let isStreaming = false;

marked.setOptions({ breaks: true, gfm: true });

function renderMarkdown(raw) {
  const html = marked.parse(raw || '');
  return DOMPurify.sanitize(html);
}

function autoGrow() {
  promptInput.style.height = 'auto';
  promptInput.style.height = Math.min(promptInput.scrollHeight, 160) + 'px';
}
promptInput.addEventListener('input', autoGrow);

function scrollToBottom() {
  chatLog.scrollTop = chatLog.scrollHeight;
}

function addUserMessage(text) {
  emptyState.style.display = 'none';
  const wrap = document.createElement('div');
  wrap.className = 'msg user';
  wrap.innerHTML = `<span class="msg-meta">You</span><div class="bubble"></div>`;
  wrap.querySelector('.bubble').textContent = text;
  chatLog.appendChild(wrap);
  scrollToBottom();
}

function addAssistantMessage(modelLabel) {
  const wrap = document.createElement('div');
  wrap.className = 'msg assistant';
  wrap.innerHTML = `<span class="msg-meta">${modelLabel}</span><div class="bubble cursor"></div>`;
  chatLog.appendChild(wrap);
  scrollToBottom();
  return wrap.querySelector('.bubble');
}

function setBusy(busy) {
  isStreaming = busy;
  sendBtn.disabled = busy;
  promptInput.disabled = busy;
}

async function sendMessage(text) {
  const modelId = modelSelect.value;
  const modelLabel = modelSelect.options[modelSelect.selectedIndex].textContent;

  history.push({ role: 'user', content: text });
  addUserMessage(text);

  const bubble = addAssistantMessage(modelLabel);
  setBusy(true);

  let full = '';
  try {
    const response = await puter.ai.chat(history, { model: modelId, stream: true });

    for await (const part of response) {
      if (part?.text) {
        full += part.text;
        bubble.innerHTML = renderMarkdown(full);
        scrollToBottom();
      }
    }

    bubble.classList.remove('cursor');

    if (!full.trim()) {
      bubble.innerHTML = '<span class="error-text">No response was returned. Try again or switch models.</span>';
    } else {
      history.push({ role: 'assistant', content: full });
    }
  } catch (err) {
    bubble.classList.remove('cursor');
    bubble.innerHTML = `<span class="error-text">Error: ${(err && err.message) ? err.message : 'Something went wrong. Please try again.'}</span>`;
  } finally {
    setBusy(false);
    promptInput.focus();
  }
}

composer.addEventListener('submit', (e) => {
  e.preventDefault();
  if (isStreaming) return;
  const text = promptInput.value.trim();
  if (!text) return;
  promptInput.value = '';
  autoGrow();
  sendMessage(text);
});

promptInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    composer.requestSubmit();
  }
});

clearBtn.addEventListener('click', () => {
  if (isStreaming) return;
  history = [];
  chatLog.innerHTML = '';
  chatLog.appendChild(emptyState);
  emptyState.style.display = 'block';
});

// Puter.js keeps exactly one signed-in account per browser — there is no
// API for multiple simultaneous accounts, so this reflects that single
// active session (with its own dedicated sign-in / log-out control).
async function refreshAccountUI() {
  if (puter.auth.isSignedIn()) {
    let label = 'Signed in';
    try {
      const user = await puter.auth.getUser();
      if (user && user.username) label = user.username;
    } catch (_) { /* keep fallback label */ }
    accountName.textContent = label;
    accountBox.hidden = false;
    signInBtn.hidden = true;
  } else {
    accountBox.hidden = true;
    signInBtn.hidden = false;
  }
}

logoutBtn.addEventListener('click', () => {
  puter.auth.signOut();
  refreshAccountUI();
});

signInBtn.addEventListener('click', async () => {
  try {
    await puter.auth.signIn();
  } catch (_) { /* user closed the popup */ }
  refreshAccountUI();
});

refreshAccountUI();
