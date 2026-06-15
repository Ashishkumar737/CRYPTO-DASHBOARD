async function loadComponent(id, file) {

    const res = await fetch(file);
    const html = await res.text();

    document.getElementById(id).innerHTML = html;
}

Promise.all([
    loadComponent("header", "../components/header.html"),
    loadComponent("footer", "../components/footer.html")
]).then(() => {

    const themeToggle =
        document.getElementById("themeToggle");

    if (themeToggle) {

        // load saved theme

        const savedTheme =
            localStorage.getItem("theme");

        if (savedTheme === "light") {

            document.body.classList.add(
                "light-mode"
            );
        }

        themeToggle.addEventListener(
            "click",
            () => {

                document.body.classList.toggle(
                    "light-mode"
                );

                localStorage.setItem(
                    "theme",
                    document.body.classList.contains(
                        "light-mode"
                    )
                        ? "light"
                        : "dark"
                );
            }
        );
    }
});