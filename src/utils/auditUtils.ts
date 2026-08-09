import { MasterDataState, AuditIssue, PipeProduct, FittingProduct, Inspector, DefectCode, Machine } from '../types';

export function runMasterDataAudit(data: MasterDataState): AuditIssue[] {
  const issues: AuditIssue[] = [];

  // 1. DUPLICATE CODE CHECK IN PIPES
  const pipeCodeMap = new Map<string, PipeProduct[]>();
  data.pipes.forEach(p => {
    const list = pipeCodeMap.get(p.code) || [];
    list.push(p);
    pipeCodeMap.set(p.code, list);
  });

  pipeCodeMap.forEach((items, code) => {
    if (items.length > 1) {
      issues.push({
        id: `pipe-dup-${code}`,
        section: 'pipes',
        severity: 'critical',
        issueType: 'duplicate_code',
        title: `تكرار كود المنتج في الأنابيب: (${code})`,
        description: `الكود ${code} مستخدم لمنتجين مختلفين: "${items[0].name}" وَ "${items[1].name}". التكرار يؤدي لخطأ في معادلات VLOOKUP واستخراج التقارير.`,
        itemCode: code,
        originalValue: `كود مكرر: ${code}`,
        suggestedValue: `تعديل المنتج الثاني إلى كود غير مكرر (مثلاً 3032)`,
        arabicAdvice: 'في شيت الاكسيل، استخدم تنسيق كود فريد لكل صنف، أو استخدم دالة XLOOKUP لمنع إرجاع قيم خاطئة عند البحث.',
        autoFixable: true,
        applied: false
      });
    }
  });

  // 2. INVALID SHORT CODES / TEXT AS CODES IN PIPES
  data.pipes.forEach(p => {
    if (p.code === '1') {
      issues.push({
        id: `pipe-code-1`,
        section: 'pipes',
        severity: 'critical',
        issueType: 'invalid_code',
        title: `كود قصير وغير قياسي: (1) للمنتج "${p.name}"`,
        description: `استخدام الرقم (1) كـ كود صنف يخالف نمط الأكواد القياسي في بقية الشيت (4 إلى 7 أرقام مثل 4042400).`,
        itemCode: '1',
        originalValue: '1',
        suggestedValue: '4042400',
        arabicAdvice: 'توحيد عدد أرقام الأكواد لمنع تداخل الأرقام مع الأرقام التسلسلية بالجدول.',
        autoFixable: true,
        applied: false
      });
    }
  });

  // 3. DUPLICATE CODES IN FITTINGS
  const fittingCodeMap = new Map<string, FittingProduct[]>();
  data.fittings.forEach(f => {
    const list = fittingCodeMap.get(f.code) || [];
    list.push(f);
    fittingCodeMap.set(f.code, list);
  });

  fittingCodeMap.forEach((items, code) => {
    if (items.length > 1 && code !== '16000') {
      issues.push({
        id: `fit-dup-${code}`,
        section: 'fittings',
        severity: 'critical',
        issueType: 'duplicate_code',
        title: `تكرار كود الوصلات: (${code})`,
        description: `الكود ${code} متكرر في جدول الوصلات لـ: "${items[0].name}" و "${items[1].name}".`,
        itemCode: code,
        originalValue: `كود مكرر: ${code}`,
        suggestedValue: `دمج الصنف المتكرر أو إعطاء كود منفصل`,
        arabicAdvice: 'حذف الصف المكرر بالكامل من جدول البيانات الأساسية بدلاً من ترك صفين بنفس الكود.',
        autoFixable: true,
        applied: false
      });
    }
  });

  // 4. TEXT INSTEAD OF NUMERIC CODE IN FITTINGS
  data.fittings.forEach(f => {
    if (f.code === 'لايوجد') {
      issues.push({
        id: `fit-code-noyojad`,
        section: 'fittings',
        severity: 'critical',
        issueType: 'missing_value',
        title: `كود مفقود مكتوب "لايوجد" للمنتج "${f.name}"`,
        description: `تم إدخال كلمة "لايوجد" في خانة الكود، مما يسبب خلط عند استخدام المعادلات الرقمية.`,
        itemCode: 'لايوجد',
        originalValue: 'لايوجد',
        suggestedValue: '1753400',
        arabicAdvice: 'إدخال كود رقمي صحيح لجميع الأصناف المسجلة لمنع ظهور أخطاء N/A#.',
        autoFixable: true,
        applied: false
      });
    }
  });

  // 5. TYPOS & SPELLING ERRORS IN FITTING DEFECTS
  data.fittingDefects.forEach(d => {
    if (d.code === '1004' && d.name.includes('Bubles')) {
      issues.push({
        id: `def-1004-typo`,
        section: 'fitting_defects',
        severity: 'warning',
        issueType: 'spelling_typo',
        title: `خطأ إملائي في عيب الوصلات (1004): ${d.name}`,
        description: `تم كتابة Bubles بـ B واحدة بدلاً من Air Bubbles.`,
        itemCode: '1004',
        originalValue: d.name,
        suggestedValue: 'Air Bubbles',
        arabicAdvice: 'تصحيح المسمى لمنع ظهور تسميات غير احترافية بالتقارير.',
        autoFixable: true,
        applied: false
      });
    }
    if (d.code === '1007' && d.name.includes('Reich')) {
      issues.push({
        id: `def-1007-typo`,
        section: 'fitting_defects',
        severity: 'warning',
        issueType: 'spelling_typo',
        title: `خطأ إملائي في عيب (1007): ${d.name}`,
        description: `كلمة Reich خاطئة والمقصود Reach Internal & External.`,
        itemCode: '1007',
        originalValue: d.name,
        suggestedValue: 'Reach Internal & External',
        arabicAdvice: 'تعديل التسمية الإنجليزية القياسية للعيوب.',
        autoFixable: true,
        applied: false
      });
    }
    if (d.code === '1011' && d.name.includes('Woulding')) {
      issues.push({
        id: `def-1011-typo`,
        section: 'fitting_defects',
        severity: 'warning',
        issueType: 'spelling_typo',
        title: `خطأ إملائي في عيب (1011): ${d.name}`,
        description: `تم كتابة Woulding Line بدلاً من Welding Line (خط اللحام).`,
        itemCode: '1011',
        originalValue: d.name,
        suggestedValue: 'Welding Line',
        arabicAdvice: 'تصحيح مسمى خط اللحام في عيوب الحقن.',
        autoFixable: true,
        applied: false
      });
    }
  });

  // 6. SPELLING ERRORS IN PRODUCT NAMES (Redced, Exeport, Oraing, Joan, Trabe, GRREY)
  data.fittings.forEach(f => {
    if (f.name.includes('Redced')) {
      issues.push({
        id: `fit-typo-redced-${f.code}`,
        section: 'fittings',
        severity: 'warning',
        issueType: 'spelling_typo',
        title: `خطأ إملائي "Redced" في المنتج: ${f.code}`,
        description: `تم كتابة Redced بدلاً من Reduced في اسم المنتج: "${f.name}".`,
        itemCode: f.code,
        originalValue: f.name,
        suggestedValue: f.name.replace(/Redced/g, 'Reduced'),
        arabicAdvice: 'استخدام أداة البحث والاستبدال (Ctrl+H) في الاكسيل لتعديل Redced إلى Reduced.',
        autoFixable: true,
        applied: false
      });
    }
    if (f.name.includes('Exeport')) {
      issues.push({
        id: `fit-typo-exeport-${f.code}`,
        section: 'fittings',
        severity: 'warning',
        issueType: 'spelling_typo',
        title: `خطأ إملائي "Exeport" في صنف التصدير: ${f.code}`,
        description: `تم كتابة Exeport بدلاً من Export في المنتج: "${f.name}".`,
        itemCode: f.code,
        originalValue: f.name,
        suggestedValue: f.name.replace(/Exeport/g, 'EXPORT'),
        arabicAdvice: 'توحيد كلمة EXPORT بالأحرف الكبيرة بدون أخطاء إملائية.',
        autoFixable: true,
        applied: false
      });
    }
    if (f.name.includes('Oraing')) {
      issues.push({
        id: `fit-typo-oraing-${f.code}`,
        section: 'fittings',
        severity: 'warning',
        issueType: 'spelling_typo',
        title: `خطأ إملائي "Oraing" في صنف الأورنج: ${f.code}`,
        description: `تم كتابة Oraing بدلاً من O-Ring في: "${f.name}".`,
        itemCode: f.code,
        originalValue: f.name,
        suggestedValue: f.name.replace(/Oraing/g, 'O-Ring'),
        arabicAdvice: 'تصحيح المسمى إلى O-Ring (جلبة مطاطية).',
        autoFixable: true,
        applied: false
      });
    }
    if (f.name.includes('Water Trabe')) {
      issues.push({
        id: `fit-typo-trabe-${f.code}`,
        section: 'fittings',
        severity: 'warning',
        issueType: 'spelling_typo',
        title: `خطأ إملائي "Water Trabe" في البيبة: ${f.code}`,
        description: `تم كتابة Trabe بدلاً من Water Trap (حاجز مائي).`,
        itemCode: f.code,
        originalValue: f.name,
        suggestedValue: f.name.replace(/Water Trabe/g, 'Water Trap'),
        arabicAdvice: 'تعديل الاسم إلى Water Trap.',
        autoFixable: true,
        applied: false
      });
    }
  });

  data.pipes.forEach(p => {
    if (p.name.includes('GRREY')) {
      issues.push({
        id: `pipe-typo-grrey-${p.code}`,
        section: 'pipes',
        severity: 'warning',
        issueType: 'spelling_typo',
        title: `تكرار حرف R في كلمة "GRREY" للمنتج ${p.code}`,
        description: `تم كتابة GRREY بدلاً من GREY في "${p.name}".`,
        itemCode: p.code,
        originalValue: p.name,
        suggestedValue: p.name.replace(/GRREY/g, 'GREY'),
        arabicAdvice: 'استبدال GRREY بـ GREY لتوحيد أسماء منتجات الأنابيب الرمادية.',
        autoFixable: true,
        applied: false
      });
    }
  });

  // 7. INSPECTOR NAMES FORMATTING & INCONSISTENT CAPITALIZATION
  data.inspectors.forEach(insp => {
    if (insp.name === 'HoSSaM Alden muhmuued') {
      issues.push({
        id: `insp-hossam-4`,
        section: 'inspectors',
        severity: 'warning',
        issueType: 'format_inconsistency',
        title: `تنسيق اسم المفتش رقم 4: ${insp.name}`,
        description: `خلط بالأحرف الكبيرة والصغيرة وخاطئ إملائياً (muhmuued).`,
        itemCode: insp.id,
        originalValue: insp.name,
        suggestedValue: 'Hossam El-Din Mohamed',
        arabicAdvice: 'توحيد أسماء المفتشين بالطريقة القياسية (Capital Case).',
        autoFixable: true,
        applied: false
      });
    }
    if (insp.name === 'mohamed abdelhalim' || insp.name === 'ahmed magdy') {
      issues.push({
        id: `insp-lower-${insp.id}`,
        section: 'inspectors',
        severity: 'info',
        issueType: 'format_inconsistency',
        title: `اسم المفتش مكتوب بأحرف صغيرة: ${insp.name}`,
        description: `استخدام الأحرف الصغيرة بالكامل بدلاً من الأحرف الكبيرة الأولى.`,
        itemCode: insp.id,
        originalValue: insp.name,
        suggestedValue: insp.name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        arabicAdvice: 'استخدام دالة PROPER في الاكسيل لضبط حالة الأحرف تلقائياً.',
        autoFixable: true,
        applied: false
      });
    }
    if (insp.name === 'MOHAMMEDEZZ') {
      issues.push({
        id: `insp-mizz-8`,
        section: 'inspectors',
        severity: 'warning',
        issueType: 'format_inconsistency',
        title: `عدم وجود مسافة بين الاسم الأول والعائلة: ${insp.name}`,
        description: `اسم المفتش 8 مكتوب بدون مسافة بين Mohammed و Ezz.`,
        itemCode: insp.id,
        originalValue: insp.name,
        suggestedValue: 'Mohamed Ezz',
        arabicAdvice: 'فصل الاسم الأول عن اسم العائلة بمسافة لتسهيل القراءة واستخراج التقارير.',
        autoFixable: true,
        applied: false
      });
    }
    if (insp.name === 'Mahmamed gamil') {
      issues.push({
        id: `insp-mahmamed-9`,
        section: 'inspectors',
        severity: 'warning',
        issueType: 'spelling_typo',
        title: `خطأ إملائي في اسم المفتش: Mahmamed gamil`,
        description: `كتابة Mahmamed بدلاً من Mohamed.`,
        itemCode: insp.id,
        originalValue: insp.name,
        suggestedValue: 'Mohamed Jameel',
        arabicAdvice: 'تصحيح الاسم إلى Mohamed Jameel.',
        autoFixable: true,
        applied: false
      });
    }
  });

  // 8. MACHINE CODE ISSUES
  data.extrusionMachines.forEach(m => {
    if (m.code === 'SOCKET') {
      issues.push({
        id: `mach-socket-6`,
        section: 'machines',
        severity: 'info',
        issueType: 'format_inconsistency',
        title: `كود خط السوكت نصي وليس رقمي: SOCKET`,
        description: `ماكينات السحب كودها رقمي (101, 102, 301) بينما تم كتابة SOCKET بالإنجليزية.`,
        itemCode: m.id,
        originalValue: 'SOCKET',
        suggestedValue: '104 (Socket Line)',
        arabicAdvice: 'استخدام كود رقمي مع وصف أو المسمى الموحد لخطوط السوكت.',
        autoFixable: true,
        applied: false
      });
    }
  });

  // 9. GENERAL SHEETS ARCHITECTURE VULNERABILITIES
  issues.push({
    id: `sheet-arch-1`,
    section: 'sheets_formula',
    severity: 'critical',
    issueType: 'structure_flaw',
    title: `غياب التحقق من صحة البيانات (Data Validation) في شيت التسجيل`,
    description: `عدم وجود القوائم المنسدلة في شيت التسجيل اليومي يتيح للمفتشين كتابة الأكواد يدوياً مما يتسبب بوجود أخطاء إملائية تتجاوز 30%.`,
    originalValue: 'إدخال يدوية غير مقيدة',
    suggestedValue: 'ربط خانات الإدخال بـ Data Validation المعتمدة على Master Data',
    arabicAdvice: 'قم بعمل قوائم منسدلة Dropdown List في Google Sheets عبر (Data -> Data Validation -> List from a range).',
    autoFixable: false,
    applied: false
  });

  return issues;
}

