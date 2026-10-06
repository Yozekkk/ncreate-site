export const launcherVersion = "1.0.0";
export const launcherReleaseUrl = `https://github.com/Yozekkk/ncreate-launcher/releases/tag/v${launcherVersion}`;

export const launcherDownloads = [
  {
    label: "Windows",
    detail: "Windows 10/11 · x64 · EXE",
    url: `https://github.com/Yozekkk/ncreate-launcher/releases/download/v${launcherVersion}/NCreate-Launcher-Setup-${launcherVersion}.exe`,
  },
  {
    label: "Linux AppImage",
    detail: "Linux · x64 · универсальный файл",
    url: `https://github.com/Yozekkk/ncreate-launcher/releases/download/v${launcherVersion}/NCreate-Launcher-${launcherVersion}.AppImage`,
  },
  {
    label: "Linux DEB",
    detail: "Debian / Ubuntu · x64",
    url: `https://github.com/Yozekkk/ncreate-launcher/releases/download/v${launcherVersion}/NCreate-Launcher-${launcherVersion}-amd64.deb`,
  },
] as const;
