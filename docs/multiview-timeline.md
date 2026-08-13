# Multiview timeline playback

Grid/Multiview uses one shared wall-clock timestamp for continuous recording playback. Scrubbing the timeline seeks every configured camera to that same timestamp. Cameras without retained footage at the selected time show **No recording** while other camera recordings continue at the shared time.
