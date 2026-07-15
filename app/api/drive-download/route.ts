import { NextResponse } from "next/server"
import { fetchGoogleDriveFile } from "@/lib/google-drive"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  const name = searchParams.get("name")

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 })
  }

  try {
    const res = await fetchGoogleDriveFile(id)

    if (!res.ok || !res.body) {
      return NextResponse.json({ error: "Download failed" }, { status: 502 })
    }

    const contentType = res.headers.get("content-type") ?? "application/octet-stream"
    const safeType = contentType.includes("text/html") ? "video/mp4" : contentType
    const fromHeader = res.headers.get("content-disposition")?.match(/filename="?([^";]+)/)?.[1]
    const filename = name ?? fromHeader ?? `drive-${id}`

    return new NextResponse(res.body, {
      headers: {
        "Content-Type": safeType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch {
    return NextResponse.json({ error: "Download failed" }, { status: 502 })
  }
}
