# Privacy policy for HN for YouTube

Last updated: November 13, 2026

HN for YouTube displays HackerTube’s public video recommendations on YouTube’s home page.

## Data handling

The extension does not collect or store personal information, browsing history, searches, or activity logs. It does not use analytics, advertising trackers, or a developer-operated server.

It processes public video metadata, such as titles, channel names, view counts, upload dates, and discussion links, to display the feed. It handles interface interactions locally to switch topics and load additional videos. These interactions are not logged or sent to the developer.

## External services

The extension requests public recommendations from https://hackertube.org. These requests contain a randomly generated feed seed and pagination values. They do not include your YouTube account details, searches, or browsing history. The extension omits credentials from HackerTube feed requests.

Thumbnails and any native video playback are provided by YouTube. Opening a video or discussion takes you to YouTube, Hacker News, or HackerTube.

These services receive normal network information, including your IP address and request headers. YouTube may also process information under your existing YouTube session and settings. Their own privacy policies govern their handling of that information. The developer does not receive these requests or control those services’ logs or retention.

## Storage and sharing

The extension holds feed and interface state in memory while the page is open. It does not persist a user profile or sell user data. Public recommendations are passed locally between the extension’s background worker and its YouTube content script.

Any handling of user data is limited to providing the extension’s stated functionality and complies with the Chrome Web Store User Data Policy, including its Limited Use requirements.

## Changes and contact

This policy will be updated if the extension’s data handling changes. For questions, open an issue at https://github.com/stym06/hackertube-chrome/issues. Issues are public; do not post private information.
