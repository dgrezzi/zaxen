// src/js/form.js

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("leadForm");
    const messageBox = document.getElementById("message");

    const submitText = document.getElementById("submit-text");
    const submitIcon = document.getElementById("submit-icon");
    const loadingSpinner = document.getElementById("loading-spinner");

    // 🔴 URL DO GOOGLE APPS SCRIPT (Web App)
    const ENDPOINT_URL =
        "https://script.google.com/macros/s/AKfycbyWEC1eZo24hHAq0r7fEWm8r715WOUHMU4Y61cV7fTcAswxasGadS39KH9KOQy-2yA4/exec";

    function showMessage(text, type = "success") {
        messageBox.classList.remove("hidden", "success", "error");
        messageBox.classList.add(type);
        messageBox.innerText = text;
    }

    function setLoading(isLoading) {
        if (isLoading) {
            submitText.innerText = "Enviando...";
            submitIcon.classList.add("hidden");
            loadingSpinner.classList.remove("hidden");
        } else {
            submitText.innerText = "Enviar solicitação";
            submitIcon.classList.remove("hidden");
            loadingSpinner.classList.add("hidden");
        }
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        setLoading(true);
        messageBox.classList.add("hidden");

        const formData = new FormData(form);

        // 🔹 Campos extras esperados pelo Apps Script
        formData.append("source", "site");
        formData.append("timestamp", new Date().toISOString());

        try {
            const response = await fetch(ENDPOINT_URL, {
                method: "POST",
                body: formData,
            });

            const text = await response.text();

            if (text.includes("OK")) {
                // 🔥 Evento de conversão no Umami
                if (window.umami) {
                    umami.track("lead_converted", {
                        form: "contato",
                        sector: formData.get("sector"),
                        need: formData.get("need"),
                    });
                }

                showMessage(
                    "✅ Obrigado! Recebemos sua solicitação e entraremos em contato em breve.",
                    "success",
                );
                window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                });
                form.reset();
            } else {
                throw new Error(text);
            }
        } catch (error) {
            console.error(error);
            showMessage(
                "❌ Ocorreu um erro ao enviar o formulário. Tente novamente.",
                "error",
            );
        } finally {
            setLoading(false);
        }
    });
});
