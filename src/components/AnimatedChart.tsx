import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ChartData {
  label: string;
  value: number;
  color: string;
}

interface AnimatedChartProps {
  title: string;
  data: ChartData[];
  type?: "bar" | "line" | "donut";
  className?: string;
  delay?: number;
}

const AnimatedChart = ({ 
  title, 
  data, 
  type = "bar", 
  className, 
  delay = 0 
}: AnimatedChartProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedData, setAnimatedData] = useState(data.map(item => ({ ...item, value: 0 })));

  const maxValue = Math.max(...data.map(item => item.value));

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      
      // Animate chart data
      let progress = 0;
      const animationDuration = 1500; // 1.5 seconds
      const steps = 60; // 60fps
      const stepTime = animationDuration / steps;
      
      const animationInterval = setInterval(() => {
        progress += 1 / steps;
        if (progress >= 1) {
          progress = 1;
          clearInterval(animationInterval);
        }
        
        setAnimatedData(data.map(item => ({
          ...item,
          value: item.value * progress
        })));
      }, stepTime);

      return () => clearInterval(animationInterval);
    }, delay);

    return () => clearTimeout(timer);
  }, [data, delay]);

  const renderBarChart = () => (
    <div className="space-y-4">
      {animatedData.map((item, index) => (
        <div key={item.label} className="space-y-2" style={{ animationDelay: `${index * 100}ms` }}>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{item.label}</span>
            <span className="font-medium">{Math.round(item.value)}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={cn("h-full rounded-full transition-all duration-1000 ease-out", item.color)}
              style={{ 
                width: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%`,
                animationDelay: `${index * 150}ms`
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );

  const renderLineChart = () => (
    <div className="h-32 flex items-end space-x-2 border-b border-border">
      {animatedData.map((item, index) => (
        <div key={item.label} className="flex-1 flex flex-col items-center space-y-1">
          <div 
            className={cn("w-full rounded-t transition-all duration-1000 ease-out", item.color)}
            style={{ 
              height: `${maxValue > 0 ? (item.value / maxValue) * 120 : 0}px`,
              animationDelay: `${index * 100}ms`
            }}
          />
          <span className="text-xs text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  );

  const renderDonutChart = () => {
    const total = animatedData.reduce((sum, item) => sum + item.value, 0);
    let cumulativeValue = 0;

    return (
      <div className="flex items-center justify-center h-32">
        <div className="relative w-24 h-24">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="hsl(var(--muted))"
              strokeWidth="8"
            />
            {animatedData.map((item, index) => {
              const percentage = total > 0 ? (item.value / total) * 100 : 0;
              const strokeDasharray = `${percentage * 2.51} 251.2`;
              const strokeDashoffset = -cumulativeValue * 2.51;
              cumulativeValue += percentage;
              
              return (
                <circle
                  key={index}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke={item.color.includes('bg-') ? `hsl(var(--${item.color.split('-')[1]}))` : item.color}
                  strokeWidth="8"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-1000 ease-out"
                  style={{ animationDelay: `${index * 200}ms` }}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-semibold">{Math.round(total)}</span>
          </div>
        </div>
        <div className="ml-4 space-y-1">
          {animatedData.map((item, index) => (
            <div key={index} className="flex items-center space-x-2 text-xs">
              <div className={cn("w-3 h-3 rounded-full", item.color)} />
              <span className="text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card 
      className={cn(
        "glass hover-lift transition-all duration-300",
        isVisible && "animate-slide-up-fade",
        className
      )}
    >
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {type === "bar" && renderBarChart()}
        {type === "line" && renderLineChart()}
        {type === "donut" && renderDonutChart()}
      </CardContent>
    </Card>
  );
};

export default AnimatedChart;