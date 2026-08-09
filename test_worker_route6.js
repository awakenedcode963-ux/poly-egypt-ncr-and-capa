const url = "https://script.google.com/macros/s/AKfycbzKLHPein0HNe66KRPsWAB5_C62pHOSGAKTIDP7_zmvZ_iu5HG-oqrX2AQkQZLsFiF-/exec";
const payload = {
  id: "test-capa-worker-optional-fields",
  capaNo: "NCR-2026-WORKER-2",
  date: "2026-08-09",
  month: "أغسطس",
  source: "فحص جودة (QC)",
  targetDepartment: "قسم البثق PPR",
  subject: "بلاغ عيب ميداني: فقاعات هوائية - EXT-PPR-01",
  ncrDescription: "تم تسجيل البلاغ بواسطة: حسين (الوردية الأولى (صباحية)). ملاحظات: اختبار الحقول الجديدة.",
  immediateAction: "تم سحب العينة",
  correctiveAction: "تعديل إعدادات السخان",
  preventiveAction: "مراجعة صيانة السخانات شهريا",
  priority: "عالي (High)",
  status: "مفتوح (Open)",
  requesterName: "حسين",
  responsiblePerson: "مهندس الجودة المناظر",
  targetDate: "2026-08-15",
  delayDays: 0,
  productName: "أنبوب PPR",
  machineCode: "EXT-PPR-01",
  lotNumber: "LOT-123-NEW",
  attachmentUrl: "صورة مرفقة",
  fiveWhys: {
    why1: "حدوث عيب",
    why2: "",
    why3: "",
    why4: "",
    why5: ""
  },
  rootCause: "جاري استكمال تحليل 5 Whys",
  effectivenessEval: "قيد التقييم (Pending)",
  notes: "اختبار الحقول الجديدة"
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
