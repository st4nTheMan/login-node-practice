document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("profileForm");

    if (!form) return;
    const toast = document.querySelector(".js-toast");
    const toastMsg = toast ? toast.querySelector(".js-toast-message") : null;
    const closeBtn = toast ? toast.querySelector(".js-toast-close") : null;

    if (toast) {
        toast.classList.add("hidden");
        // Ensure it does not have 'flex' until shown
        toast.classList.remove("flex");
    }
    function showToast(message, { reloadAfter = false } = {}) {
        if (!toast) return;
        if (toastMsg) toastMsg.textContent = message;

        // Show by toggling utility classes
        toast.classList.remove("hidden");
        toast.classList.add("flex");

        // Clear any existing timer
        if (toast._timerId) {
            clearTimeout(toast._timerId);
            delete toast._timerId;
        }

        // Auto-hide after 3s (3000ms)
        toast._timerId = setTimeout(() => {
            hideToast();
            if (reloadAfter) {
                // Slight delay to allow hide animation (if any) to complete
                setTimeout(() => location.reload(), 150);
            }
        }, 3000);
    }

    function hideToast() {
        if (!toast) return;
        toast.classList.add("hidden");
        if (toast._timerId) {
            clearTimeout(toast._timerId);
            delete toast._timerId;
        }
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", hideToast);
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Clear previous error messages
        document.querySelectorAll(".error-message").forEach((el) => el.remove());
        form.querySelectorAll("input").forEach((input) => {
            input.classList.remove("input-error");
            input.classList.add("input-normal");
        });

        const formData = Object.fromEntries(new FormData(form));

        try {
            const res = await fetch("/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await res.json();

            if (!res.ok && result.errors) {
                for (const [field, message] of Object.entries(result.errors)) {
                    const input = form.querySelector(`[name="${field}"]`);
                    if (input) {
                        input.classList.remove("input-normal");
                        input.classList.add("input-error");

                        const p = document.createElement("p");
                        p.className = "error-message !text-orange-600 text-xs mt-1 ml-2";
                        p.textContent = message;
                        input.parentElement.appendChild(p);

                        input.addEventListener(
                            "input",
                            () => {
                                input.classList.remove("input-error");
                                input.classList.add("input-normal");
                                const errMsg =
                                    input.parentElement.querySelector(".error-message");
                                if (errMsg) errMsg.remove();
                            },
                            { once: true }
                        );
                    }
                }
            } else if (res.ok) {
                showToast("Profile updated successfully!");
            }
        } catch (err) {
            console.error("Error:", err);
        }
    });

    // Toggle between profile and password forms
    const changePasswordButton = document.getElementById("changePasswordButton");
    const profileFormDiv = document.getElementById("profileForm").parentElement;
    const passwordFormDiv = document.getElementById("passwordForm");
    const cancelButton = passwordFormDiv.querySelector("button[type=\"button\"]");

    changePasswordButton.addEventListener("click", () => {
        profileFormDiv.classList.add("hidden");
        passwordFormDiv.classList.remove("hidden");
    });

    cancelButton.addEventListener("click", () => {
        passwordFormDiv.classList.add("hidden");
        profileFormDiv.classList.remove("hidden");
    });
});
