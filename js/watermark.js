// watermark.js

(function () {
    const ENABLE_WATERMARK = true; // <-- controle aqui

    if (!ENABLE_WATERMARK) return;

    function createWatermark() {
        const wrapper = document.createElement("div");

        wrapper.className = `
            fixed inset-0
            flex items-center justify-center
            pointer-events-none
            z-0
        `;

        wrapper.innerHTML = `
            <div class="
                text-5xl md:text-7xl
                font-bold
                text-white
                tracking-widest
                select-none
                text-center
            " style="transform: rotate(-30deg); opacity: 0.15;">
                PÁGINA EM CONSTRUÇÃO
            </div>
        `;

        document.body.appendChild(wrapper);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", createWatermark);
    } else {
        createWatermark();
    }
})();
