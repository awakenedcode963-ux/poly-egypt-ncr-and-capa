const url = "https://script.google.com/macros/s/AKfycbwMHHGI0ZdolpWp-FM5vcqdRelNmJc-lBjoium-isZ484IlCtGp6eLSIkIA4fw3FhVR/exec";
const payload = {
  id: "test-capa-3",
  capaNo: "NCR-2026-777",
  date: "2026-08-09",
  month: "أغسطس",
  source: "فحص جودة (QC)",
  targetDepartment: "قسم الحقن",
  subject: "اختبار مع كود الماكينة وتاريخين (رابط جديد)",
  ncrDescription: "اختبار ديناميكية الأعمدة مع كود الماكينة.",
  immediateAction: "حجز",
  priority: "متوسط (Medium)",
  status: "مفتوح (Open)",
  requesterName: "النظام الجديد",
  responsiblePerson: "مدير الجودة",
  targetDate: "2026-08-15",
  actualDate: "2026-08-16",
  delayDays: 1,
  productName: "وصلة",
  machineCode: "INJ-FITT-03",
  lotNumber: "LOT-888",
  fiveWhys: {
    why1: "التجربة الثالثة",
    why2: "أعمدة صحيحة",
    why3: "",
    why4: "",
    why5: ""
  },
  rootCause: "لا يوجد",
  preventiveAction: "تم تعديل الماكينة",
  effectivenessEval: "جزئي (Partial)",
  notes: "ملاحظات إضافية"
};

fetch(url, {
  method: "POST",
  body: JSON.stringify(payload),
  headers: {
    "Content-Type": "text/plain;charset=utf-8"
  }
})
.then(res => res.json())
.then(data => console.log("Response:", data))
.catch(err => console.error("Error:", err));
