document.addEventListener("DOMContentLoaded", () => {
  // Add a "Copy IOCs" button wherever you place an element with id="ioc-block"
  const ioc = document.getElementById("ioc-block");
  if (!ioc) return;

  const btn = document.createElement("button");
  btn.textContent = "Copy IOCs";
  btn.style.padding = "8px 12px";
  btn.style.borderRadius = "10px";
  btn.style.border = "1px solid rgba(255,255,255,0.15)";
  btn.style.background = "transparent";
  btn.style.cursor = "pointer";
  btn.style.marginBottom = "10px";

  btn.addEventListener("click", async () => {
    const text = ioc.innerText.trim();
    await navigator.clipboard.writeText(text);
    btn.textContent = "Copied ✅";
    setTimeout(() => (btn.textContent = "Copy IOCs"), 1200);
  });

  ioc.parentNode.insertBefore(btn, ioc);
});