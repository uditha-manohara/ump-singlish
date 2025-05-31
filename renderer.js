function copyText(id) {
  const textArea = document.getElementById(id);
  textArea.select();
  document.execCommand("copy");
  //alert("Copied: " + textArea.value);
}

window.onload = () => {
  document.getElementById("box1").focus();

  // Attach button event listeners AFTER DOM is ready
  document.getElementById("min-btn").addEventListener("click", () => {
    window.electronAPI.minimize();
  });

  document.getElementById("max-btn").addEventListener("click", () => {
    window.electronAPI.maximize();
  });

  document.getElementById("close-btn").addEventListener("click", () => {
    window.electronAPI.close();
  });

  document.getElementById("box1").addEventListener("input", () => {
    startText();     // Singlish ➜ Unicode
    startTextSf();   // Unicode ➜ Font
  });
};

// Toggle maximize icon (keep this outside to work anytime it's sent)
window.electronAPI?.onIsMaximized?.((isMaximized) => {
  const maxBtn = document.getElementById("max-btn");
  if (maxBtn) {
    maxBtn.textContent = isMaximized ? '🗗' : '☐';
  }
});

window.electronAPI?.onToggleSinhala?.((state) => {
  alert('Sinhala Typing: ' + (state ? 'Enabled' : 'Disabled'));
});
