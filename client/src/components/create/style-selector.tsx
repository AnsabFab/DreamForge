import { Style } from "@shared/schema";

interface StyleSelectorProps {
  styles: Style[];
  value?: number;
  onChange: (value: number | undefined) => void;
}

export function StyleSelector({ styles, value, onChange }: StyleSelectorProps) {
  const handleSelect = (styleId: number) => {
    // Toggle the selection
    onChange(value === styleId ? undefined : styleId);
  };

  if (!styles || styles.length === 0) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div 
            key={i} 
            className="py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm animate-pulse bg-gray-100 dark:bg-gray-800"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {styles.map((style) => (
        <button
          key={style.id}
          type="button"
          className={`py-2 px-3 border transition-colors rounded-lg text-sm ${
            value === style.id
              ? "border-indigo-500 bg-indigo-500 bg-opacity-10 text-indigo-500 font-medium"
              : "border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
          onClick={() => handleSelect(style.id)}
        >
          {style.name}
        </button>
      ))}
      <button
        type="button"
        className="py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        More...
      </button>
    </div>
  );
}
