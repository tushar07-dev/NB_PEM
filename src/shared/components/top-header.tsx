import { Bell, Search, Settings } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Icons } from "./icons";

import { cn } from "@/shared/lib/utils";

// const HeaderLogo = () => (
//   <div className="flex items-center shrink-0" style={{ width: 'var(--header-logo-size)', height: 'var(--header-logo-size)' }}>
//     <Icons.ProjectLogo className="w-full h-full" />
//   </div>
// );

// const HeaderTitle = () => (
//   <span 
//     className="whitespace-nowrap text-white capitalize font-heading"
//     style={{ 
//       marginLeft: 'var(--header-gap-logo-text)',
//       fontSize: '1rem', // 16px constant as per your request
//       fontWeight: 700,
//       letterSpacing: '-0.32px'
//     }}
//   >
//     PEM knowledge Base and Check Lists
//   </span>
// );

const HeaderSearch = () => (
  <div 
    className="flex items-center justify-between border bg-white"
    style={{ 
      width: 'var(--search-width)', 
      height: 'var(--search-height)',
      padding: '0 16px', // Standardized horizontal padding
      borderRadius: '100px',
      borderColor: '#EBEBEB'
    }}
  >
    <input
      type="text"
      placeholder="Search Anything..."
      className="bg-transparent border-none outline-none w-full"
      style={{ 
        // Color mapping with your specific fallbacks
        color: 'var(--Primary-Color-Dark-Blue-600, #081E32)',
        
        // Typography: Body Medium/Medium
        fontFamily: 'var(--Font-Family-Font-Name, "Helvetica Now Text")',
        fontSize: 'var(--Font-Family-Font-Size-font-size-100, 12px)',
        fontStyle: 'normal',
        fontWeight: 'var(--Font-Family-Weight-weight-500, 400)',
        lineHeight: 'var(--Font-Family-Line-height-lh-300, 19px)',
        
        // Retaining your design letter-spacing
        letterSpacing: '-0.32px'
      }}
    />
    {/* Search Icon on the right as per your Figma image */}
    <Search size={20} className="text-[#919191] shrink-0 ml-2" />
  </div>
);

const ActionButton = ({ icon: Icon }: { icon: any }) => (
  <button 
    className="flex items-center justify-center rounded-full bg-white text-slate-600 hover:bg-slate-100 transition-colors"
    style={{ width: 'var(--header-icon-size)', height: 'var(--header-icon-size)' }}
  >
    <Icon size={20} />
  </button>
);

export function TopHeader() {
  return (
    <header 
      className="flex items-center justify-between bg-sidebar-accent w-full border-none shadow-sm shrink-0"
      style={{ height: 'var(--header-height)', padding: '0 var(--header-px)' }}
    >
      {/* Left Section: Logo & Fluid Title */}
      <div className="flex items-center">
        <div style={{ width: 'var(--header-logo-size)', height: 'var(--header-logo-size)' }}>
          <Icons.ProjectLogo className="w-full h-full" />
        </div>
        
        <h1 
          className="text-(--header-font-size-logo) tracking-(--header-letter-spacing-logo) font-(--font-family-heading) text-white capitalize whitespace-nowrap"
          style={{ 
            marginLeft: 'var(--header-gap-logo-text)',
            // fontFamily: 'Solutioneer',
            // fontSize: 'var(--font-size-300)',
            // fontWeight: 'var(--weight-700)',
            // letterSpacing: '-0.32px'
          }}
        >
          PEM knowledge Base and Check Lists
        </h1>
      </div>

      {/* Right Section: Search & Actions */}
      <div className="flex items-center gap-4">
        <HeaderSearch />
        
        <div className="flex items-center" style={{ gap: 'var(--header-actions-gap)' }}>
          <ActionButton icon={Bell} />
          <ActionButton icon={Settings} />
        </div>

        {/* Profile Prefix */}
        <div 
          className="bg-white rounded-full flex items-center justify-center font-bold text-slate-900 border"
          style={{ 
            width: 'var(--header-prefix-size)', 
            height: 'var(--header-prefix-size)',
            fontSize: 'calc(var(--font-size-300) * 0.9)'
          }}
        >
          XF
        </div>
      </div>
    </header>
  );
}

// Parent Namespace
export const PEM = {
  Header: TopHeader,
};