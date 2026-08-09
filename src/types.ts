export type ProductCategory = 'pipe' | 'fitting';

export interface PipeProduct {
  code: string;
  name: string;
  rawLineIndex?: number;
}

export interface FittingProduct {
  code: string;
  name: string;
  material: string; // PPR | UPVC
  rawLineIndex?: number;
}

export interface DefectCode {
  code: string;
  name: string;
  type: 'pipe' | 'fitting';
}

export interface Inspector {
  id: string;
  name: string;
  originalName?: string;
  department?: string;
}

export interface Machine {
  id: string;
  code: string;
  type: 'extrusion' | 'injection';
  department?: string;
  installDate?: string;
  expectedLifeYears?: number;
  status?: 'ممتازة' | 'يعتمد عليها' | 'تحتاج صيانة' | 'متهالكة';
}

export interface Shift {
  code: string;
  name: string;
}

export interface Month {
  code: string;
  name: string;
}

export interface AuditIssue {
  id: string;
  section: 'pipes' | 'fittings' | 'pipe_defects' | 'fitting_defects' | 'inspectors' | 'machines' | 'sheets_formula';
  severity: 'critical' | 'warning' | 'info';
  issueType: 'duplicate_code' | 'spelling_typo' | 'invalid_code' | 'format_inconsistency' | 'missing_value' | 'structure_flaw';
  title: string;
  description: string;
  itemCode?: string;
  originalValue: string;
  suggestedValue: string;
  arabicAdvice: string;
  autoFixable: boolean;
  applied: boolean;
}

// Module 1: Pipe & Fitting Inspection Log
export interface InspectionLog {
  id: string;
  date: string; // YYYY-MM-DD
  month?: string;
  category: ProductCategory;
  productCode: string;
  productName: string;
  material?: string;
  machineCode: string;
  inspectorName: string;
  shiftName: string;
  sampleSize: number;
  defectiveQty: number;
  rejectRate: number; // calculated percentage
  defectCode: string;
  defectName: string;
  status: 'مقبول (Pass)' | 'مرفوض (Fail)' | 'مقبول بشروط (Conditional)';
  cycleTime?: number;
  weightPerUnit?: number;
  materialBatch?: string;
  notes: string;
}

// Module 2: Mixing Review Log
export interface MixingLog {
  id: string;
  date: string;
  month: string;
  shift: string;
  supervisor: string;
  observer: string;
  batchNo: string;
  totalBatches: number;
  pvcActualKg: number;        // Standard e.g. 200kg
  stabilizerActualKg: number; // Standard e.g. 4.5kg
  calciumActualKg: number;    // Standard e.g. 75kg
  waxActualKg: number;        // Standard e.g. 1.2kg
  pigmentActualKg: number;    // Standard e.g. 0.5kg
  modifierActualKg: number;   // Standard e.g. 8kg
  lubricantActualKg: number;  // Standard e.g. 4kg
  totalActualKg: number;
  deviationKg: number;
  deviationPct: number;
  status: 'OK' | 'Warning' | 'Reject';
  notes?: string;
}

// Module 3: Injection Production Log
export interface InjectionLog {
  id: string;
  date: string;
  month: string;
  shift: string;
  machineCode: string;
  operatorName: string;
  productCode: string;
  productName: string;
  cycleTime: number;
  goodQty: number;
  rejectQty: number;
  rejectPct: number;
  materialUsedKg: number;
  masterbatchUsedKg: number;
  efficiencyPct: number;
  downtimeHours: number;
  downtimeReason: string;
  scrapWeightKg: number;
  runnerWeightKg: number;
  flashWeightKg: number;
  notes?: string;
}

// Module 4: Maintenance Logs
export interface PreventiveLog {
  id: string;
  date: string;
  month: string;
  machineCode: string;
  maintType: 'دورية (Monthly)' | 'فصلية (Quarterly)' | 'سنوية (Annual)';
  description: string;
  technicianName: string;
  shift: string;
  durationHours: number;
  costEGP: number;
  nextDueDate: string;
  status: 'في الموعد (On Time)' | 'متأخرة (Overdue)' | 'مكتملة (Completed)';
  notes?: string;
}

export interface BreakdownLog {
  id: string;
  date: string;
  month: string;
  machineCode: string;
  description: string;
  rootCause: string;
  downtimeHours: number;
  technicianName: string;
  shift: string;
  partsReplaced: string;
  costEGP: number;
  repairStatus: 'مكتمل (Fixed)' | 'قيد الإصلاح (In Progress)' | 'في انتظار قطع غيار (Waiting Parts)';
  closeDate?: string;
  notes?: string;
}

export interface MachineLife {
  machineCode: string;
  machineName: string;
  type: 'extrusion' | 'injection';
  installDate: string;
  expectedLifeYears: number;
  currentAgeDays: number;
  totalOperatingHours: number;
  totalBreakdowns: number;
  totalMaintCostEGP: number;
  currentStatus: 'ممتازة' | 'يعتمد عليها' | 'تحتاج صيانة' | 'متهالكة';
  efficiencyRemainingPct: number;
}

// Module 5: CAPA Request Log (Phase 1 Focus)
export interface FiveWhysAnalysis {
  why1: string; // لماذا حدثت المشكلة مباشرة؟
  why2: string; // لماذا حدث السبب الأول؟
  why3: string; // لماذا ظهر الخلل التشغيلي أو الفني؟
  why4: string; // لماذا لم تكشفها أنظمة الرقابة/الصيانة؟
  why5: string; // السبب الجذر النهائي المنهجي (Root Cause)
}

export interface CAPARequest {
  id: string;
  capaNo: string; // e.g. CAPA-2026-001
  date: string;
  month: string;
  requesterName: string;
  targetDepartment: string;
  source: 'فحص جودة (QC)' | 'شكوى عميل (Customer)' | 'تدقيق داخلي (Audit)' | 'عطل صيانة (Maint)';
  priority: 'حرج (Critical)' | 'عالي (High)' | 'متوسط (Medium)' | 'منخفض (Low)';
  subject: string;
  ncrDescription: string;
  rootCause: string;
  fiveWhys?: FiveWhysAnalysis;
  productName?: string;
  machineCode?: string;
  lotNumber?: string;
  status: 'مفتوح (Open)' | 'قيد التنفيذ (In Progress)' | 'تم التنفيذ (Done)' | 'مغلق (Closed)';
  immediateAction: string;
  preventiveAction?: string;
  responsiblePerson: string;
  targetDate: string;
  actualDate?: string;
  delayDays: number;
  effectivenessEval: 'فعال (Effective)' | 'جزئي (Partial)' | 'غير فعال (Ineffective)' | 'قيد التقييم (Pending)';
  notes?: string;
}

// Full Combined Master Data State
export interface MasterDataState {
  pipes: PipeProduct[];
  fittings: FittingProduct[];
  pipeDefects: DefectCode[];
  fittingDefects: DefectCode[];
  inspectors: Inspector[];
  extrusionMachines: Machine[];
  injectionMachines: Machine[];
  shifts: Shift[];
  months: Month[];
  supervisors: string[];
  operators: string[];
  technicians: string[];
  departments: string[];
}
