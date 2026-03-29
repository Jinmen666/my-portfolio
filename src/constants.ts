import { Briefcase, Code, Palette, Search, Video } from 'lucide-react';
import { NavItem, Service, Project, Experience, Article, Testimonial } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: '首页', id: 'home' },
  { label: '关于我', id: 'about' },
  { label: '日常', id: 'daily' },
  { label: '文章', id: 'articles' },
  { label: '产品展示', id: 'works' },
];

export const SERVICES: Service[] = [
  {
    title: 'Web design',
    description: 'Lacus adipiscing lectus convallis purus aliquet cursus magnaol dolori montes augue donec cras.',
    icon: 'https://picsum.photos/seed/web/200/200',
    color: 'bg-white',
  },
  {
    title: 'UI/UX design',
    description: 'Arcu venenatis sit nullam pellentesq varius urna non sed aliquam colemir imperdiet amet imperdiet.',
    icon: 'https://picsum.photos/seed/uiux/200/200',
    color: 'bg-white',
  },
  {
    title: 'Product design',
    description: 'Arcu venenatis sit nullam pellentesq varius urna non sed aliquam colemir imperdiet amet imperdiet.',
    icon: 'https://picsum.photos/seed/product/200/200',
    color: 'bg-white',
  },
  {
    title: 'User research',
    description: 'Lacus adipiscing lectus convallis purus aliquet cursus magnaol dolori montes augue donec cras.',
    icon: 'https://picsum.photos/seed/research/200/200',
    color: 'bg-white',
  },
  {
    title: 'Motion graphics',
    description: 'Lacus adipiscing lectus convallis purus aliquet cursus magnaol dolori montes augue donec cras.',
    icon: 'https://picsum.photos/seed/motion/200/200',
    color: 'bg-white',
  },
];

export const PROJECTS: Project[] = [
  {
    title: 'Studio user research and analysis',
    category: 'UI/UX Design',
    description: 'In ultricies viverra sed at hendrerit drogon nunc scelerisque nisl pellentesque et dignissim at aenean tempor adipiscing eget mi diam at tempus.',
    image: 'https://picsum.photos/seed/studio/600/400',
    color: 'bg-brand-purple',
    link: '#',
  },
  {
    title: 'Venture Workspace web app redesign',
    category: 'UI/UX Design',
    description: 'In ultricies viverra sed at hendrerit drogon nunc scelerisque nisl pellentesque et dignissim at aenean tempor adipiscing eget mi diam at tempus.',
    image: 'https://picsum.photos/seed/venture/600/400',
    color: 'bg-brand-blue',
    link: '#',
  },
];

export const EXPERIENCES: Experience[] = [
  {
    period: 'Jan 2023 - Present',
    role: 'Mobile Product Designer',
    description: 'Vel facilisis volutpat est velit egestas dui. Urna nec cidu praesent semper feugiat. Vulputate ut pharetra sit.',
    icon: Briefcase,
    color: 'bg-brand-blue',
  },
  {
    period: 'Jan 2021 - Dec 2022',
    role: 'VP of Design',
    description: 'Vel facilisis volutpat est velit egestas dui. Urna nec cidu praesent semper feugiat. Vulputate ut pharetra sit.',
    icon: Palette,
    color: 'bg-brand-blue',
  },
  {
    period: 'Mar 2020 - Dec 2020',
    role: 'Head of Product Design',
    description: 'Vel facilisis volutpat est velit egestas dui. Urna nec cidu praesent semper feugiat. Vulputate ut pharetra sit.',
    icon: Code,
    color: 'bg-brand-yellow',
  },
  {
    period: 'Sep 2017 - Feb 2020',
    role: 'Web Designer',
    description: 'Vel facilisis volutpat est velit egestas dui. Urna nec cidu praesent semper feugiat. Vulputate ut pharetra sit.',
    icon: Video,
    color: 'bg-brand-pink',
  },
];

export const ARTICLES: Article[] = [
  {
    title: 'What is the right design tool to choose in 2023?',
    category: 'Resources',
    date: 'Oct 28, 2022',
    author: 'John Carter',
    image: 'https://picsum.photos/seed/tool/400/300',
  },
  {
    title: 'Font sizes in UI design: The complete guide to follow',
    category: 'Articles',
    date: 'Oct 20, 2022',
    author: 'John Carter',
    image: 'https://picsum.photos/seed/font/400/300',
  },
  {
    title: '6 practical exercises to learn become a pro UI/UX designer',
    category: 'News',
    date: 'Oct 15, 2022',
    author: 'John Carter',
    image: 'https://picsum.photos/seed/exercise/400/300',
  },
  {
    title: 'The future of AI in product design',
    category: 'Articles',
    date: 'Oct 10, 2022',
    author: 'John Carter',
    image: 'https://picsum.photos/seed/ai/400/300',
  },
  {
    title: 'How to build a design system from scratch',
    category: 'Resources',
    date: 'Oct 05, 2022',
    author: 'John Carter',
    image: 'https://picsum.photos/seed/system/400/300',
  },
  {
    title: '10 tips for better user interviews',
    category: 'News',
    date: 'Sep 28, 2022',
    author: 'John Carter',
    image: 'https://picsum.photos/seed/interview/400/300',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: '吾生也有涯，而知也无涯。',
    author: '——庄子',
    role: '',
    image: 'https://picsum.photos/seed/zhuangzi/200/200',
  },
];
