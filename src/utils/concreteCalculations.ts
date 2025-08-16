import {
  ConcreteClass,
  SteelGrade,
  ElementGeometry,
  ReinforcementConfig,
  Loads,
  CalculationResults,
  ComplianceCheck,
  StressAnalysis,
  ElementType
} from '@/types/concrete';

// Standard concrete classes according to Eurocode 2
export const CONCRETE_CLASSES: ConcreteClass[] = [
  { name: 'C20/25', fck: 20, fcd: 13.3, density: 2400 },
  { name: 'C25/30', fck: 25, fcd: 16.7, density: 2400 },
  { name: 'C30/37', fck: 30, fcd: 20.0, density: 2400 },
  { name: 'C35/45', fck: 35, fcd: 23.3, density: 2400 },
  { name: 'C40/50', fck: 40, fcd: 26.7, density: 2400 },
  { name: 'C45/55', fck: 45, fcd: 30.0, density: 2400 },
  { name: 'C50/60', fck: 50, fcd: 33.3, density: 2400 }
];

// Standard steel grades
export const STEEL_GRADES: SteelGrade[] = [
  { name: 'S400', fyk: 400, fyd: 348, density: 7850 },
  { name: 'S500', fyk: 500, fyd: 435, density: 7850 }
];

// Standard bar diameters (mm)
export const BAR_DIAMETERS = [6, 8, 10, 12, 14, 16, 20, 25, 32, 40];

export class ConcreteCalculator {
  static calculateConcreteVolume(geometry: ElementGeometry): number {
    return geometry.width * geometry.depth * geometry.height;
  }

  static calculateBarArea(diameter: number): number {
    return Math.PI * Math.pow(diameter / 2, 2) / 100; // cm²
  }

  static calculateBarWeight(diameter: number, length: number): number {
    const area = this.calculateBarArea(diameter); // cm²
    return (area * length * 7850) / 1000000; // kg (density 7850 kg/m³)
  }

  static calculateLongitudinalSteelWeight(
    geometry: ElementGeometry,
    reinforcement: ReinforcementConfig
  ): number {
    const barLength = geometry.height;
    const singleBarWeight = this.calculateBarWeight(
      reinforcement.longitudinalBars.diameter,
      barLength
    );
    return singleBarWeight * reinforcement.longitudinalBars.number;
  }

  static calculateStirrupWeight(
    geometry: ElementGeometry,
    reinforcement: ReinforcementConfig
  ): number {
    const stirrupPerimeter = 2 * (geometry.width + geometry.depth) - 8 * (reinforcement.cover / 1000);
    const numberOfStirrups = Math.ceil(geometry.height / (reinforcement.stirrups.spacing / 1000));
    const singleStirrupWeight = this.calculateBarWeight(
      reinforcement.stirrups.diameter,
      stirrupPerimeter
    );
    return singleStirrupWeight * numberOfStirrups * reinforcement.stirrups.legs;
  }

  static calculateReinforcementRatio(
    geometry: ElementGeometry,
    reinforcement: ReinforcementConfig
  ): number {
    const concreteArea = geometry.width * geometry.depth * 10000; // cm²
    const steelArea = this.calculateBarArea(reinforcement.longitudinalBars.diameter) * 
                     reinforcement.longitudinalBars.number;
    return (steelArea / concreteArea) * 100;
  }

  static checkEurocodeCompliance(
    elementType: ElementType,
    geometry: ElementGeometry,
    reinforcement: ReinforcementConfig,
    concreteClass: ConcreteClass,
    reinforcementRatio: number
  ): ComplianceCheck {
    const minRatio = elementType === 'column' ? 0.1 : 0.26;
    const maxRatio = elementType === 'column' ? 4.0 : 4.0;
    
    const minSpacing = this.checkMinimumSpacing(geometry, reinforcement);
    const maxSpacing = this.checkMaximumSpacing(geometry, reinforcement);
    const coverCheck = this.checkCover(reinforcement);
    const reinforcementCheck = reinforcementRatio >= minRatio && reinforcementRatio <= maxRatio;
    const shearCheck = this.checkShearReinforcement(geometry, reinforcement);

    return {
      reinforcementRatio: reinforcementCheck,
      minSpacing: minSpacing,
      maxSpacing: maxSpacing,
      cover: coverCheck,
      shearReinforcement: shearCheck,
      overall: reinforcementCheck && minSpacing && maxSpacing && coverCheck && shearCheck
    };
  }

