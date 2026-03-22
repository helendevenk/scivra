import { ComponentType, lazy, Suspense } from 'react';

const iconCache: { [key: string]: ComponentType<any> } = {};

// Function to automatically detect icon library
function detectIconLibrary(name: string): 'ri' | 'lucide' {
  if (name && name.startsWith('Ri')) {
    return 'ri';
  }

  return 'lucide';
}

export function SmartIcon({
  name,
  size = 24,
  className,
  ...props
}: {
  name: string;
  size?: number;
  className?: string;
  [key: string]: any;
}) {
  const library = detectIconLibrary(name);
  const cacheKey = `${library}-${name}`;

  if (!iconCache[cacheKey]) {
    if (library === 'ri') {
      // React Icons (Remix Icons)
      iconCache[cacheKey] = lazy(async () => {
        try {
          const icons = await import('react-icons/ri');
          const IconComponent = icons[name as keyof typeof icons];
          if (IconComponent) {
            return { default: IconComponent as ComponentType<any> };
          } else {
            console.warn(
              `Icon "${name}" not found in react-icons/ri, using fallback`
            );
            return { default: icons.RiQuestionLine as ComponentType<any> };
          }
        } catch (error) {
          console.error(`Failed to load react-icons/ri:`, error);
          const fallbackModule = await import('react-icons/ri');
          return {
            default: fallbackModule.RiQuestionLine as ComponentType<any>,
          };
        }
      });
    } else {
      // Lucide React (default)
      iconCache[cacheKey] = lazy(async () => {
        try {
          const icons = await import('lucide-react');
          const IconComponent = icons[name as keyof typeof icons];
          if (IconComponent) {
            return { default: IconComponent as ComponentType<any> };
          } else {
            console.warn(
              `Icon "${name}" not found in lucide-react, using fallback`
            );
            return { default: icons.HelpCircle as ComponentType<any> };
          }
        } catch (error) {
          console.error(`Failed to load lucide-react:`, error);
          const fallbackModule = await import('lucide-react');
          return { default: fallbackModule.HelpCircle as ComponentType<any> };
        }
      });
    }
  }

  const IconComponent = iconCache[cacheKey];

  return (
    <Suspense fallback={<div style={{ width: size, height: size }} />}>
      <IconComponent size={size} className={className} {...props} />
    </Suspense>
  );
}
