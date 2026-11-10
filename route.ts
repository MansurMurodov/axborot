import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
const ALLOWED = ["pdf","docx","pptx","mp4","mp3","jpg","png","svg"];
const MAX = 100 * 1024 * 1024;
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error:"Ruxsat yo'q" }, { status:401 });
  const file = (await req.formData()).get("file") as File | null;
  if (!file) return NextResponse.json({ error:"Fayl yo'q" }, { status:400 });
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!ALLOWED.includes(ext)) return NextResponse.json({ error:"Format ruxsat etilmagan" }, { status:415 });
  if (file.size > MAX) return NextResponse.json({ error:"Hajm 100 MB dan oshdi" }, { status:413 });
  const name = `${crypto.randomUUID()}.${ext}`;
  await fs.mkdir("uploads", { recursive:true });
  await fs.writeFile(path.join("uploads", name), Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ url:`/uploads/${name}` });
}
