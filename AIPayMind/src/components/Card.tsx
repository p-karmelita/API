interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
}

export default function Card({ children, className = '', title, icon }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      {(title || icon) && (
        <div className="flex items-center gap-3 mb-4">
          {icon && <div className="text-blue-600">{icon}</div>}
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
        </div>
      )}
      {children}
    </div>
  );
}
