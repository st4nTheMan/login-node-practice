document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registerForm");
    const toast = document.getElementById("toast-success");
    const closeBtn = document.getElementById("toast-close");

    // Initially hide the toast
    toast.style.display = "none";

    // Function to show toast
    function showToast(message) {
        const toastMsg = document.getElementById("toast-message");
        toastMsg.textContent = message;
        toast.style.display = "flex";  // Make it visible

        if (toast.dataset.timerId) {
        clearTimeout(toast.dataset.timerId);
    }
        // Auto-hide after 10s
        const timerId = setTimeout(() => {
            hideToast();
        }, 3000);

        toast.dataset.timerId = timerId;
    }

    // Function to hide toast
    function hideToast() {
        toast.style.display = "none";
    }

    // Close button listener
    closeBtn.addEventListener("click", hideToast);

    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // Stop normal form submission

        // Clear previous error messages
        document.querySelectorAll(".error-message").forEach(el => el.remove());
        form.querySelectorAll("input").forEach(input => {
            input.classList.remove("input-error");
            input.classList.add("input-normal");
        });

        const formData = Object.fromEntries(new FormData(form));

        try {
            const res = await fetch("/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const result = await res.json();

            if (!res.ok) {
                // Show validation errors
                for (const [field, message] of Object.entries(result.errors)) {
                    const input = form.querySelector(`[name="${field}"]`);
                    if (input) {
                        input.classList.remove("input-normal");
                        input.classList.add("input-error");

                        const p = document.createElement("p");
                        p.className = "error-message !text-orange-600 text-xs mt-1 ml-2";
                        p.textContent = message;
                        input.parentElement.appendChild(p);
                    }
                    // Remove error once user types
                        input.addEventListener("input", () => {
                            input.classList.remove("input-error");
                            input.classList.add("input-normal");
                            const errMsg = input.parentElement.querySelector(".error-message");
                            if (errMsg) errMsg.remove();
                        }, { once: true });
                }
            } else {
                showToast("Registered successfully!");
                form.reset();
            }
        } catch (err) {
            console.error("Error:", err);
        }
    });
});
