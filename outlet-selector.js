/* --------------------------------
   Shivneri Fresh — Category Selector (minimal logic)
   - Renders orbit pills (same UI)
   - Select one category
   - Enables "Inquiry on WhatsApp"
   - Opens WhatsApp ONLY on button click with selected category message
---------------------------------- */

(function () {
  const categories = window.CATEGORIES || [];
  const WHATSAPP = String(window.WHATSAPP_NUMBER || "919867378209").replace(/[^\d]/g, "");

  const orbitEl = document.getElementById("orbit");
  const btnOrder = document.getElementById("btnOrder");
  const hintText = document.getElementById("hintText");

  let selectedId = null;

  // -----------------------------
  // UI: compute orbit positions (SAME UI LOGIC)
  // -----------------------------
  function renderOrbit() {
    orbitEl.innerHTML = "";

    const n = categories.length;
    if (!n) return;

    const rect = orbitEl.getBoundingClientRect();
    const scale = Math.min(1.05, 0.92 + (n * 0.01));

    const rx = rect.width * 0.40 * scale;
    const ry = rect.height * 0.40 * scale;

    function placeCategory(c, angleDeg) {
      const angle = (Math.PI / 180) * angleDeg;

      const x = Math.cos(angle) * rx;
      const y = Math.sin(angle) * ry;

      const btn = document.createElement("button");
      btn.className = "pill";
      btn.type = "button";
      btn.setAttribute("role", "listitem");
      btn.setAttribute("data-id", c.id);

      btn.innerHTML = `<span class="dot" aria-hidden="true"></span><span>${c.name}</span>`;
      btn.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) translate(var(--nx), var(--ny))`;

      if (c.id === selectedId) btn.classList.add("selected");
      btn.addEventListener("click", () => setSelected(c.id));

      orbitEl.appendChild(btn);
    }

    const step = 360 / n;
    const startAngle = -90 + 18;

    categories.forEach((c, i) => {
      placeCategory(c, startAngle + step * i);
    });
  }

  // -----------------------------
  // State: select a category
  // -----------------------------
  function setSelected(id) {
    selectedId = id;

    const pills = orbitEl.querySelectorAll(".pill");
    pills.forEach((p) => {
      p.classList.toggle("selected", p.getAttribute("data-id") === id);
    });

    btnOrder.disabled = false;
    btnOrder.classList.add("enabled");
    hintText.textContent = "Ready to inquire";
  }

  // -----------------------------
  // WhatsApp URL builder
  // -----------------------------
  function buildWhatsAppUrl(message) {
    const msg = encodeURIComponent(message);
    return "https://wa.me/" + WHATSAPP + "?text=" + msg;
  }

  function buildInquiryMessage(categoryName) {
    return (
      "Hi Shivneri Fresh,\n\n" +
      "I would like to inquire about " + categoryName + " category.\n\n" +
      "Please share the product list and current rates."
    );
  }

  // -----------------------------
  // CTA click: open WhatsApp
  // -----------------------------
  btnOrder.addEventListener("click", () => {
    if (btnOrder.disabled || !selectedId) return;

    const cat = categories.find((c) => c.id === selectedId);
    if (!cat) return;

    const text = buildInquiryMessage(cat.name);
    const url = buildWhatsAppUrl(text);

    window.open(url, "_blank");
  });

  // -----------------------------
  // Init
  // -----------------------------
  hintText.textContent = "Select one category to continue";
  btnOrder.disabled = true;
  btnOrder.classList.remove("enabled");

  let resizeTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(renderOrbit, 100);
  });

  renderOrbit();
})();
