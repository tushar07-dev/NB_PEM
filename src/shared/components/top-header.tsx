import { useState, useEffect } from "react";
import { Bell, Search, Settings, Sun, Moon } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Icons } from "@/shared/components/icons";
import { useTheme } from "next-themes";

export function TopHeader() {
  const notificationCount = 3;

  // State to store window dimensions
  const [dimensions, setDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  // const { setTheme, theme } = useTheme();

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header role="banner" className="top-header-bar">
      <div className="flex items-center gap-3">
        <Icons.ProjectLogo className="text-primary-foreground" />
        <span className="brand-text">PEM Digital</span>
        <div className="header-search-container">
          <Input
            type="text"
            placeholder="Search Anything..."
            className="header-pill text-primary-700 h-[32px] px-4 pr-10 text-sm lg:h-[44px]"
          />
          <Search className="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-primary-400" />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <Select defaultValue="project-a">
          <SelectTrigger className="header-pill hidden h-[32px] w-[160px] text-sm sm:flex lg:h-[46px] lg:w-[180px] lg:text-base xl:w-[200px]">
            <SelectValue placeholder="Select Project" />
          </SelectTrigger>

          <SelectContent className="border-border bg-popover rounded-xl shadow-lg">
            <DropdownMenuLabel className="text-muted-foreground px-2 py-1.5 text-[19px] font-bold tracking-wider uppercase">
              Active Projects
            </DropdownMenuLabel>
            <SelectItem value="project-a" className="cursor-pointer rounded-lg">
              PEM Phase 1
            </SelectItem>
            <SelectItem value="project-b" className="cursor-pointer rounded-lg">
              Digital Audit 2024
            </SelectItem>
            <SelectItem value="project-c" className="cursor-pointer rounded-lg">
              Cloud Migration
            </SelectItem>
          </SelectContent>
        </Select>

        <Button variant="ghost" size="icon" className="header-icon-btn">
          <Bell className="size-4 lg:size-5" />
        </Button>

        <Button variant="ghost" size="icon" className="header-icon-btn">
          <Settings className="size-4 xl:size-6" />
        </Button>

        <Avatar className="size-[32px] border-none ring-1 ring-white/20 hover:ring-white/40 lg:size-[50px]">
          <AvatarFallback className="avatar-fallback">XF</AvatarFallback>
        </Avatar>

        {/* <div className="flex-row">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="header-dropdown-trigger-button text-white hover:bg-white/80"
            aria-label="Toggle theme"
          >
            <Sun className="size-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute size-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          </Button>
          <div className="ml-2 hidden flex-col items-end border-l border-white/20 pl-3 opacity-60 md:flex">
            <span className="font-mono text-[9px] tracking-widest text-white uppercase">
              {dimensions.width >= 1800
                ? "MONITOR (XL)"
                : dimensions.width >= 1500
                  ? "LAPTOP (LG)"
                  : dimensions.width >= 800
                    ? "TABLET (SM)"
                    : "MOBILE"}
            </span>
            <span className="font-mono text-[10px] font-bold text-white">
              {dimensions.width}px
            </span>
          </div>
        </div> */}
      </div>
    </header>
  );
}
