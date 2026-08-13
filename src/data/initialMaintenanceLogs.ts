import { PreventiveLog, BreakdownLog, MachineLife } from '../types';

export const INITIAL_PREVENTIVE_LOGS: PreventiveLog[] = [];
export const INITIAL_BREAKDOWN_LOGS: BreakdownLog[] = [];

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
