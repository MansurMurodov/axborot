import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { TOPICS } from "../data/topics";
const db = new PrismaClient();
async function main() {
  const pw = await bcrypt.hash("Admin123!", 12);
  for (const [name, email, role] of [["Administrator","admin@rtr.uz","ADMIN"],["O'qituvchi","teacher@rtr.uz","TEACHER"],["O'quvchi","student@rtr.uz","STUDENT"]] as const)
    await db.user.upsert({ where:{email}, update:{}, create:{name,email,role,password:pw} });
  const course = await db.course.create({ data:{ title:"Axborot texnologiyalari asoslari", description:"60 soatlik kurs", modules:{ create:[{title:"Nazariy modul",order:1},{title:"Amaliy modul",order:2}] } }, include:{modules:true} });
  let t=0,p=0;
  for (const [title,kind,pts] of TOPICS) {
    const theory = kind==="T"; const order = theory?++t:++p;
    const code = `${kind}${String(order).padStart(2,"0")}`;
    const lesson = await db.lesson.create({ data:{
      order, title, type: theory?"THEORY":"PRACTICE", hours:2,
      goal:`"${title}" mavzusi bo'yicha bilim va ko'nikmalarni shakllantirish`,
      outcomes:pts.join("; "), plan:pts.map((x,i)=>`${i+1}. ${x}`).join("\n"), concepts:pts.join("; "),
      content:pts.map(x=>`${x}. Bu masala bo'yicha asosiy qoidalar va misollar darsda batafsil yoritiladi.`).join("\n\n"),
      examples:`Kundalik ish jarayonidan misollar: ${pts[0]}.`,
      questions:pts.map(x=>`${x} — tushuntirib bering.`).join("\n"),
      homework:`Mavzu bo'yicha qisqa hisobot tayyorlang va fayl sifatida yuklang.`,
      conclusion:`Mavzu yakunida: ${pts.join("; ")}.`, references:"AT asoslari o'quv qo'llanmasi; Microsoft Learn",
      moduleId: course.modules[theory?0:1].id } });
    const test = await db.test.create({ data:{ title:`Test: ${title}`, lessonId:lesson.id } });
    for (const x of pts) await db.question.create({ data:{ text:`Quyidagilardan qaysi biri mavzuga mos: ${title}?`, testId:test.id, answers:{ create:[{text:x,isCorrect:true},{text:"Mavzuga aloqasi yo'q tasdiq",isCorrect:false},{text:"Noto'g'ri ta'rif",isCorrect:false}] } } });
    await db.presentation.create({ data:{ lessonId:lesson.id, pptxUrl:`/presentations/${code}.pptx`, pdfUrl:`/pdf/${code}.pdf` } });
  }
  await db.glossary.createMany({ data:[
    {en:"Processor",uz:"Protsessor",definition:"Kompyuterning buyruqlarni bajaruvchi asosiy qurilmasi",usage:"Hisoblash tezligini belgilaydi"},
    {en:"Operating system",uz:"Operatsion tizim",definition:"Kompyuter resurslarini boshqaruvchi dastur",usage:"Windows, Linux"},
    {en:"Cloud storage",uz:"Bulutli saqlash",definition:"Ma'lumotni Internetdagi serverda saqlash",usage:"Google Drive"} ] });
}
main().finally(()=>db.$disconnect());
