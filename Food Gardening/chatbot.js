// Chatbot widget for all pages using DuckDuckGo proxy API
(function () {
  // Create widget HTML
  // This chatbot answers gardening questions. 🌱
  const info = document.createElement('div');
  info.id = 'chatbot-info';
  info.style = 'position:fixed;bottom:90px;right:24px;z-index:9999;background:#fffbe6;color:#388e3c;padding:8px 16px;border-radius:8px;box-shadow:0 2px 8px rgba(44,80,44,0.10);font-size:1em;font-weight:500;max-width:320px;display:none;';
  info.textContent = '💡 This chatbot answers gardening questions!';
  document.body.appendChild(info);

  const widget = document.createElement('div');
  widget.id = 'chatbot-widget';
  widget.innerHTML = `
    <button id="chatbot-toggle" aria-label="Toggle Chatbot" style="display:inline-block;">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="12" fill="#388e3c"/>
        <path d="M7 10.5C7 9.11929 8.11929 8 9.5 8H14.5C15.8807 8 17 9.11929 17 10.5V13.5C17 14.8807 15.8807 16 14.5 16H10.4142C10.149 16 9.89464 16.1054 9.70711 16.2929L8.35355 17.6464C8.15829 17.8417 7.84171 17.8417 7.64645 17.6464C7.45118 17.4512 7.45118 17.1346 7.64645 16.9393L8.29289 16.2929C8.10536 16.1054 8 15.851 8 15.5858V10.5Z" fill="#fff"/>
      </svg>
    </button>
    <div id="chatbot-box" style="display:none;">
      <div id="chatbot-header">
        <span>Ask me anything!</span>
        <button id="chatbot-close" aria-label="Close Chatbot">×</button>
      </div>
      <div id="chatbot-gardening-info" style="background:#fffbe6;color:#388e3c;padding:8px 16px;font-size:1em;font-weight:500;max-width:100%;border-bottom:1px solid #e6efe2;">💡 This chatbot answers gardening questions!</div>
      <div id="chatbot-messages"></div>
      <form id="chatbot-form">
        <input id="chatbot-input" type="text" placeholder="Type your question..." autocomplete="off" required />
        <button type="submit">Send</button>
      </form>
    </div>
  `;
  document.body.appendChild(widget);

  // Styles
  const style = document.createElement('style');
  style.textContent = `
    #chatbot-widget {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      font-family: inherit;
    }
    #chatbot-toggle {
      background: #388e3c;
      color: #fff;
      border: none;
      border-radius: 50%;
      width: 56px;
      height: 56px;
      font-size: 2em;
      box-shadow: 0 2px 8px rgba(44,80,44,0.13);
      cursor: pointer;
      transition: background 0.18s;
    }
    #chatbot-toggle:hover { background: #256029; }
    #chatbot-box {
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 4px 24px rgba(44,80,44,0.18);
      width: 340px;
      max-width: 95vw;
      padding: 0;
      margin-bottom: 8px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      animation: fadeIn 0.2s;
    }
    #chatbot-header {
      background: #388e3c;
      color: #fff;
      padding: 12px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
    }
    #chatbot-close {
      background: none;
      border: none;
      color: #fff;
      font-size: 1.3em;
      cursor: pointer;
    }
    #chatbot-messages {
      padding: 16px;
      height: 220px;
      overflow-y: auto;
      background: #f8fff3;
      font-size: 1em;
      flex: 1 1 auto;
    }
    #chatbot-form {
      display: flex;
      border-top: 1px solid #e6efe2;
      background: #f8fff3;
      padding: 10px;
    }
    #chatbot-input {
      flex: 1 1 auto;
      padding: 10px;
      border-radius: 6px;
      border: 1px solid #e6efe2;
      font-size: 1em;
      margin-right: 8px;
    }
    #chatbot-form button[type="submit"] {
      background: #388e3c;
      color: #fff;
      border: none;
      border-radius: 6px;
      padding: 0 18px;
      font-size: 1em;
      cursor: pointer;
      transition: background 0.18s;
    }
    #chatbot-form button[type="submit"]:hover { background: #256029; }
    .chatbot-user { color: #256029; margin-bottom: 2px; font-weight: 600; }
    .chatbot-bot { color: #0b2b11; margin-bottom: 12px; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: none; } }
  `;
  document.head.appendChild(style);

  // Show/hide logic
  const toggleBtn = widget.querySelector('#chatbot-toggle');
  const box = widget.querySelector('#chatbot-box');
  const closeBtn = widget.querySelector('#chatbot-close');
  toggleBtn.onclick = () => { box.style.display = 'block'; toggleBtn.style.display = 'none'; };
  toggleBtn.onclick = () => {
    box.style.display = 'block';
    toggleBtn.style.display = 'none';
    info.style.display = 'block';
  };
  closeBtn.onclick = () => {
    box.style.display = 'none';
    toggleBtn.style.display = 'inline-block';
    info.style.display = 'none';
  };

  // Chat logic
  const form = widget.querySelector('#chatbot-form');
  const input = widget.querySelector('#chatbot-input');
  const messages = widget.querySelector('#chatbot-messages');

  function addMessage(text, sender) {
    const div = document.createElement('div');
    div.className = sender === 'user' ? 'chatbot-user' : 'chatbot-bot';
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  form.addEventListener('submit', function(ev) {
    ev.preventDefault();
    const q = input.value.trim();
    if (!q) return;
    addMessage(q, 'user');
    input.value = '';
    addMessage('Thinking...', 'bot');
    // Prepend gardening context to the query
    const gardeningQuery = 'gardening: ' + q;
    fetch('http://localhost:3001/duckduckgo?q=' + encodeURIComponent(gardeningQuery))
      .then(r => r.json())
      .then(data => {
        messages.lastChild.textContent = data.answer || data.heading || 'No answer found.';
      })
      .catch(() => {
        messages.lastChild.textContent = 'Sorry, I could not get an answer.';
      });
  });
})();
