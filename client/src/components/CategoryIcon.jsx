import React from 'react';
import {
  Utensils,
  Plane,
  ShoppingBag,
  ReceiptText,
  Film,
  HeartPulse,
  Folder,
} from 'lucide-react';
import { CATEGORY_COLORS } from '../utils/constants.js';

export const CATEGORY_ICON_MAP = {
  Food: Utensils,
  Travel: Plane,
  Shopping: ShoppingBag,
  Bills: ReceiptText,
  Entertainment: Film,
  Health: HeartPulse,
  Others: Folder,
};

const CategoryIcon = ({
  category = 'Others',
  size = 'md', // 'sm' | 'md' | 'lg'
  showBadge = true,
}) => {
  const IconComponent = CATEGORY_ICON_MAP[category] || Folder;
  const colorStyle = CATEGORY_COLORS[category] || CATEGORY_COLORS.Others;

  const sizeClasses = {
    sm: 'w-6 h-6 p-1 rounded-md text-xs',
    md: 'w-8 h-8 p-1.5 rounded-xl text-sm',
    lg: 'w-10 h-10 p-2 rounded-2xl text-base',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  if (!showBadge) {
    return <IconComponent className={`${iconSizes[size] || iconSizes.md} ${colorStyle.text}`} />;
  }

  return (
    <div
      className={`inline-flex items-center justify-center flex-shrink-0 ${
        sizeClasses[size] || sizeClasses.md
      } ${colorStyle.bg} ${colorStyle.text} border ${colorStyle.border} shadow-2xs`}
      title={category}
    >
      <IconComponent className={iconSizes[size] || iconSizes.md} />
    </div>
  );
};

export default CategoryIcon;
