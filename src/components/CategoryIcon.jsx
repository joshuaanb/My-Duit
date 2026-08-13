import React from 'react';
import {
  Briefcase,
  Award,
  TrendingUp,
  Utensils,
  Car,
  ShoppingBag,
  Receipt,
  Tv,
  HeartPulse,
  Tag,
  DollarSign,
  PieChart
} from 'lucide-react';

const iconMap = {
  Salary: Briefcase,
  Bonus: Award,
  Investment: TrendingUp,
  Food: Utensils,
  Transportation: Car,
  Shopping: ShoppingBag,
  Bills: Receipt,
  Entertainment: Tv,
  Health: HeartPulse,
  Other: Tag
};

export const CategoryIcon = ({ category, className = 'w-4 h-4' }) => {
  const IconComponent = iconMap[category] || Tag;
  return <IconComponent className={className} />;
};
