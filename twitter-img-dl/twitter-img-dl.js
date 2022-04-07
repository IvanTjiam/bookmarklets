javascript: (function(){
    let main = document.getElementsByTagName("main")[0];
    let imgs = main.getElementsByTagName(["img"]);
    let download = async (href, filename) => {
        const res = await fetch(href);
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    }
    for (var i = 0; i < imgs.length; i++) {
        let src = imgs[i].src;
        if (!src.includes("https://pbs.twimg.com/media/")) continue;
        let url = new window.URL(src); 
        url.searchParams.set("name", "orig");
        let filename = url.pathname.split("/")[2];
        download(url.href, filename);
    }
})();