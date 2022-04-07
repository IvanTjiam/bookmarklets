javascript: (function () {
    let getImage = (width, height) => {
        width = width || 1920;
        height = height || 1080;
        const video = document.querySelector("#movie_player > div.html5-video-container > video");
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);
        return canvas.toBlob(download, "image/png");
    };
    let download = (blob) => {
        let id = window.location.search.split("v=")[1];
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = id;
        a.click();
        a.remove();
        draw(url);
    };
    let draw = (url) => {
        let d = document.createElement("div");
        d.style.cssText = "position: fixed; bottom: 0px; right: 0px; width: 427px; height: 240px; margin: 5px; border: 3px solid white; border-radius: 5px; z-index: 999;";
        let i = document.createElement("img");
        i.style.cssText = "width: 100%; height: 100%;";
        let x = document.createElement("div");
        x.style.cssText = "position: absolute;top: 0px;right: 0px;margin: 5px;padding: 5px;color: white;cursor: pointer;text-shadow: 0 0 2px black;";
        x.innerHTML = "&#x2715";
        x.addEventListener("click", () => {
            d.parentNode.removeChild(d);
            window.URL.revokeObjectURL(url);
        });
        d.appendChild(i);
        d.appendChild(x);
        i.src = url;
        document.body.appendChild(d);
    };
    let r = prompt("Enter width,height default (1920,1080)");
    let [w, h] = r.split(",").map((e) => +e);
    getImage(w, h);
})();
