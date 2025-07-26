// ui.js

// 1) Read the API key from process.env (injected at build time)
const API_KEY = process.env.OPENAI_API_KEY;
console.log("🔑 Using OpenAI API key:", API_KEY?.slice(0, 5) + "…");

// 2) Set up your UI elements
console.log("✅ ui.js loaded");
const frameCount = document.getElementById("frame-count");
const frameList  = document.getElementById("frame-list");
const output     = document.getElementById("output");
const btnAnalyse = document.getElementById("analyze");
const btnReset   = document.getElementById("reset");
const btnFull    = document.getElementById("fullscreen");

let isFull = false;

// 3) Button handlers
btnAnalyse.onclick = () => {
  console.log("🔍 Analyse clicked");
  parent.postMessage({ pluginMessage: { type: "get-selection" } }, "*");
};

btnReset.onclick = () => {
  frameCount.textContent = "0 frames detected.";
  frameList.innerHTML  = "";
  output.innerHTML     = "<em>No analysis started…</em>";
  isFull = false;
  output.style.maxHeight = "120px";
};

btnFull.onclick = () => {
  isFull = !isFull;
  output.style.maxHeight = isFull ? "600px" : "120px";
  output.scrollTop = 0;
};

// 4) Message handler
onmessage = (evt) => {
  const msg = evt.data.pluginMessage;
  console.log("👈 ui got:", msg);

  if (msg.type === "selection-result") {
    // Update Step 1 & 2
    frameCount.textContent = `${msg.frames.length} frame${msg.frames.length===1?"":"s"} detected.`;
    frameList.innerHTML = msg.frames.map(f => `<li>${f}</li>`).join("");
    output.innerHTML = "<em>Analyzing with OpenAI…</em>";

    // 5) Fetch with injected API key
    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a helpful UX assistant." },
          { role: "user", content: `Analyze these texts:\n\n${msg.textBlocks.join("\n\n")}` }
        ],
        temperature: 0.3
      })
    })
    .then(r => r.json())
    .then(d => {
      const text = d.choices?.[0]?.message?.content || "⚠️ No response.";
      output.innerHTML = text.replace(/\n/g, "<br>");
    })
    .catch(e => {
      console.error("🚨 OpenAI fetch error:", e);
      output.innerHTML = "❌ Error contacting OpenAI.";
    });
  }
};
