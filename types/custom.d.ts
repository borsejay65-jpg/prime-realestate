declare module 'lucide-react' {
  import * as React from 'react';

  export interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: string | number;
    absoluteStrokeWidth?: boolean;
  }

  export type Icon = React.ForwardRefExoticComponent<
    Omit<IconProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >;

  export const LayoutDashboard: Icon;
  export const Building2: Icon;
  export const Image: Icon;
  export const FileText: Icon;
  export const MessageSquare: Icon;
  export const HelpCircle: Icon;
  export const Users: Icon;
  export const Settings2: Icon;
  export const ExternalLink: Icon;
  export const LogOut: Icon;
  export const Menu: Icon;
  export const X: Icon;
  export const ChevronRight: Icon;
  export const ChevronLeft: Icon;
  export const ChevronDown: Icon;
  export const Shield: Icon;
  export const ShieldCheck: Icon;
  export const UserCheck: Icon;
  export const Scale: Icon;
  export const Landmark: Icon;
  export const BadgePercent: Icon;
  export const Handshake: Icon;
  export const Headphones: Icon;
  export const Award: Icon;
  export const Home: Icon;
  export const Map: Icon;
  export const TreePine: Icon;
  export const Key: Icon;
  export const Crown: Icon;
  export const Briefcase: Icon;
  export const Package: Icon;
  export const MapPin: Icon;
  export const Phone: Icon;
  export const Mail: Icon;
  export const Clock: Icon;
  export const Star: Icon;
  export const Search: Icon;
  export const SearchX: Icon;
  export const ArrowRight: Icon;
  export const Share2: Icon;
  export const MessageCircle: Icon;
  export const CalendarCheck: Icon;
  export const Download: Icon;
  export const Send: Icon;
  export const BedDouble: Icon;
  export const Bath: Icon;
  export const Maximize: Icon;
  export const Car: Icon;
  export const SlidersHorizontal: Icon;
  export const Hash: Icon;
  export const Tag: Icon;
  export const IndianRupee: Icon;
  export const DoorOpen: Icon;
  export const Layers: Icon;
  export const Compass: Icon;
  export const HardHat: Icon;
  export const Calendar: Icon;
  export const Calculator: Icon;
  export const TrendingUp: Icon;
  export const Edit2: Icon;
  export const Trash2: Icon;
  export const Eye: Icon;
  export const Copy: Icon;
  export const Plus: Icon;
  export const Facebook: Icon;
  export const Instagram: Icon;
  export const Twitter: Icon;
  export const Linkedin: Icon;
  export const Youtube: Icon;
}
