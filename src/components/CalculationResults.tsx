import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { CalculationResults as CalculationResultsType, ElementType } from '@/types/concrete';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface CalculationResultsProps {
  results: CalculationResultsType;
  elementType: ElementType;
}

export const CalculationResults = ({ results, elementType }: CalculationResultsProps) => {
  const formatNumber = (num: number, decimals: number = 2) => {
    return num.toFixed(decimals);
  };

  const ComplianceIcon = ({ isCompliant }: { isCompliant: boolean }) => (
    isCompliant ? 
      <CheckCircle className="w-4 h-4 text-engineering-success" /> : 
      <XCircle className="w-4 h-4 text-destructive" />
  );

  return (
    <div className="space-y-6">
      {/* Main Results */}
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Calculation Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-3 bg-muted rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Concrete Volume</p>
              <p className="text-xl font-bold text-foreground">{formatNumber(results.concreteVolume, 3)} m³</p>
            </div>
            
            <div className="p-3 bg-muted rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Longitudinal Steel</p>
              <p className="text-xl font-bold text-foreground">{formatNumber(results.longitudinalSteelWeight)} kg</p>
            </div>
            
            <div className="p-3 bg-muted rounded-lg text-center">
              <p className="text-sm text-muted-foreground">
                {elementType === 'column' ? 'Stirrups' : 'Distribution Steel'}
              </p>
              <p className="text-xl font-bold text-foreground">{formatNumber(results.stirrupWeight)} kg</p>
            </div>
            
            <div className="p-3 bg-engineering-blue/10 rounded-lg text-center border border-engineering-blue/20">
              <p className="text-sm text-muted-foreground">Total Steel</p>
              <p className="text-xl font-bold text-engineering-blue">{formatNumber(results.totalSteelWeight)} kg</p>
            </div>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-muted rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Reinforcement Ratio</p>
              <p className="text-lg font-bold text-foreground">{formatNumber(results.reinforcementRatio, 3)}%</p>
              <p className="text-xs text-muted-foreground">
                Min: {formatNumber(results.minReinforcement, 1)}% | Max: {formatNumber(results.maxReinforcement, 1)}%
              </p>
            </div>
            
            <div className="p-3 bg-muted rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Steel/Concrete Ratio</p>
              <p className="text-lg font-bold text-foreground">
                {formatNumber(results.totalSteelWeight / (results.concreteVolume * 2400))} kg/kg
              </p>
            </div>
            
            <div className="p-3 bg-muted rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Steel Density</p>
              <p className="text-lg font-bold text-foreground">
                {formatNumber(results.totalSteelWeight / results.concreteVolume)} kg/m³
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Eurocode Compliance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-foreground">Eurocode 2 Compliance</span>
            <Badge variant={results.compliance.overall ? "default" : "destructive"}>
              {results.compliance.overall ? "COMPLIANT" : "NON-COMPLIANT"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-2 border rounded">
              <span className="text-sm">Reinforcement Ratio</span>
              <div className="flex items-center gap-2">
                <ComplianceIcon isCompliant={results.compliance.reinforcementRatio} />
                <span className="text-sm font-medium">
                  {results.compliance.reinforcementRatio ? 'OK' : 'FAIL'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-2 border rounded">
              <span className="text-sm">Minimum Spacing</span>
              <div className="flex items-center gap-2">
                <ComplianceIcon isCompliant={results.compliance.minSpacing} />
                <span className="text-sm font-medium">
                  {results.compliance.minSpacing ? 'OK' : 'FAIL'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-2 border rounded">
              <span className="text-sm">Maximum Spacing</span>
              <div className="flex items-center gap-2">
                <ComplianceIcon isCompliant={results.compliance.maxSpacing} />
                <span className="text-sm font-medium">
                  {results.compliance.maxSpacing ? 'OK' : 'FAIL'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-2 border rounded">
              <span className="text-sm">Cover Requirements</span>
              <div className="flex items-center gap-2">
                <ComplianceIcon isCompliant={results.compliance.cover} />
                <span className="text-sm font-medium">
                  {results.compliance.cover ? 'OK' : 'FAIL'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-2 border rounded">
              <span className="text-sm">Shear Reinforcement</span>
              <div className="flex items-center gap-2">
                <ComplianceIcon isCompliant={results.compliance.shearReinforcement} />
                <span className="text-sm font-medium">
                  {results.compliance.shearReinforcement ? 'OK' : 'FAIL'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stress Analysis */}
      {results.stresses && (
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Stress Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-3 bg-muted rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Neutral Axis</p>
                <p className="text-lg font-bold text-foreground">
                  {formatNumber(results.stresses.neutralAxis)} mm
                </p>
              </div>
              
              <div className="p-3 bg-muted rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Compression Stress</p>
                <p className="text-lg font-bold text-foreground">
                  {formatNumber(results.stresses.compressionStress)} MPa
                </p>
              </div>
              
              <div className="p-3 bg-muted rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Tension Stress</p>
                <p className="text-lg font-bold text-foreground">
                  {formatNumber(results.stresses.tensionStress)} MPa
                </p>
              </div>
              
              <div className="p-3 bg-muted rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Utilization</p>
                <p className="text-lg font-bold text-foreground">
                  {formatNumber(results.stresses.utilization)}%
                </p>
              </div>
            </div>
            
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-engineering-warning" />
                <span className="text-sm font-medium">Crack Width Check</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Estimated crack width: <span className="font-medium">{formatNumber(results.stresses.crackWidth, 3)} mm</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Limit: 0.3 mm (quasi-permanent loads) | 0.4 mm (frequent loads)
              </p>
            </div>
            
            {results.stresses.utilization > 85 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  High utilization ratio ({formatNumber(results.stresses.utilization)}%). 
                  Consider increasing reinforcement or concrete strength.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};