// code.js — controller (no build step)

figma.showUI(__html__, { width: 300, height: 700 });

figma.ui.onmessage = async function(msg) {
  if (msg.type === "get-selection") {
    var sel = figma.currentPage.selection;
    if (sel.length === 0) {
      figma.notify("Please select at least one frame.");
      return;
    }
    var frameNames = sel.map(function(n) { return n.name; });
    var textBlocks = [];
    for (var i = 0; i < sel.length; i++) {
      var n = sel[i];
      if (n.findAll) {
        var texts = n.findAll(function(x) { return x.type === "TEXT"; });
        for (var j = 0; j < texts.length; j++) {
          textBlocks.push(texts[j].characters);
        }
      }
    }
    figma.ui.postMessage({ type: "selection-result", frames: frameNames, textBlocks: textBlocks });
  }

  if (msg.type === "analyze-openai") {
    // Send request to backend server
    try {
      var response = await fetch("http://localhost:3001/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frames: msg.frames, textBlocks: msg.textBlocks })
      });
      var data = await response.json();
      var text = (data.result) || "⚠️ No response.";
      figma.ui.postMessage({ type: "analysis-result", result: text });
    } catch (err) {
      console.error("Backend error:", err);
      figma.ui.postMessage({ type: "analysis-result", result: "❌ Error contacting backend server." });
    }
  }

  if (msg.type === "close-plugin") {
    figma.closePlugin();
  }
};
