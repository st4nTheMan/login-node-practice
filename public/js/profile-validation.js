document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("profileForm");

    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Clear previous error messages
        document.querySelectorAll(".error-message").forEach(el => el.remove());
        form.querySelectorAll("input").forEach(input => {
            input.classList.remove("input-error");
            input.classList.add("input-normal");
        });

        const formData = Object.fromEntries(new FormData(form));

        try {
            const res = await fetch("/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
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

                        input.addEventListener("input", () => {
                            input.classList.remove("input-error");
                            input.classList.add("input-normal");
                            const errMsg = input.parentElement.querySelector(".error-message");
                            if (errMsg) errMsg.remove();
                        }, { once: true });
                    }
                }
            } else if (res.ok) {
                alert("Profile updated successfully!");
                location.reload();
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
