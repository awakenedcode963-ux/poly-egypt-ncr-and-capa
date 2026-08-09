const url = "https://script.google.com/macros/s/AKfycbzKLHPein0HNe66KRPsWAB5_C62pHOSGAKTIDP7_zmvZ_iu5HG-oqrX2AQkQZLsFiF-/exec";
const payload = {
  id: "test-capa-4",
  capaNo: "NCR-2026-111",
  date: "2026-08-09",
  month: "أغسطس",
  source: "فحص جودة (QC)",
  targetDepartment: "قسم الحقن",
  subject: "اختبار مع كود الماكينة وتاريخين (الرابط الأخير)",
  ncrDescription: "هذه تجربة لاختبار الأعمدة الجديدة",
  immediateAction: "إيقاف الماكينة",
  priority: "عالي (High)",
  status: "مفتوح (Open)",
  requesterName: "النظام الجديد",
  responsiblePerson: "مدير الجودة",
  targetDate: "2026-08-15",
  actualDate: "2026-08-16",
  delayDays: 1,
  productName: "وصلة T",
  machineCode: "INJ-FITT-03",
  lotNumber: "LOT-888",
  fiveWhys: {
    why1: "التجربة الرابعة",
    why2: "أعمدة صحيحة",
    why3: "",
    why4: "",
    why5: ""
  },
  rootCause: "خطأ بشري",
  preventiveAction: "تدريب العمال",
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
