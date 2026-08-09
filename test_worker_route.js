const url = "https://script.google.com/macros/s/AKfycbzKLHPein0HNe66KRPsWAB5_C62pHOSGAKTIDP7_zmvZ_iu5HG-oqrX2AQkQZLsFiF-/exec";
const payload = {
  id: "test-capa-worker-route",
  capaNo: "NCR-2026-WORKER",
  date: "2026-08-09",
  month: "أغسطس",
  source: "فحص جودة (QC)",
  targetDepartment: "قسم البثق PPR",
  subject: "بلاغ عيب ميداني: فقاعات هوائية ومسامية داخلية - EXT-PPR-01 - خط بثق أنابيب PPR رقم 1",
  ncrDescription: "تم تسجيل البلاغ بواسطة الفني/المشرف: أحمد (الوردية الأولى (صباحية)). ملاحظات: لا توجد ملاحظات إضافية.",
  immediateAction: "إيقاف الخط فوراً",
  priority: "عالي (High)",
  status: "مفتوح (Open)",
  requesterName: "أحمد",
  responsiblePerson: "مهندس الجودة المناظر",
  targetDate: "2026-08-15",
  delayDays: 0,
  productName: "أنبوب PPR",
  machineCode: "EXT-PPR-01",
  lotNumber: "LOT-999-W",
  fiveWhys: {
    why1: "حدوث عيب (فقاعات هوائية) بمنتج أنبوب PPR باللوط LOT-999-W.",
    why2: "جاري فحص معايير التشغيل بالخط مع فني الوردية.",
    why3: "قيد التحليل الفني والبحث الميداني.",
    why4: "قيد التحقيق الميداني بواسطة مهندس الجودة.",
    why5: "سيتحدد الإجراء الوقائي النهائي بعد إغلاق التحقيق."
  },
  rootCause: "جاري استكمال تحليل 5 Whys",
  preventiveAction: "جاري التقييم والاعتماد",
  effectivenessEval: "قيد التقييم (Pending)",
  notes: ""
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
