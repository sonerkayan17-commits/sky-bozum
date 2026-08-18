# Release rollback checklist

This repository has no automatic deployment step in the preflight gate. If a release needs to be rolled back:

1. Stop new deployment promotion in the hosting provider.
2. Restore the previous known-good commit or hosting version.
3. Re-run `npm run preflight:release` before promoting another version.
4. If Firebase rules were changed, publish the previous ruleset from the Firebase console or CLI history.
5. Keep the public raster source archive intact; do not move archived PNG originals back under `public` unless the image budget audit is updated and passes.

Do not add real API keys, DSNs, or service credentials to the repository.
