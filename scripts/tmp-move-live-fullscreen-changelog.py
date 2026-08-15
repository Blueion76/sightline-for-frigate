from pathlib import Path

path=Path('CHANGELOG.md')
text=path.read_text()
bullet='- Restored the dedicated fullscreen button on desktop single-camera Live. It fullscreens the existing `#eng-wrap` WebRTC wrapper without replacing the stream, remains available in Multiview, stays hidden for iOS live MediaStreams, and avoids duplicating the native fullscreen control on single-camera recorded playback.\n'
if bullet not in text:
    raise SystemExit('fullscreen changelog bullet not found')
text=text.replace(bullet,'',1)
anchor='# Changelog\n\n'
unreleased=anchor+'## Unreleased\n\n- Restored the dedicated fullscreen button on desktop single-camera Live. It fullscreens the existing `#eng-wrap` WebRTC wrapper without replacing the stream, remains available in Multiview, stays hidden for iOS live MediaStreams, and avoids duplicating the native fullscreen control on single-camera recorded playback.\n\n'
if anchor not in text:
    raise SystemExit('changelog heading not found')
path.write_text(text.replace(anchor,unreleased,1))
