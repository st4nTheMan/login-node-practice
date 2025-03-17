document.getElementById("fetchMessage").addEventListener("click", async () => {
    try {
        const response = await fetch("/api/message");
        if (!response.ok) {
            throw new Error("Failed to fetch message");
        }
        const data = await response.json();

        // Select message element and update text
        const messageElement = document.getElementById("message");
        messageElement.textContent = data.message;

        // Apply Bootstrap alert class for background color
        messageElement.classList.add("alert", "alert-success");
        messageElement.style.visibility = "visible"; // Make it visible
    } catch (error) {
        const messageElement = document.getElementById("message");
        messageElement.textContent = "Error loading message!";
        messageElement.classList.add("alert", "alert-danger");
        messageElement.style.visibility = "visible";
        console.error(error);
    }
});
