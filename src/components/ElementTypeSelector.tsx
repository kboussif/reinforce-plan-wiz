import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ElementType } from '@/types/concrete';
import { Building, Layers } from 'lucide-react';

interface ElementTypeSelectorProps {
  elementType: ElementType;
  onChange: (type: ElementType) => void;
}

export const ElementTypeSelector = ({ elementType, onChange }: ElementTypeSelectorProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">نوع العنصر / Type d'élément</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant={elementType === 'column' ? 'default' : 'outline'}
            onClick={() => onChange('column')}
            className="h-24 flex flex-col items-center justify-center gap-2"
          >
            <Building className="w-8 h-8" />
            <span className="text-lg font-medium">عمود / Poteau</span>
            <span className="text-sm opacity-75">Élément structurel vertical</span>
          </Button>
          
          <Button
            variant={elementType === 'footing' ? 'default' : 'outline'}
            onClick={() => onChange('footing')}
            className="h-24 flex flex-col items-center justify-center gap-2"
          >
            <Layers className="w-8 h-8" />
            <span className="text-lg font-medium">أساس / Semelle</span>
            <span className="text-sm opacity-75">Élément de fondation</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};