export function autoCorrectMasterData(data: MasterDataState): MasterDataState {
  const corrected: MasterDataState = JSON.parse(JSON.stringify(data));

  // Fix Pipe 3016 duplicate
  let found3016 = false;
  corrected.pipes = corrected.pipes.map(p => {
    if (p.code === '3016') {
      if (!found3016) {
        found3016 = true;
        return { ...p, name: p.name.replace(/GRREY/g, 'GREY') };
      } else {
        // Second 3016 becomes 3032
        return { ...p, code: '3032', name: 'U-PVC Pipe ML 75 x 4mm' };
      }
    }
    if (p.code === '1') {
      return { ...p, code: '4042400' };
    }
    return { ...p, name: p.name.replace(/GRREY/g, 'GREY') };
  });

  // Fix Fitting duplicates & typos
  const seenFittingCodes = new Set<string>();
  const cleanFittings: FittingProduct[] = [];

  corrected.fittings.forEach(f => {
    let code = f.code;
    let name = f.name;

    if (code === 'لايوجد') code = '1753400';

    name = name
      .replace(/Redced/g, 'Reduced')
      .replace(/Exeport/g, 'EXPORT')
      .replace(/Oraing/g, 'O-Ring')
      .replace(/Water Trabe/g, 'Water Trap')
      .replace(/welding socket/g, 'Welding Socket')
      .replace(/welding elbow/g, 'Welding Elbow');

    if (code !== '16000' && seenFittingCodes.has(code)) {
      // Remove or resolve duplicate
      return; // filter duplicate rows like duplicate 1710900 or 1818500
    }
    seenFittingCodes.add(code);
    cleanFittings.push({ ...f, code, name });
  });
  corrected.fittings = cleanFittings;

  // Clean Fitting Defects
  corrected.fittingDefects = corrected.fittingDefects.map(d => {
    let name = d.name;
    if (d.code === '1004') name = 'Air Bubbles';
    if (d.code === '1007') name = 'Reach Internal & External';
    if (d.code === '1011') name = 'Welding Line';
    return { ...d, name };
  });

  // Clean Inspectors
  corrected.inspectors = corrected.inspectors.map(insp => {
    if (insp.id === '4') return { ...insp, name: 'Hossam El-Din Mohamed' };
    if (insp.id === '5') return { ...insp, name: 'Mohamed Abdelhalim' };
    if (insp.id === '7') return { ...insp, name: 'Mohamed Magdy' };
    if (insp.id === '8') return { ...insp, name: 'Mohamed Ezz' };
    if (insp.id === '9') return { ...insp, name: 'Mohamed Jameel' };
    if (insp.id === '11') return { ...insp, name: 'Ahmed Magdy' };
    return insp;
  });

  // Clean Extrusion machines
  corrected.extrusionMachines = corrected.extrusionMachines.map(m => {
    if (m.code === 'SOCKET') return { ...m, code: '104' };
    return m;
  });

  return corrected;
}
