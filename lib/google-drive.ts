const DRIVE_FILE_ID_PATTERN = /(?:\/file\/d\/|id=)([\w-]+)/

export function extractGoogleDriveId(url: string): string | null {
  return url.match(DRIVE_FILE_ID_PATTERN)?.[1] ?? null
}

export function isGoogleDriveUrl(url: string): boolean {
  return url.includes("drive.google.com")
}

export function getGoogleDrivePreviewUrl(id: string): string {
  return `https://drive.google.com/file/d/${id}/preview`
}

export function getGoogleDriveDownloadPath(id: string, name?: string): string {
  const params = new URLSearchParams({ id })
  if (name) params.set("name", name)
  return `/api/drive-download?${params.toString()}`
}

export async function fetchGoogleDriveFile(id: string): Promise<Response> {
  let res = await fetch(`https://drive.google.com/uc?export=download&id=${id}`, {
    redirect: "follow",
  })

  const contentType = res.headers.get("content-type") ?? ""
  if (contentType.includes("text/html")) {
    const html = await res.text()
    const confirm = html.match(/confirm=([0-9A-Za-z_]+)/)?.[1]
    const uuid = html.match(/name="uuid"\s+value="([^"]+)"/)?.[1]

    if (confirm) {
      res = await fetch(
        `https://drive.google.com/uc?export=download&id=${id}&confirm=${confirm}`,
        { redirect: "follow" }
      )
    } else if (uuid) {
      res = await fetch(
        `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t&uuid=${uuid}`,
        { redirect: "follow" }
      )
    } else {
      throw new Error("Could not resolve Google Drive download")
    }
  }

  return res
}
