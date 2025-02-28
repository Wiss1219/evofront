export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'instant'
  });
};

export const setupScrollBehavior = () => {
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }

  window.addEventListener('beforeunload', () => {
    scrollToTop();
  });

  window.addEventListener('load', () => {
    scrollToTop();
  });
};
