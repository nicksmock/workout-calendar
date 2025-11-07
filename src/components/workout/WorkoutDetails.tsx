import React from 'react';
import { X, Edit3, Dumbbell } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { VideoPlayer } from '../ui/VideoPlayer';

interface Exercise {
  name: string;
  video: string | null;
}

interface WorkoutInfo {
  name: string;
  duration: string;
  warmup: string[];
  exercises: Exercise[];
  cooldown: string[];
  color: string;
}

interface WorkoutDetailsProps {
  week: number;
  day: number;
  dayName: string;
  workoutInfo: WorkoutInfo;
  dayData: any;
  onClose: () => void;
  onEdit: () => void;
}

export const WorkoutDetails: React.FC<WorkoutDetailsProps> = ({
  week,
  day,
  dayName,
  workoutInfo,
  dayData,
  onClose,
  onEdit,
}) => {
  return (
    <div className="glass-card-strong p-6 md:p-8 rounded-xl animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="default">Week {week}</Badge>
            <Badge variant="default">{dayName}</Badge>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-white text-shadow-strong mb-2">
            {workoutInfo.name}
          </h3>
          <div className="flex items-center gap-2 text-white/80">
            <Dumbbell className="w-4 h-4" />
            <span className="text-sm">{workoutInfo.duration}</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="!p-2"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Completion Status */}
      {dayData.completed && (
        <div className="mb-6 p-4 glass-card rounded-lg flex items-center gap-3">
          <div className="p-2 rounded-full bg-gradient-primary">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <div className="text-white font-semibold">Workout Completed!</div>
            <div className="text-sm text-white/70">Great job on finishing this session</div>
          </div>
        </div>
      )}

      {/* Scrollable Content */}
      <div className="max-h-96 overflow-y-auto scrollbar-glass space-y-6">
        {/* Warm-up */}
        <div>
          <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span className="text-secondary">🔥</span> Warm-up
          </h4>
          <ul className="space-y-2">
            {workoutInfo.warmup.map((item, index) => (
              <li key={index} className="text-white/90 text-sm pl-6 relative before:content-['•'] before:absolute before:left-2 before:text-secondary">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Main Exercises */}
        <div>
          <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span className="text-secondary">💪</span> Main Workout
          </h4>
          <div className="space-y-3">
            {workoutInfo.exercises.map((exercise, index) => (
              <div key={index} className="glass-card p-4 rounded-lg hover:bg-white/15 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-white text-sm flex-1">{exercise.name}</span>
                  <VideoPlayer videoUrl={exercise.video} title={exercise.name} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cool-down */}
        <div>
          <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span className="text-secondary">🧘</span> Cool-down
          </h4>
          <ul className="space-y-2">
            {workoutInfo.cooldown.map((item, index) => (
              <li key={index} className="text-white/90 text-sm pl-6 relative before:content-['•'] before:absolute before:left-2 before:text-secondary">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 pt-4 border-t border-white/20 flex gap-3">
        <Button
          variant="primary"
          onClick={onEdit}
          leftIcon={<Edit3 className="w-4 h-4" />}
          className="flex-1"
        >
          Log Workout
        </Button>
        {dayData.completed && (
          <Button
            variant="secondary"
            onClick={onEdit}
            className="flex-1"
          >
            Edit Details
          </Button>
        )}
      </div>

      {/* Logged Data Preview */}
      {dayData.completed && (
        <div className="mt-4 p-4 glass-card rounded-lg space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-3">
            {dayData.sleepQuality > 0 && (
              <div>
                <span className="text-white/60">Sleep:</span>{' '}
                <span className="text-white font-semibold">{dayData.sleepQuality}/10</span>
              </div>
            )}
            {dayData.energyLevel > 0 && (
              <div>
                <span className="text-white/60">Energy:</span>{' '}
                <span className="text-white font-semibold">{dayData.energyLevel}/10</span>
              </div>
            )}
            {dayData.pushups > 0 && (
              <div>
                <span className="text-white/60">Push-ups:</span>{' '}
                <span className="text-white font-semibold">{dayData.pushups}</span>
              </div>
            )}
            {dayData.plankHold > 0 && (
              <div>
                <span className="text-white/60">Plank:</span>{' '}
                <span className="text-white font-semibold">{dayData.plankHold}s</span>
              </div>
            )}
          </div>
          {dayData.notes && (
            <div className="pt-2 border-t border-white/10">
              <span className="text-white/60 text-xs">Notes:</span>
              <p className="text-white/90 mt-1">{dayData.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkoutDetails;
