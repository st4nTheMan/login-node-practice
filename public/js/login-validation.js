// public/js/login-validation.js
document.addEventListener('DOMContentLoaded', () => {
  // debug
  // console.log('login-validation loaded');

  const form = document.querySelector('form');
  if (!form) return; // nothing to do

  const fields = form.querySelectorAll('input[name], textarea[name]');

  fields.forEach(field => {
    field.addEventListener('input', () => {
      // only clear errors if user typed a non-empty value
      if (!field.value || field.value.trim().length === 0) return;

      // Remove error classes from the input itself (common pattern)
      field.classList.remove('border-orange-500', 'bg-orange-50');

      // Also try removing classes from a surrounding container (.mb-4 or parent)
      const container = field.closest('.mb-4') || field.parentElement;
      if (container) {
        container.classList.remove('border-orange-500', 'bg-orange-50');
        // remove error message element if present
        const em = container.querySelector('.error-message');
        if (em) em.remove();
      }

      // If you have a top-level inline alert, optionally remove it:
      const topAlert = document.querySelector('.alert-inline');
      if (topAlert) topAlert.remove();
    });
  });
});
