import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ReinforcementConfig, ElementType } from '@/types/concrete';
import { BAR_DIAMETERS } from '@/utils/concreteCalculations';

interface ReinforcementInputsProps {
  reinforcement: ReinforcementConfig;
  elementType: ElementType;
  onChange: (reinforcement: ReinforcementConfig) => void;
}

export const ReinforcementInputs = ({ 
  reinforcement, 
  elementType, 
  onChange 
}: ReinforcementInputsProps) => {
  const handleLongitudinalChange = (field: keyof ReinforcementConfig['longitudinalBars'], value: string) => {
    const numValue = parseInt(value) || 0;
    onChange({
      ...reinforcement,
      longitudinalBars: {
        ...reinforcement.longitudinalBars,
        [field]: numValue
      }
    });
  };

  const handleStirrrupsChange = (field: keyof ReinforcementConfig['stirrups'], value: string) => {
    const numValue = parseInt(value) || 0;
    onChange({
      ...reinforcement,
      stirrups: {
        ...reinforcement.stirrups,
        [field]: numValue
      }
    });
  };

  const handleCoverChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    onChange({
      ...reinforcement,
      cover: numValue
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-foreground">Reinforcement</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Longitudinal Reinforcement */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">
            {elementType === 'column' ? 'Longitudinal Bars' : 'Main Reinforcement'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bar-number">Number of Bars</Label>
              <Input
                id="bar-number"
                type="number"
                min="4"
                value={reinforcement.longitudinalBars.number || ''}
                onChange={(e) => handleLongitudinalChange('number', e.target.value)}
                placeholder="8"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Bar Diameter (mm)</Label>
              <Select
                value={reinforcement.longitudinalBars.diameter.toString()}
                onValueChange={(value) => handleLongitudinalChange('diameter', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BAR_DIAMETERS.map((diameter) => (
                    <SelectItem key={diameter} value={diameter.toString()}>
                      ⌀{diameter} mm
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Stirrups/Transverse Reinforcement */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">
            {elementType === 'column' ? 'Stirrups' : 'Distribution Bars'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Diameter (mm)</Label>
              <Select
                value={reinforcement.stirrups.diameter.toString()}
                onValueChange={(value) => handleStirrrupsChange('diameter', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BAR_DIAMETERS.filter(d => d <= 12).map((diameter) => (
                    <SelectItem key={diameter} value={diameter.toString()}>
                      ⌀{diameter} mm
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="stirrup-spacing">Spacing (mm)</Label>
              <Input
                id="stirrup-spacing"
                type="number"
                min="50"
                step="25"
                value={reinforcement.stirrups.spacing || ''}
                onChange={(e) => handleStirrrupsChange('spacing', e.target.value)}
                placeholder="200"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="stirrup-legs">Number of Legs</Label>
              <Input
                id="stirrup-legs"
                type="number"
                min="2"
                max="6"
                value={reinforcement.stirrups.legs || ''}
                onChange={(e) => handleStirrrupsChange('legs', e.target.value)}
                placeholder="2"
              />
            </div>
          </div>
        </div>

        {/* Cover */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Cover</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cover">Concrete Cover (mm)</Label>
              <Input
                id="cover"
                type="number"
                min="15"
                value={reinforcement.cover || ''}
                onChange={(e) => handleCoverChange(e.target.value)}
                placeholder="30"
              />
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="p-3 bg-muted rounded-lg text-sm">
          <h4 className="font-medium text-foreground mb-2">Reinforcement Summary</h4>
          <p className="text-muted-foreground">
            {reinforcement.longitudinalBars.number}⌀{reinforcement.longitudinalBars.diameter} + 
            ⌀{reinforcement.stirrups.diameter} stirrups @ {reinforcement.stirrups.spacing}mm c/c
          </p>
        </div>
      </CardContent>
    </Card>
  );
};