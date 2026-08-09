import { PreventiveLog, BreakdownLog, MachineLife } from '../types';

export const INITIAL_PREVENTIVE_LOGS: PreventiveLog[] = [
  {
    id: 'PM-101',
    date: '2026-08-01',
    month: 'أغسطس',
    machineCode: '101',
    maintType: 'دورية (Monthly)',
    description: 'تشحيم الجيربوكس، فحص السخانات الهيدروليكية، وتنظيف الفلاتر',
    technicianName: 'فني سعيد مصطفى (ميكانيكا)',
    shift: 'وردية AB',
    durationHours: 3.5,
    costEGP: 1200,
    nextDueDate: '2026-09-01',
    status: 'مكتملة (Completed)',
    notes: 'تم استبدال زيت الجيربوكس بنجاح'
  },
  {
    id: 'PM-102',
    date: '2026-07-15',
    month: 'يوليو',
    machineCode: '202',
    maintType: 'فصلية (Quarterly)',
    description: 'معايرة ضغط هيدروليك الحقن وإعادة تشغيل الانفرتر',
    technicianName: 'م. خالد الصيانة (كهرباء)',
    shift: 'وردية BC',
    durationHours: 5.0,
    costEGP: 3500,
    nextDueDate: '2026-08-05',
    status: 'متأخرة (Overdue)',
    notes: 'تأخر الصيانة الوقائية بسبب ضغط خط الإنتاج'
  }
];

export const INITIAL_BREAKDOWN_LOGS: BreakdownLog[] = [
  {
    id: 'BD-201',
    date: '2026-08-02',
    month: 'أغسطس',
    machineCode: '202',
    description: 'توقف مفاجئ في موتور الهيدروليك وارتفاع الحرارة',
    rootCause: 'تلف رولمان بلي الموتور الرئيسي نتيجة نقص التشحيم',
    downtimeHours: 6.5,
    technicianName: 'فني حسن عبد الرحمن (هيدروليك)',
    shift: 'وردية BC',
    partsReplaced: 'عدد 2 رولمان بلي SKF + مانع تسرب زيت',
    costEGP: 4800,
    repairStatus: 'مكتمل (Fixed)',
    closeDate: '2026-08-02',
    notes: 'عادت الماكينة للعمل بكفاءة'
  },
  {
    id: 'BD-202',
    date: '2026-08-04',
    month: 'أغسطس',
    machineCode: '301',
    description: 'كسر في سكينة التقطيع الأوتوماتيكي لخط الأنابيب',
    rootCause: 'إجهاد ميكانيكي عالي على نصل السكينة',
    downtimeHours: 12.0,
    technicianName: 'فني سعيد مصطفى (ميكانيكا)',
    shift: 'وردية AB',
    partsReplaced: 'نصل سكينة تقطيع هيدروليكي 110mm',
    costEGP: 7200,
    repairStatus: 'في انتظار قطع غيار (Waiting Parts)',
    notes: 'تم طلب القطعة من المورد المحلي'
  }
];

export const INITIAL_MACHINE_LIFE: MachineLife[] = [
  {
    machineCode: '101',
    machineName: 'خط بثق أنابيب PPR 101',
    type: 'extrusion',
    installDate: '2020-03-15',
    expectedLifeYears: 10,
    currentAgeDays: 2337,
    totalOperatingHours: 18500,
    totalBreakdowns: 14,
    totalMaintCostEGP: 45000,
    currentStatus: 'ممتازة',
    efficiencyRemainingPct: 88.5
  },
  {
    machineCode: '202',
    machineName: 'ماكينة حقن وصلات 202',
    type: 'injection',
    installDate: '2018-06-10',
    expectedLifeYears: 8,
    currentAgeDays: 2981,
    totalOperatingHours: 24200,
    totalBreakdowns: 32,
    totalMaintCostEGP: 92000,
    currentStatus: 'تحتاج صيانة',
    efficiencyRemainingPct: 62.0
  },
  {
    machineCode: '301',
    machineName: 'خط بثق أنابيب UPVC 301',
    type: 'extrusion',
    installDate: '2015-01-20',
    expectedLifeYears: 12,
    currentAgeDays: 4218,
    totalOperatingHours: 36800,
    totalBreakdowns: 48,
    totalMaintCostEGP: 145000,
    currentStatus: 'متهالكة',
    efficiencyRemainingPct: 45.0
  }
];
