import { Card } from "@/components/ui/card";
import { Clock, Repeat } from "lucide-react";

interface Exercise {
  name: string;
  steps: string[];
  duration: string;
  frequency: string;
}

interface ExerciseCardProps {
  exercise: Exercise;
}

const ExerciseCard = ({ exercise }: ExerciseCardProps) => {
  return (
    <Card className="p-6 shadow-soft hover:shadow-hover transition-all">
      <h3 className="text-xl font-semibold mb-4 text-primary">{exercise.name}</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Steps:</h4>
          <ol className="space-y-2">
            {exercise.steps.map((step, index) => (
              <li key={index} className="flex items-start">
                <span className="font-semibold text-primary mr-2">{index + 1}.</span>
                <span className="text-sm">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="w-4 h-4 mr-1" />
            <span>{exercise.duration}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Repeat className="w-4 h-4 mr-1" />
            <span>{exercise.frequency}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ExerciseCard;
