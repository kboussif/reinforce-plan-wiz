import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ElementTypeSelector } from '@/components/ElementTypeSelector';
import { GeometryInputs } from '@/components/GeometryInputs';
import { MaterialInputs } from '@/components/MaterialInputs';
import { ReinforcementInputs } from '@/components/ReinforcementInputs';
import { LoadInputs } from '@/components/LoadInputs';
import { CalculationResults } from '@/components/CalculationResults';
import { ReinforcementVisualizer } from '@/components/ReinforcementVisualizer';
import { Calculator, FileText, Download } from 'lucide-react';
import { toast } from 'sonner';
import {
  ElementType,
  ElementGeometry,
  ReinforcementConfig,
  Loads,
  ConcreteClass,
  SteelGrade,
  CalculationResults as CalculationResultsType
} from '@/types/concrete';
import { ConcreteCalculator, CONCRETE_CLASSES, STEEL_GRADES } from '@/utils/concreteCalculations';

const Index = () => {
  const [elementType, setElementType] = useState<ElementType>('column');
  const [geometry, setGeometry] = useState<ElementGeometry>({
    width: 0.3,
    depth: 0.3,
    height: 3.0
  });
  
  const [concreteClass, setConcreteClass] = useState<ConcreteClass>(CONCRETE_CLASSES[2]); // C30/37
  const [steelGrade, setSteelGrade] = useState<SteelGrade>(STEEL_GRADES[1]); // S500
  
  const [reinforcement, setReinforcement] = useState<ReinforcementConfig>({
    longitudinalBars: {
      number: 8,
      diameter: 16
    },
    stirrups: {
      diameter: 8,
      spacing: 200,
      legs: 2
    },
    cover: 30
  });
  
  const [loads, setLoads] = useState<Loads>({
    axialForce: 1000,
    momentX: 50,
    momentY: 30,
    shearX: 25,
    shearY: 15
  });
  
  const [results, setResults] = useState<CalculationResultsType | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Update geometry defaults when element type changes
  useEffect(() => {
    if (elementType === 'footing') {
      setGeometry({
        width: 2.0,
        depth: 2.0,
        height: 0.5
      });
      setReinforcement(prev => ({
        ...prev,
        longitudinalBars: {
          number: 10,
          diameter: 12
        }
      }));
      setLoads({
        axialForce: 500,
        momentX: 0,
        momentY: 0,
        shearX: 0,
        shearY: 0
      });
    } else {
      setGeometry({
        width: 0.3,
        depth: 0.3,
        height: 3.0
      });
      setReinforcement(prev => ({
        ...prev,
        longitudinalBars: {
          number: 8,
          diameter: 16
        }
      }));
      setLoads({
        axialForce: 1000,
        momentX: 50,
        momentY: 30,
        shearX: 25,
        shearY: 15
      });
    }
  }, [elementType]);

  const handleCalculate = () => {
    try {
      const calculatedResults = ConcreteCalculator.calculateComplete(
        elementType,
        geometry,
        reinforcement,
        concreteClass,
        steelGrade,
        loads
      );
      
      setResults(calculatedResults);
      setShowResults(true);
      
      if (calculatedResults.compliance.overall) {
        toast.success('Calculations completed successfully. Design is Eurocode compliant!');
      } else {
        toast.warning('Calculations completed. Please check compliance issues.');
      }
    } catch (error) {
      toast.error('Error in calculations. Please check your inputs.');
      console.error('Calculation error:', error);
    }
  };

  const handleExportReport = () => {
    if (!results) return;
    
    toast.success('Report export feature coming soon!');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-primary-hover text-primary-foreground shadow-engineering">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calculator className="w-8 h-8" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Reinforced Concrete Calculator</h1>
                <p className="text-primary-foreground/80">Professional tool for RC design according to Eurocode 2</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90">Eurocode 2 Compliant</p>
              <p className="text-xs opacity-75">EN 1992-1-1</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="xl:col-span-2 space-y-6">
            <ElementTypeSelector elementType={elementType} onChange={setElementType} />
            
            <GeometryInputs 
              geometry={geometry} 
              elementType={elementType}
              onChange={setGeometry} 
            />
            
            <MaterialInputs 
              concreteClass={concreteClass}
              steelGrade={steelGrade}
              onConcreteChange={setConcreteClass}
              onSteelChange={setSteelGrade}
            />
            
            <ReinforcementInputs 
              reinforcement={reinforcement}
              elementType={elementType}
              onChange={setReinforcement}
            />
            
            <LoadInputs 
              loads={loads}
              elementType={elementType}
              onChange={setLoads}
            />
            
            {/* Calculate Button */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                  <Button 
                    onClick={handleCalculate}
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    <Calculator className="w-5 h-5 mr-2" />
                    Calculate Reinforcement
                  </Button>
                  
                  {results && (
                    <Button 
                      onClick={handleExportReport}
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Export Report
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            <ReinforcementVisualizer 
              geometry={geometry}
              reinforcement={reinforcement}
              elementType={elementType}
            />
            
            {showResults && results && (
              <CalculationResults 
                results={results}
                elementType={elementType}
              />
            )}
            
            {!showResults && (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Ready to Calculate</h3>
                  <p className="text-muted-foreground">
                    Enter your design parameters and click "Calculate Reinforcement" to see results.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t mt-16 py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-muted-foreground">
            <p className="mb-2">Reinforced Concrete Calculator - Professional Engineering Tool</p>
            <p>Based on Eurocode 2 (EN 1992-1-1) • For preliminary design purposes only</p>
            <p className="mt-2 text-xs">Always verify results with professional structural analysis software</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
