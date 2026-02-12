import {
  X,
  Check,
  TriangleAlert,
  Info,
  HelpCircle,
  Send,
  CircleCheck,
  CircleAlert,
  Briefcase,
  GraduationCap,
  Code2,
  Folder,
  Award,
  Quote,
  Heart,
  Trophy,
  MapPin,
  User,
  MessageCircle,
  Clock,
  Laptop,
  ArrowRight,
  ArrowLeft,
  Handshake,
  Accessibility,
  Shield,
  Gauge,
  Github,
  Linkedin,
  Scale,
  Star,
  TrendingUp,
  Calendar,
  CreditCard,
  ExternalLink,
  RefreshCw,
  Globe,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Cloud,
  Video,
  Circle,
  Crown,
  Leaf,
  Sprout,
  TreePine,
  Moon,
  Sun,
  Home,
  type LucideIcon
} from 'lucide-preact'
import { cn } from '../../lib/utils'

const iconMap: Record<string, LucideIcon> = {
  'times': X,
  'x': X,
  'check': Check,
  'triangle-exclamation': TriangleAlert,
  'exclamation-triangle': TriangleAlert,
  'info-circle': Info,
  'info': Info,
  'question-circle': HelpCircle,
  'paper-plane': Send,
  'send': Send,
  'check-circle': CircleCheck,
  'exclamation-circle': CircleAlert,
  'briefcase': Briefcase,
  'graduation-cap': GraduationCap,
  'code': Code2,
  'folder': Folder,
  'certificate': Award,
  'award': Award,
  'quote-left': Quote,
  'heart': Heart,
  'trophy': Trophy,
  'location-dot': MapPin,
  'map-marker-alt': MapPin,
  'map-pin': MapPin,
  'user-tie': User,
  'user': User,
  'comment-dots': MessageCircle,
  'message-circle': MessageCircle,
  'clock': Clock,
  'laptop': Laptop,
  'arrow-right': ArrowRight,
  'arrow-left': ArrowLeft,
  'handshake': Handshake,
  'universal-access': Accessibility,
  'shield-halved': Shield,
  'shield': Shield,
  'gauge-high': Gauge,
  'gauge': Gauge,
  'github': Github,
  'linkedin-in': Linkedin,
  'linkedin': Linkedin,
  'firefox-browser': Globe,
  'scale-balanced': Scale,
  'scale': Scale,
  'star': Star,
  'chart-line': TrendingUp,
  'trending-up': TrendingUp,
  'seedling': Sprout,
  'leaf': Leaf,
  'tree': TreePine,
  'crown': Crown,
  'circle': Circle,
  'calendar': Calendar,
  'id-card': CreditCard,
  'external-link': ExternalLink,
  'external-link-alt': ExternalLink,
  'refresh': RefreshCw,
  'refresh-cw': RefreshCw,
  'globe': Globe,
  'language': Globe,
  'languages': Globe,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'chevron-up': ChevronUp,
  'arrow-up': ChevronUp,
  'robot': HelpCircle,
  'cloud': Cloud,
  'video': Video,
  'screwdriver-wrench': Laptop,
  'lightbulb': Award,
  'server': Shield,
  'moon': Moon,
  'sun': Sun,
  'home': Home
}

export type IconName = keyof typeof iconMap

export interface IconProps {
  name: string
  className?: string
  size?: number
  'aria-hidden'?: boolean
}

/**
 * Renders an icon by name (maps Font Awesome-style names to Lucide icons).
 * Use for accessibility; pass aria-hidden when decorative.
 */
export function Icon({ name, className, size = 18, 'aria-hidden': ariaHidden = true }: IconProps) {
  const normalized = name.replace(/^fa-solid fa-|^fa-brands fa-|^fa /i, '').toLowerCase()
  const LucideIcon = iconMap[normalized] ?? HelpCircle
  return (
    <LucideIcon
      size={size}
      className={cn('shrink-0 outline-none', className)}
      aria-hidden={ariaHidden}
    />
  )
}
