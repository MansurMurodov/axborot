import PptxGenJS from "pptxgenjs";
import fs from "fs";
import { TOPICS } from "../data/topics";
const NAVY="0B2A5B", BLUE="1E6FD9", LIGHT="EAF2FF";
fs.mkdirSync("presentations",{recursive:true});
let t=0,p=0;
async function main(){
for (const [title,kind,pts] of TOPICS) {
  const n = kind==="T"?++t:++p, code=`${kind}${String(n).padStart(2,"0")}`;
  const pp = new PptxGenJS(); pp.layout="LAYOUT_16x9"; pp.title=title;
  const base = (head:string)=>{ const s=pp.addSlide(); s.background={color:"FFFFFF"};
    s.addShape(pp.ShapeType.rect,{x:0,y:0,w:10,h:0.9,fill:{color:NAVY}});
    s.addText(head,{x:0.4,y:0.1,w:9,h:0.7,fontSize:24,bold:true,color:"FFFFFF",fontFace:"Calibri"});
    s.addShape(pp.ShapeType.rect,{x:0,y:5.4,w:10,h:0.225,fill:{color:BLUE}});
    s.addText(`${code} · ${kind==="T"?"Nazariy":"Amaliy"} mashg'ulot`,{x:0.4,y:5.3,w:5,h:0.3,fontSize:10,color:"FFFFFF"});
    return s; };
  const list=(s:any,items:string[],y=1.2)=>s.addText(items.map(x=>({text:x,options:{bullet:true,breakLine:true}})),{x:0.6,y,w:8.8,h:3.8,fontSize:20,color:NAVY,paraSpaceAfter:10});
  let s=pp.addSlide(); s.background={color:NAVY};
  s.addShape(pp.ShapeType.ellipse,{x:7.5,y:-1,w:4,h:4,fill:{color:BLUE,transparency:40}});
  s.addText(title,{x:0.7,y:1.6,w:8,h:1.6,fontSize:34,bold:true,color:"FFFFFF"});
  s.addText(`Axborot texnologiyalari asoslari · ${kind==="T"?"Nazariy":"Amaliy"} ${n}-mashg'ulot (2 soat)`,{x:0.7,y:3.4,w:8,h:0.5,fontSize:16,color:"BFD7FF"});
  s=base("Maqsad va vazifalar"); list(s,[`Maqsad: "${title}" mavzusini o'zlashtirish`,...pts.map(x=>`Vazifa: ${x}`)]);
  s=base("Dars rejasi"); list(s,pts.map((x,i)=>`${i+1}. ${x}`));
  pts.forEach((x,i)=>{ s=base(`Asosiy ma'lumot ${i+1}`);
    s.addShape(pp.ShapeType.roundRect,{x:0.6,y:1.3,w:8.8,h:1.6,fill:{color:LIGHT},line:{color:BLUE,width:2}});
    s.addText(x,{x:0.8,y:1.4,w:8.4,h:1.4,fontSize:22,bold:true,color:NAVY});
    s.addText("Misol va izoh: bu tushuncha kundalik ish va o'qishda qo'llaniladi.",{x:0.8,y:3.2,w:8.4,h:1.2,fontSize:18,color:"334155"}); });
  s=base("Sxema"); pts.slice(0,3).forEach((x,i)=>{ s.addShape(pp.ShapeType.roundRect,{x:0.6+i*3.1,y:1.6,w:2.8,h:1.8,fill:{color:i%2?BLUE:NAVY}});
    s.addText(x,{x:0.65+i*3.1,y:1.7,w:2.7,h:1.6,fontSize:14,color:"FFFFFF",align:"center"});
    if(i<2) s.addText("→",{x:3.35+i*3.1,y:2.2,w:0.4,h:0.6,fontSize:28,color:NAVY}); });
  s=base("Amaliy misollar"); list(s,[`Misol: ${pts[0]}`,`Misol: ${pts[1]}`]);
  s=base("Mustahkamlash savollari"); list(s,pts.map(x=>`${x} — tushuntiring`));
  s=base("Mustaqil topshiriqlar"); list(s,["Mavzu bo'yicha qisqa hisobot tayyorlang","Natijani fayl sifatida platformaga yuklang"]);
  s=base("Xulosa"); list(s,pts);
  await pp.writeFile({fileName:`presentations/${code}.pptx`}); console.log("OK",code);
}}
main();
