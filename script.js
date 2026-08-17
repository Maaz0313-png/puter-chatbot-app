const chatLog = document.getElementById('chatLog');
const emptyState = document.getElementById('emptyState');
const composer = document.getElementById('composer');
const promptInput = document.getElementById('promptInput');
const sendBtn = document.getElementById('sendBtn');
const modelSelect = document.getElementById('modelSelect');
const clearBtn = document.getElementById('clearBtn');

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
