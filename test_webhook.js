const url = "https://script.google.com/macros/s/AKfycbz1wmlDZgrXVcoRn41mVzpoSxzT595WTFMA9WZIPFFn1Qq-f4ufuctsqhNPE3jriBgJ/exec";
const payload = {
  id: "test-capa-1",
  capaNo: "NCR-2026-999",
  date: "2026-08-09",
  month: "أغسطس",
  source: "فحص جودة (QC)",
  targetDepartment: "قسم البثق PPR",
  subject: "بلاغ عيب ميداني: تجربة النظام",
  ncrDescription: "هذه رسالة تجريبية لاختبار عمل الـ Webhook مع الرؤوس الديناميكية.",
  immediateAction: "لا يوجد",
  priority: "عالي (High)",
  status: "مفتوح (Open)",
  requesterName: "النظام",
  responsiblePerson: "مهندس الجودة",
  targetDate: "2026-08-12",
  delayDays: 0,
  productName: "منتج تجريبي",
  lotNumber: "LOT-999",
  fiveWhys: {
    why1: "التجربة الأولى",
    why2: "",
    why3: "",
    why4: "",
    why5: ""
  },
  rootCause: "تحت الفحص",
  correctiveAction: "قيد المراجعة",
  preventiveAction: "غير محدد",
  effectivenessEval: "قيد التقييم (Pending)",
  notes: "اختبار إنشاء الأعمدة"
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
