/* Use YouTube's own card renderer so it owns hover playback and navigation. */
(() => {
  document.addEventListener('hn-native-card', async event => {
    const card = event.target;
    if (!(card instanceof HTMLElement) || !card.matches('#hn-panel .hn-card')) return;
    const id = card.dataset.hnVideo;
    if (!/^[\w-]{11}$/.test(id)) return;
    // Leave the ordinary thumbnail and link intact if YouTube removes this renderer.
    if (!customElements.get('ytd-rich-grid-media')) return;
    const native = document.createElement('ytd-rich-grid-media');
    const endpoint = {
      clickTrackingParams: '',
      commandMetadata: {webCommandMetadata: {url: `/watch?v=${id}`, webPageType: 'WEB_PAGE_TYPE_WATCH', rootVe: 3832}},
      watchEndpoint: {videoId: id}
    };
    native.data = {
      videoId: id,
      thumbnail: {thumbnails: [{url: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`, width: 480, height: 360}]},
      title: {runs: [{text: card.dataset.hnTitle}]},
      ownerText: {runs: [{text: card.dataset.hnChannel}]},
      shortBylineText: {runs: [{text: card.dataset.hnChannel}]},
      lengthText: {simpleText: card.dataset.hnDuration},
      viewCountText: {simpleText: card.dataset.hnViews},
      shortViewCountText: {simpleText: card.dataset.hnViews},
      publishedTimeText: {simpleText: card.dataset.hnPosted},
      navigationEndpoint: endpoint,
      inlinePlaybackEndpoint: endpoint,
      thumbnailOverlays: [{thumbnailOverlayTimeStatusRenderer: {text: {simpleText: card.dataset.hnDuration}, style: 'DEFAULT'}}]
    };
    native.classList.add('hn-native-renderer');
    card.prepend(native);
    // Only replace the fallback once the native renderer has produced its thumbnail.
    const observer = new MutationObserver(() => {
      if (native.querySelector('a[href*="watch"] img')) {
        card.classList.add('hn-has-native');
        observer.disconnect();
      }
    });
    observer.observe(native, {childList:true, subtree:true});
    setTimeout(() => {observer.disconnect();if (!card.classList.contains('hn-has-native')) native.remove();}, 5000);
  });
})();
