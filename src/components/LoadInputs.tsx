import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loads, ElementType } from '@/types/concrete';

interface LoadInputsProps {
  loads: Loads;
  elementType: ElementType;
  onChange: (loads: Loads) => void;
}

export const LoadInputs = ({ loads, elementType, onChange }: LoadInputsProps) => {
  const handleChange = (field: keyof Loads, value: string) => {
    const numValue = parseFloat(value) || 0;
    onChange({
      ...loads,
      [field]: numValue
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-foreground">Design Loads (Ultimate Limit State)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="axial-force">
              {elementType === 'column' ? 'Axial Force NEd (kN)' : 'Vertical Load (kN)'}
            </Label>
            <Input
              id="axial-force"
              type="number"
              step="0.1"
              value={loads.axialForce || ''}
              onChange={(e) => handleChange('axialForce', e.target.value)}
              placeholder={elementType === 'column' ? '1000' : '500'}
            />
          </div>
          
          {elementType === 'column' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="moment-x">Moment MEd,x (kNm)</Label>
                <Input
                  id="moment-x"
                  type="number"
                  step="0.1"
                  value={loads.momentX || ''}
                  onChange={(e) => handleChange('momentX', e.target.value)}
                  placeholder="50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="moment-y">Moment MEd,y (kNm)</Label>
                <Input
                  id="moment-y"
                  type="number"
                  step="0.1"
                  value={loads.momentY || ''}
                  onChange={(e) => handleChange('momentY', e.target.value)}
                  placeholder="30"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="shear-x">Shear VEd,x (kN)</Label>
                <Input
                  id="shear-x"
                  type="number"
                  step="0.1"
                  value={loads.shearX || ''}
                  onChange={(e) => handleChange('shearX', e.target.value)}
                  placeholder="25"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="shear-y">Shear VEd,y (kN)</Label>
                <Input
                  id="shear-y"
                  type="number"
                  step="0.1"
                  value={loads.shearY || ''}
                  onChange={(e) => handleChange('shearY', e.target.value)}
                  placeholder="15"
                />
              </div>
            </>
          )}
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p className="font-medium">Load Information:</p>
          <p>• Enter ultimate design loads (factored loads)</p>
          <p>• Positive axial force = compression</p>
          {elementType === 'column' && (
            <>
              <p>• Moments about local axes of the element</p>
              <p>• Shear forces in local coordinate system</p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};