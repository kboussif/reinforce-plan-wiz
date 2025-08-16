import { useRef, useEffect } from 'react';
import { ElementGeometry, ReinforcementConfig, ElementType } from '@/types/concrete';
import { Card } from '@/components/ui/card';

interface ReinforcementVisualizerProps {
  geometry: ElementGeometry;
  reinforcement: ReinforcementConfig;
  elementType: ElementType;
}

export const ReinforcementVisualizer = ({ 
  geometry, 
  reinforcement, 
  elementType 
}: ReinforcementVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set up drawing parameters
    const padding = 40;
    const scale = Math.min(
      (canvas.width - 2 * padding) / Math.max(geometry.width, geometry.depth),
      (canvas.height - 2 * padding) / geometry.height
    );

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    if (elementType === 'column') {
      drawColumnReinforcement(ctx, geometry, reinforcement, scale, centerX, centerY);
    } else {
      drawFootingReinforcement(ctx, geometry, reinforcement, scale, centerX, centerY);
    }
  }, [geometry, reinforcement, elementType]);

  const drawColumnReinforcement = (
    ctx: CanvasRenderingContext2D,
    geometry: ElementGeometry,
    reinforcement: ReinforcementConfig,
    scale: number,
    centerX: number,
    centerY: number
  ) => {
    const width = geometry.width * scale;
    const depth = geometry.depth * scale;
    const height = geometry.height * scale;

    // Draw concrete outline
    ctx.strokeStyle = '#8B7355';
    ctx.lineWidth = 2;
    ctx.strokeRect(centerX - width / 2, centerY - height / 2, width, height);

    // Fill concrete
    ctx.fillStyle = 'hsl(var(--engineering-concrete))';
    ctx.fillRect(centerX - width / 2, centerY - height / 2, width, height);

    // Draw cover lines
    const cover = (reinforcement.cover / 1000) * scale;
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(
      centerX - width / 2 + cover,
      centerY - height / 2 + cover,
      width - 2 * cover,
      height - 2 * cover
    );
    ctx.setLineDash([]);

    // Draw longitudinal bars
    const barsPerSide = Math.ceil(reinforcement.longitudinalBars.number / 4);
    const cornerBars = 4;
    const sideBars = reinforcement.longitudinalBars.number - cornerBars;

    ctx.fillStyle = 'hsl(var(--engineering-steel))';
    const barRadius = (reinforcement.longitudinalBars.diameter / 2000) * scale;

    // Corner bars
    const positions = [
      [centerX - width / 2 + cover, centerY - depth / 2 + cover],
      [centerX + width / 2 - cover, centerY - depth / 2 + cover],
      [centerX + width / 2 - cover, centerY + depth / 2 - cover],
      [centerX - width / 2 + cover, centerY + depth / 2 - cover]
    ];

    positions.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, barRadius, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Side bars
    if (sideBars > 0) {
      const spacing = (width - 2 * cover) / (sideBars / 2 + 1);
      for (let i = 1; i <= sideBars / 2; i++) {
        // Top side
        ctx.beginPath();
        ctx.arc(centerX - width / 2 + cover + i * spacing, centerY - depth / 2 + cover, barRadius, 0, 2 * Math.PI);
        ctx.fill();
        
        // Bottom side
        ctx.beginPath();
        ctx.arc(centerX - width / 2 + cover + i * spacing, centerY + depth / 2 - cover, barRadius, 0, 2 * Math.PI);
        ctx.fill();
      }
    }

    // Draw stirrups
    const stirrupSpacing = (reinforcement.stirrups.spacing / 1000) * scale;
    const numberOfStirrups = Math.floor(height / stirrupSpacing);
    
    ctx.strokeStyle = 'hsl(var(--engineering-steel))';
    ctx.lineWidth = 1;

    for (let i = 1; i < numberOfStirrups; i++) {
      const y = centerY - height / 2 + i * stirrupSpacing;
      ctx.strokeRect(
        centerX - width / 2 + cover,
        y - 1,
        width - 2 * cover,
        2
      );
    }

    // Add dimensions
    drawDimensions(ctx, centerX, centerY, width, height, geometry);
  };

  const drawFootingReinforcement = (
    ctx: CanvasRenderingContext2D,
    geometry: ElementGeometry,
    reinforcement: ReinforcementConfig,
    scale: number,
    centerX: number,
    centerY: number
  ) => {
    const width = geometry.width * scale;
    const depth = geometry.depth * scale;

    // Draw concrete outline (top view)
    ctx.strokeStyle = '#8B7355';
    ctx.lineWidth = 2;
    ctx.strokeRect(centerX - width / 2, centerY - depth / 2, width, depth);

    // Fill concrete
    ctx.fillStyle = 'hsl(var(--engineering-concrete))';
    ctx.fillRect(centerX - width / 2, centerY - depth / 2, width, depth);

    // Draw reinforcement grid
    const cover = (reinforcement.cover / 1000) * scale;
    const barSpacing = (width - 2 * cover) / (reinforcement.longitudinalBars.number - 1);

    ctx.strokeStyle = 'hsl(var(--engineering-steel))';
    ctx.lineWidth = 2;

    // Horizontal bars
    for (let i = 0; i < reinforcement.longitudinalBars.number; i++) {
      const x = centerX - width / 2 + cover + i * barSpacing;
      ctx.beginPath();
      ctx.moveTo(x, centerY - depth / 2 + cover);
      ctx.lineTo(x, centerY + depth / 2 - cover);
      ctx.stroke();
    }

    // Vertical bars
    for (let i = 0; i < reinforcement.longitudinalBars.number; i++) {
      const y = centerY - depth / 2 + cover + i * barSpacing;
      ctx.beginPath();
      ctx.moveTo(centerX - width / 2 + cover, y);
      ctx.lineTo(centerX + width / 2 - cover, y);
      ctx.stroke();
    }

    // Add dimensions
    drawDimensions(ctx, centerX, centerY, width, depth, geometry);
  };

  const drawDimensions = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    width: number,
    height: number,
    geometry: ElementGeometry
  ) => {
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';

    // Width dimension
    ctx.fillText(
      `${geometry.width.toFixed(2)}m`,
      centerX,
      centerY + height / 2 + 20
    );

    // Height dimension
    ctx.save();
    ctx.translate(centerX - width / 2 - 20, centerY);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(
      elementType === 'column' ? `${geometry.height.toFixed(2)}m` : `${geometry.depth.toFixed(2)}m`,
      0,
      5
    );
    ctx.restore();
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Reinforcement Layout</h3>
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          className="border border-border rounded-lg bg-background"
        />
      </div>
      <div className="mt-4 text-sm text-muted-foreground">
        <p className="flex items-center gap-2">
          <span className="w-4 h-4 bg-engineering-concrete border border-gray-400"></span>
          Concrete
        </p>
        <p className="flex items-center gap-2">
          <span className="w-4 h-4 bg-engineering-steel"></span>
          Reinforcement Steel
        </p>
      </div>
    </Card>
  );
};