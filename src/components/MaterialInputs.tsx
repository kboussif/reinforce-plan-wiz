import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { CONCRETE_CLASSES, STEEL_GRADES } from '@/utils/concreteCalculations';
import { ConcreteClass, SteelGrade } from '@/types/concrete';

interface MaterialInputsProps {
  concreteClass: ConcreteClass;
  steelGrade: SteelGrade;
  onConcreteChange: (concrete: ConcreteClass) => void;
  onSteelChange: (steel: SteelGrade) => void;
}

export const MaterialInputs = ({ 
  concreteClass, 
  steelGrade, 
  onConcreteChange, 
  onSteelChange 
}: MaterialInputsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-foreground">المواد / Matériaux</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>فئة الخرسانة / Classe Béton</Label>
            <Select
              value={concreteClass.name}
              onValueChange={(value) => {
                const selected = CONCRETE_CLASSES.find(c => c.name === value);
                if (selected) onConcreteChange(selected);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CONCRETE_CLASSES.map((concrete) => (
                  <SelectItem key={concrete.name} value={concrete.name}>
                    {concrete.name} (fck = {concrete.fck} MPa)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>درجة الحديد / Nuance Acier</Label>
            <Select
              value={steelGrade.name}
              onValueChange={(value) => {
                const selected = STEEL_GRADES.find(s => s.name === value);
                if (selected) onSteelChange(selected);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STEEL_GRADES.map((steel) => (
                  <SelectItem key={steel.name} value={steel.name}>
                    {steel.name} (fyk = {steel.fyk} MPa)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div className="p-3 bg-muted rounded-lg">
            <h4 className="font-medium text-foreground mb-2">خصائص الخرسانة / Propriétés Béton</h4>
            <p>fck = {concreteClass.fck} MPa</p>
            <p>fcd = {concreteClass.fcd} MPa</p>
            <p>Density = {concreteClass.density} kg/m³</p>
          </div>
          
          <div className="p-3 bg-muted rounded-lg">
            <h4 className="font-medium text-foreground mb-2">خصائص الحديد / Propriétés Acier</h4>
            <p>fyk = {steelGrade.fyk} MPa</p>
            <p>fyd = {steelGrade.fyd} MPa</p>
            <p>Density = {steelGrade.density} kg/m³</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};