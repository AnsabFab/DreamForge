import { Model } from "@shared/schema";

interface ModelSelectorProps {
  models: Model[];
  value: number;
  onChange: (value: number) => void;
}

export function ModelSelector({ models, value, onChange }: ModelSelectorProps) {
  if (!models || models.length === 0) {
    return (
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div 
            key={i} 
            className="py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm animate-pulse bg-gray-100 dark:bg-gray-800"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {models.map((model) => (
        <button
          key={model.id}
          type="button"
          className={`py-2 px-3 border rounded-lg text-sm transition-colors ${
            value === model.id
              ? "border-indigo-500 bg-indigo-500 bg-opacity-10"
              : "border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
          onClick={() => onChange(model.id)}
        >
          <div className="text-xs text-gray-500 dark:text-gray-400">{model.description}</div>
          <div className={`font-medium ${value === model.id ? "text-indigo-500" : ""}`}>
            {model.displayName}
          </div>
          <div className="text-xs text-indigo-500">{model.creditCost} credit{model.creditCost !== 1 ? 's' : ''}</div>
        </button>
      ))}
    </div>
  );
}
