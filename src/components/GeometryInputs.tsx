import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ElementGeometry, ElementType } from '@/types/concrete';

interface GeometryInputsProps {
  geometry: ElementGeometry;
  elementType: ElementType;
  onChange: (geometry: ElementGeometry) => void;
}

export const GeometryInputs = ({ geometry, elementType, onChange }: GeometryInputsProps) => {
  const handleChange = (field: keyof ElementGeometry, value: string) => {
    const numValue = parseFloat(value) || 0;
    onChange({
      ...geometry,
      [field]: numValue
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-foreground">الأبعاد / Géométrie</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="width">العرض / Largeur (m)</Label>
            <Input
              id="width"
              type="number"
              step="0.01"
              min="0"
              value={geometry.width || ''}
              onChange={(e) => handleChange('width', e.target.value)}
              placeholder="0.30"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="depth">
              {elementType === 'column' ? 'العمق / Profondeur (m)' : 'الطول / Longueur (m)'}
            </Label>
            <Input
              id="depth"
              type="number"
              step="0.01"
              min="0"
              value={geometry.depth || ''}
              onChange={(e) => handleChange('depth', e.target.value)}
              placeholder="0.30"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="height">
              {elementType === 'column' ? 'الارتفاع / Hauteur (m)' : 'السماكة / Épaisseur (m)'}
            </Label>
            <Input
              id="height"
              type="number"
              step="0.01"
              min="0"
              value={geometry.height || ''}
              onChange={(e) => handleChange('height', e.target.value)}
              placeholder={elementType === 'column' ? '3.00' : '0.50'}
            />
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p className="font-medium">المساحة المقطعية / Section: {(geometry.width * geometry.depth).toFixed(3)} m²</p>
          <p className="font-medium">الحجم / Volume: {(geometry.width * geometry.depth * geometry.height).toFixed(3)} m³</p>
        </div>
      </CardContent>
    </Card>
  );
};