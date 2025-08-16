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
        <CardTitle className="text-foreground">الأحمال / Charges de Calcul (ELU)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="axial-force">
              {elementType === 'column' ? 'القوة المحورية / Effort Normal NEd (kN)' : 'الحمولة العمودية / Charge Verticale (kN)'}
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
                <Label htmlFor="moment-x">العزم / Moment MEd,x (kNm)</Label>
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
                <Label htmlFor="moment-y">العزم / Moment MEd,y (kNm)</Label>
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
                <Label htmlFor="shear-x">القص / Effort Tranchant VEd,x (kN)</Label>
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
                <Label htmlFor="shear-y">القص / Effort Tranchant VEd,y (kN)</Label>
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
          <p className="font-medium">معلومات الأحمال / Info Charges:</p>
          <p>• أدخل أحمال التصميم النهائية (معاملة) / Entrer charges de calcul ultimes</p>
          <p>• القوة المحورية الموجبة = ضغط / Effort normal positif = compression</p>
          {elementType === 'column' && (
            <>
              <p>• العزوم حول المحاور المحلية / Moments selon axes locaux</p>
              <p>• قوى القص في النظام المحلي / Efforts tranchants en repère local</p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};