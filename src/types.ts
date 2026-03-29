import { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  id: string;
}

export interface Service {
  title: string;
  description: string;
  icon: string; // We'll use a placeholder or specific illustration
  color: string;
}

export interface Project {
  title: string;
  category: string;
  description: string;
  image: string;
  color: string;
  link: string;
}

export interface Experience {
  period: string;
  role: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

export interface Article {
  title: string;
  category: string;
  date: string;
  author: string;
  image: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  image: string;
}
