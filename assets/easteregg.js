(function () {
    const secret = ["KeyS", "KeyH", "KeyA", "KeyL", "KeyO", "KeyM"];
    let cursor = 0;
    let active = false;

    function spawnSymbol() {
        const node = document.createElement("div");
        node.textContent = ["✡️", "🕎", "✨", "🌟"][Math.floor(Math.random() * 4)];
        node.style.position = "fixed";
        node.style.left = `${Math.random() * 100}vw`;
        node.style.top = "-40px";
        node.style.fontSize = `${18 + Math.random() * 24}px`;
        node.style.zIndex = "99999";
        node.style.pointerEvents = "none";
        node.style.transition = "transform 2.8s linear, opacity 2.8s linear";
        document.body.appendChild(node);

        requestAnimationFrame(() => {
            node.style.transform = `translateY(${window.innerHeight + 80}px) rotate(${(Math.random() * 90) - 45}deg)`;
            node.style.opacity = "0";
        });

        window.setTimeout(() => node.remove(), 2900);
    }

    function activateEgg() {
        if (active) return;
        active = true;

        const banner = document.createElement("div");
        banner.textContent = "🥚 Easter Egg gefunden: Shalom!";
        banner.style.position = "fixed";
        banner.style.left = "50%";
        banner.style.top = "16px";
        banner.style.transform = "translateX(-50%)";
        banner.style.padding = "10px 14px";
        banner.style.borderRadius = "999px";
        banner.style.background = "rgba(18, 31, 59, 0.92)";
        banner.style.color = "#fff";
        banner.style.fontWeight = "800";
        banner.style.zIndex = "99999";
        banner.style.boxShadow = "0 8px 24px rgba(0,0,0,0.25)";
        banner.style.pointerEvents = "none";
        document.body.appendChild(banner);

        for (let i = 0; i < 42; i += 1) {
            window.setTimeout(spawnSymbol, i * 90);
        }

        window.setTimeout(() => {
            banner.remove();
            active = false;
        }, 4200);
    }

    function addSurpriseTriggers() {
        const selectors = [
            ".nav-brand",
            ".brand-title",
            ".page-title",
            "h1",
            "#startButton"
        ];

        selectors.forEach((selector) => {
            const node = document.querySelector(selector);
            if (!node) return;

            node.addEventListener("dblclick", () => activateEgg());
        });
    }

    window.addEventListener("keydown", (event) => {
        if (event.code === secret[cursor]) {
            cursor += 1;
            if (cursor >= secret.length) {
                cursor = 0;
                activateEgg();
            }
            return;
        }

        cursor = event.code === secret[0] ? 1 : 0;
    });

    addSurpriseTriggers();
})();
