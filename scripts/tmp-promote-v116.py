from pathlib import Path

constants = Path('src/constants.js')
text = constants.read_text()
old = "export const VERSION = '1.1.5';"
new = "export const VERSION = '1.1.6';"
if old not in text:
    raise SystemExit('VERSION anchor not found')
constants.write_text(text.replace(old, new, 1))

changelog = Path('CHANGELOG.md')
text = changelog.read_text()
old = "# Changelog\n\n## Unreleased\n\n- Restored the dedicated fullscreen button on desktop single-camera Live."
new = "# Changelog\n\n## 1.1.6\n\n- Restored the dedicated fullscreen button on desktop single-camera Live."
if old not in text:
    raise SystemExit('changelog anchor not found')
changelog.write_text(text.replace(old, new, 1))