  static checkMinimumSpacing(geometry: ElementGeometry, reinforcement: ReinforcementConfig): boolean {
    const minSpacing = Math.max(reinforcement.longitudinalBars.diameter, 20); // mm
    // Simplified check - in practice, would calculate actual spacing based on arrangement
    return true; // Placeholder
  }

  static checkMaximumSpacing(geometry: ElementGeometry, reinforcement: ReinforcementConfig): boolean {
    const maxSpacing = Math.min(300, geometry.width * 1000); // mm
    return reinforcement.stirrups.spacing <= maxSpacing;
  }

  static checkCover(reinforcement: ReinforcementConfig): boolean {
    const minCover = Math.max(reinforcement.longitudinalBars.diameter, 20); // mm
    return reinforcement.cover >= minCover;
  }

  static checkShearReinforcement(geometry: ElementGeometry, reinforcement: ReinforcementConfig): boolean {
    // Simplified check for stirrup spacing
    const maxSpacing = Math.min(geometry.depth * 750, 300); // mm
    return reinforcement.stirrups.spacing <= maxSpacing;
  }

  static calculateStresses(
    geometry: ElementGeometry,
    reinforcement: ReinforcementConfig,
    loads: Loads,
    concreteClass: ConcreteClass,
    steelGrade: SteelGrade
  ): StressAnalysis {
    // Simplified stress analysis
    const concreteArea = geometry.width * geometry.depth * 1000000; // mm²
    const steelArea = this.calculateBarArea(reinforcement.longitudinalBars.diameter) * 
                     reinforcement.longitudinalBars.number * 100; // mm²

    // Axial stress
    const axialStress = (loads.axialForce * 1000) / concreteArea; // MPa

    // Simplified neutral axis calculation
    const n = 15; // Es/Ec ratio
    const reinforcementRatio = steelArea / concreteArea;
    const neutralAxis = geometry.depth * 1000 * (Math.sqrt(Math.pow(reinforcementRatio * n, 2) + 2 * reinforcementRatio * n) - reinforcementRatio * n);

    // Simplified stress calculations
    const compressionStress = Math.min(axialStress, concreteClass.fcd);
    const tensionStress = Math.min(axialStress * n, steelGrade.fyd);

    // Simplified crack width calculation (mm)
    const crackWidth = Math.max(0, (tensionStress / steelGrade.fyk) * 0.1);

    // Utilization
    const utilization = Math.max(compressionStress / concreteClass.fcd, tensionStress / steelGrade.fyd) * 100;

    return {
      neutralAxis,
      compressionStress,
      tensionStress,
      crackWidth,
      utilization
    };
  }

  static calculateComplete(
    elementType: ElementType,
    geometry: ElementGeometry,
    reinforcement: ReinforcementConfig,
    concreteClass: ConcreteClass,
    steelGrade: SteelGrade,
    loads: Loads
  ): CalculationResults {
    const concreteVolume = this.calculateConcreteVolume(geometry);
    const longitudinalSteelWeight = this.calculateLongitudinalSteelWeight(geometry, reinforcement);
    const stirrupWeight = this.calculateStirrupWeight(geometry, reinforcement);
    const totalSteelWeight = longitudinalSteelWeight + stirrupWeight;
    const reinforcementRatio = this.calculateReinforcementRatio(geometry, reinforcement);

    const compliance = this.checkEurocodeCompliance(
      elementType,
      geometry,
      reinforcement,
      concreteClass,
      reinforcementRatio
    );

    const stresses = this.calculateStresses(
      geometry,
      reinforcement,
      loads,
      concreteClass,
      steelGrade
    );

    const minReinforcement = elementType === 'column' ? 0.1 : 0.26;
    const maxReinforcement = 4.0;

    return {
      concreteVolume,
      longitudinalSteelWeight,
      stirrupWeight,
      totalSteelWeight,
      reinforcementRatio,
      minReinforcement,
      maxReinforcement,
      compliance,
      stresses
    };
  }
}