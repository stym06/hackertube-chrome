# hackertube-chrome

HackerTube, right inside YouTube. Adds an HN pill to your feed with videos recommended by Hacker News, hover previews, and infinite scrolling.

## Install

1. Clone or download this repository.
2. Open `chrome://extensions` and enable **Developer mode**.
3. Click **Load unpacked** and select the repository folder.
4. Refresh YouTube and click **HN** in the home page topic row.

Select another topic to return to YouTube's feed. Click a video to open its YouTube watch page. Hover over a thumbnail for a muted embedded preview; videos that disallow embedding may not preview.

## Privacy and permissions

Runs only on `www.youtube.com` and requests HackerTube's public feed using the `hackertube.org` host permission. No API keys, analytics, or browsing-history permission. HackerTube receives feed requests; YouTube serves thumbnails and embedded previews. No personal preferences are sent to HackerTube.

## Status

Early version. YouTube layout and HackerTube API changes may require updates. Recent UI fixes still need broader browser testing. Video clicks use a full page navigation.

## Credits

Feed provided by [HackerTube](https://hackertube.org/), featuring videos recommended on Hacker News. Independent project, not affiliated with HackerTube, Hacker News, YouTube, or Google.
