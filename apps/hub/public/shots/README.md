# Screenshots of the production sites

`LiveDemos` shows these instead of framing the live site. Three of the four
products are behind a sign-in, so an iframe would show a login box — which
tells a visitor nothing about the work and looks like a broken embed.

Expected files, referenced from `src/lib/projects.ts`:

| File                   | Site                    | What to capture |
| ---------------------- | ----------------------- | --------------- |
| `laila.png`            | laila.dialexpert.com    | A signed-in screen with real structure — the deals table or the file checker. Not the login page. |
| `youhue-app.png`       | app.youhue.com          | The educator dashboard: class climate, check-in history. Not the login page. |
| `youhue-site.png`      | youhue.com              | The top of the marketing page. |
| `aigentsrealty.png`    | aigentsrealty.com       | A search or comparison view rather than the bare homepage. |

**Capture at 1600×950 or wider**, in a 16:9.5 ratio. The frame crops to
`object-top`, so anything below the fold of that ratio is not shown.

**Blur or replace anything real.** These are live systems with live data.
Customer names, file IDs, phone numbers, balances and student names must not be
readable. Use a demo account where one exists, or blur before saving.

A missing file is safe: the component falls back to the live iframe, so the
page keeps working while these are being produced.
