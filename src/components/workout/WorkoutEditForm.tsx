import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input, TextArea, Checkbox } from '../ui/Input';

interface WorkoutEditFormProps {
  dayData: any;
  workout: string;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export const WorkoutEditForm: React.FC<WorkoutEditFormProps> = ({
  dayData,
  workout,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    completed: dayData.completed || false,
    sleepQuality: dayData.sleepQuality || '',
    energyLevel: dayData.energyLevel || '',
    notes: dayData.notes || '',
    pushups: dayData.pushups || '',
    plankHold: dayData.plankHold || '',
    weight: dayData.weight || '',
    reps: dayData.reps || '',
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const data = {
      completed: formData.completed,
      sleepQuality: parseInt(formData.sleepQuality) || 0,
      energyLevel: parseInt(formData.energyLevel) || 0,
      notes: formData.notes,
      pushups: parseInt(formData.pushups) || 0,
      plankHold: parseInt(formData.plankHold) || 0,
      weight: formData.weight,
      reps: formData.reps,
    };
    onSave(data);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Completion Checkbox */}
      <div className="glass-card p-4 rounded-lg">
        <Checkbox
          label="Workout Completed"
          checked={formData.completed}
          onChange={(e) => handleChange('completed', e.target.checked)}
        />
      </div>

      {/* Subjective Metrics */}
      <div className="glass-card p-6 rounded-lg space-y-4">
        <h4 className="text-lg font-bold text-white mb-4">How Did You Feel?</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="number"
            label="Sleep Quality (1-10)"
            placeholder="8"
            min="1"
            max="10"
            value={formData.sleepQuality}
            onChange={(e) => handleChange('sleepQuality', e.target.value)}
          />
          <Input
            type="number"
            label="Energy Level (1-10)"
            placeholder="7"
            min="1"
            max="10"
            value={formData.energyLevel}
            onChange={(e) => handleChange('energyLevel', e.target.value)}
          />
        </div>
      </div>

      {/* Performance Metrics */}
      {workout !== 'Rest' && (
        <div className="glass-card p-6 rounded-lg space-y-4">
          <h4 className="text-lg font-bold text-white mb-4">Performance Metrics</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="number"
              label="Push-ups Completed"
              placeholder="20"
              value={formData.pushups}
              onChange={(e) => handleChange('pushups', e.target.value)}
            />
            <Input
              type="number"
              label="Plank Hold (seconds)"
              placeholder="60"
              value={formData.plankHold}
              onChange={(e) => handleChange('plankHold', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              label="Weight Used"
              placeholder="e.g., 25lb KB"
              value={formData.weight}
              onChange={(e) => handleChange('weight', e.target.value)}
            />
            <Input
              type="text"
              label="Reps/Sets"
              placeholder="e.g., 3x12"
              value={formData.reps}
              onChange={(e) => handleChange('reps', e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Notes */}
      <div className="glass-card p-6 rounded-lg">
        <TextArea
          label="Notes"
          placeholder="How did you feel? Any modifications made?"
          rows={4}
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          variant="primary"
          onClick={handleSave}
          leftIcon={<Save className="w-4 h-4" />}
          className="flex-1"
        >
          Save Workout
        </Button>
        <Button variant="secondary" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default WorkoutEditForm;
