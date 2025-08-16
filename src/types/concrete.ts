export interface ConcreteClass {
  name: string;
  fck: number; // Characteristic compressive strength (MPa)
  fcd: number; // Design compressive strength (MPa)
  density: number; // kg/m³
}

export interface SteelGrade {
  name: string;
  fyk: number; // Characteristic yield strength (MPa)
  fyd: number; // Design yield strength (MPa)
  density: number; // kg/m³
}

export interface ElementGeometry {
  width: number; // m
  depth: number; // m
  height: number; // m
}

export interface ReinforcementConfig {
  longitudinalBars: {
    number: number;
    diameter: number; // mm
  };
  stirrups: {
    diameter: number; // mm
    spacing: number; // mm
    legs: number;
  };
  cover: number; // mm
}

export interface Loads {
  axialForce: number; // kN
  momentX: number; // kNm
  momentY: number; // kNm
  shearX: number; // kN
  shearY: number; // kN
}

export interface CalculationResults {
  concreteVolume: number; // m³
  longitudinalSteelWeight: number; // kg
  stirrupWeight: number; // kg
  totalSteelWeight: number; // kg
  reinforcementRatio: number; // %
  minReinforcement: number; // %
  maxReinforcement: number; // %
  compliance: ComplianceCheck;
  stresses?: StressAnalysis;
}

export interface ComplianceCheck {
  reinforcementRatio: boolean;
  minSpacing: boolean;
  maxSpacing: boolean;
  cover: boolean;
  shearReinforcement: boolean;
  overall: boolean;
}

export interface StressAnalysis {
  neutralAxis: number; // mm
  compressionStress: number; // MPa
  tensionStress: number; // MPa
  crackWidth: number; // mm
  utilization: number; // %
}

export type ElementType = 'column' | 'footing';