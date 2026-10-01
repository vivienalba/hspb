# The Pink Room

A static scrapbook photobooth with three photo strips, six filters and single frame videos limited to 30 seconds. Photos and video are processed on the device.

## Publish on GitHub Pages
1. Extract this ZIP into the root of your hspb repository, replacing the existing website files. Keep the assets and fonts folders.
2. In Terminal, inside that repository, run:

```sh
git add .
git commit -m "Redesign photobooth as The Pink Room"
git push
```

3. In GitHub Settings > Pages, select Deploy from a branch, main and /(root). If already configured, pushing updates the site automatically.
4. Wait for the Pages deployment to finish. Open https://vivienalba.github.io/hspb/ and reload.

Camera access requires HTTPS or localhost. Video format depends on browser support. Enable sound before recording to include microphone audio. Downloaded strips and videos include the selected filter and one original caption. Fonts and licenses are included in fonts/.
