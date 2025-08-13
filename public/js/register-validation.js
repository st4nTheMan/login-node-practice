document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registerForm");

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
                }
            } else {
                alert("Registration successful!");
                form.reset();
            }
        } catch (err) {
            console.error("Error:", err);
        }
    });
});
