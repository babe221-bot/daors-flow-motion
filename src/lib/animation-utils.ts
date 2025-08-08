import anime from 'animejs';

// Theme transition animation
export function animateThemeChange() {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.zIndex = '9999';
  overlay.style.transition = 'opacity 0.3s ease';
  
  // Get current theme color from body class
  const isDark = document.body.classList.contains('dark');
  overlay.style.backgroundColor = isDark ? '#000000' : '#ffffff';
  
  document.body.appendChild(overlay);
  
  setTimeout(() => {
    overlay.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(overlay);
    }, 300);
  }, 50);
}

// Toast notification animation
export function animateToast(element: HTMLElement) {
anime({
    targets: element,
    translateY: [-20, 0],
    opacity: [0, 1],
    duration: 300,
    easing: 'easeOutCubic'
  });
}

// Page transition animation
export function animatePageTransition() {
anime({
    targets: 'main',
    opacity: [0, 1],
    translateY: [20, 0],
    duration: 500,
    easing: 'easeOutQuart'
  });
}

// Button hover animation
export function animateButtonHover(element: HTMLElement) {
anime({
    targets: element,
    scale: [1, 1.05],
    duration: 200,
    easing: 'easeInQuad'
  });
}

// Form input focus animation
export function animateInputFocus(element: HTMLElement) {
anime({
    targets: element,
    borderColor: ['#93c5fd', '#3b82f6'],
    duration: 300,
    easing: 'easeInOutQuad',
    loop: false
  });
}
