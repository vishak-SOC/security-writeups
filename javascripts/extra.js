/* =========================================================
   Universal 3D Carousel Loader (Fixes "One Card" Glitch)
   ========================================================= */

function initCarousel() {
  const carousel = document.querySelector('.carousel-3d');
  const cells = document.querySelectorAll('.carousel-cell');
  
  // If no carousel on this page, stop.
  if (!carousel || cells.length === 0) return;

  // Prevent double-initializing
  if (carousel.getAttribute('data-loaded') === 'true') return;
  carousel.setAttribute('data-loaded', 'true');

  console.log("✅ SOC Carousel Initialized with " + cells.length + " cards.");

  const cellCount = cells.length;
  let selectedIndex = 0;
  
  // Math: Push cards out based on count so they don't overlap
  // Wider gap = (Width / 2) / tan(PI / count) + spacing
  const cellWidth = 260; 
  const radius = Math.round((cellWidth / 2) / Math.tan(Math.PI / cellCount)) + 50;
  const theta = 360 / cellCount;

  // --- 1. Rotation Function ---
  const rotateCarousel = () => {
    const angle = theta * selectedIndex * -1;
    // Apply the rotation to the container
    carousel.style.transform = `translateZ(-${radius}px) rotateY(${angle}deg)`;
    
    // Optional: Add "active" class to the front card for styling
    // (This helps if you want to highlight the center card later)
  };

  // --- 2. Position Cells in a 3D Circle ---
  cells.forEach((cell, i) => {
    const cellAngle = theta * i;
    // Rotate the cell to its angle, then push it OUT by the radius
    cell.style.transform = `rotateY(${cellAngle}deg) translateZ(${radius}px)`;
  });

  // --- 3. Wire Up Buttons ---
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  // Clone buttons to remove old event listeners (fix for instant loading)
  if (prevBtn) {
    const newPrev = prevBtn.cloneNode(true);
    prevBtn.parentNode.replaceChild(newPrev, prevBtn);
    newPrev.addEventListener('click', () => {
      selectedIndex--;
      rotateCarousel();
    });
  }

  if (nextBtn) {
    const newNext = nextBtn.cloneNode(true);
    nextBtn.parentNode.replaceChild(newNext, nextBtn);
    newNext.addEventListener('click', () => {
      selectedIndex++;
      rotateCarousel();
    });
  }

  // --- 4. Start! ---
  rotateCarousel();
}

// =========================================================
// BOOTSTRAPPER (Handles Refresh + Instant Navigation)
// =========================================================

// 1. Run on normal page load
document.addEventListener("DOMContentLoaded", initCarousel);

// 2. Run on URL change (for MkDocs Instant Navigation)
let lastUrl = location.href; 
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    // Wait 100ms for the new DOM to render, then init
    setTimeout(initCarousel, 100);
  }
}).observe(document, {subtree: true, childList: true});