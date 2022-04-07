javascript: (async function () {
    async function interceptFetch(...args) {
        let res = await origFetch(...args);
        if (res.url.includes("get_transcript")) interceptRes(res);
        return res;
    }

    function delay(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    async function callGetTranscript() {
        document
            .querySelector(
                "#page-manager ytd-menu-renderer > yt-icon-button#button"
            )
            .click();
        await delay(100);
        let btn = document
            .querySelector(
                "#items > ytd-menu-service-item-renderer:nth-child(2) > tp-yt-paper-item > yt-formatted-string"
            )
        if (!btn) alert("No transcript available");
        else btn.click();
    }

    function restoreFetch() {
        window.fetch = origFetch;
    }

    function interceptRes(res) {
        res.clone()
            .json()
            .then((body) => download(getTranscript(body)))
            .catch((err) => console.error(err));
    }

    function getTranscript(res) {
        const lines =
            res.actions[0].updateEngagementPanelAction.content
                .transcriptRenderer.content.transcriptSearchPanelRenderer.body
                .transcriptSegmentListRenderer.initialSegments;
        return lines.map((e) => {
            const time = e.transcriptSegmentRenderer.startTimeText.simpleText;
            const text = e.transcriptSegmentRenderer.snippet.runs[0].text;
            const startMs = e.transcriptSegmentRenderer.startMs;
            const endMs = e.transcriptSegmentRenderer.endMs;
            return { time, text, startMs, endMs };
        });
    }

    function download(jsonString) {
        const blob = new Blob([JSON.stringify(jsonString, null, 2)], {
            type: "text/plain",
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        const id = window.location.search.split("v=")[1];
        a.href = url;
        a.download = id + ".json";
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    }

    const origFetch = window.fetch;
    window.fetch = interceptFetch;
    await callGetTranscript();
    await delay(100);
    restoreFetch();
})();
