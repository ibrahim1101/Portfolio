# Upload project dashboard screenshots

For each project, create the matching directory and upload image files plus `gallery.json`.

| Project | Directory |
| --- | --- |
| nScout | `public/media/projects/nscout/` |
| SentinelLab | `public/media/projects/sentinellab/` |
| CERBERUS | `public/media/projects/cerberus/` |
| Locat | `public/media/projects/locat/` |
| CaseTrace | `public/media/projects/casetrace/` |
| VAPT-X | `public/media/projects/vapt-x/` |
| SENTINEL EDGE | `public/media/projects/sentinel-edge/` |

Example: `public/media/projects/nscout/gallery.json`

```json
[
  {"file":"dashboard.webp","caption":"Network analysis dashboard"},
  {"file":"packet-inspector.webp","caption":"Packet inspection workspace"},
  {"file":"findings.webp","caption":"Security findings"}
]
```

Upload actual screenshots with the same filenames as in the manifest. Prefer WebP or optimized PNG, consistent 16:9 or 4:3 framing, and meaningful captions. The website reads `gallery.json` automatically and displays the images in the Gallery tab. Avoid uploading duplicate or fictional product screenshots.

Before publishing: blur/remove usernames, IP addresses, email addresses, API keys, access tokens, internal paths, private chats and other sensitive details. Use synthetic or authorized test data.
