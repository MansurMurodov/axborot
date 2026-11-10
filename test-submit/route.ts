import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
// body: { testId, answers: { [questionId]: string[] } }
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error:"Ruxsat yo'q" }, { status:401 });
  const { testId, answers } = await req.json();
  const qs = await db.question.findMany({ where:{ testId }, include:{ answers:true } });
  let score = 0; const detail: any[] = [];
  for (const q of qs) {
    const right = q.answers.filter(a=>a.isCorrect).map(a=>a.id).sort();
    const given = ((answers?.[q.id] as string[]) ?? []).slice().sort();
    const ok = right.length===given.length && right.every((v,i)=>v===given[i]);
    if (ok) score++; detail.push({ questionId:q.id, correct:ok, right });
  }
  const percent = qs.length ? (score/qs.length)*100 : 0;
  await db.testResult.create({ data:{ score, percent, testId, userId:(session.user as any).id } });
  return NextResponse.json({ score, total:qs.length, percent, detail });
}
