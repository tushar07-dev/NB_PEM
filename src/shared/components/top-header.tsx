import { Bell, Search, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Icons } from "@/shared/components/icons"; //

export function TopHeader() {
  return (
    <header
      className={cn(
        "monitor:px-6 monitor:py-5 flex w-full shrink-0 items-center justify-between border-0 bg-[var(--color-primary-700)] px-5 py-3.5"
      )}
    >
      {/* LEFT: Branding with ProjectLogo */}
      <div className="monitor:gap-6 flex items-center gap-4">
        <Icons.ProjectLogo className="monitor:size-10 size-8" />

        <h1 className={cn("text-title hidden sm:block")}>
          PEM Knowledge Base And Check Lists
        </h1>
      </div>

      {/* RIGHT: Actions & Profile */}
      <div className="monitor:gap-6 flex items-center gap-3">
        {/* Rounded Search Bar */}
        <div className="relative hidden items-center md:flex">
          <Input
            type="text"
            placeholder="Search Anything..."
            className="monitor:w-80 monitor:text-sm h-9 w-64 rounded-full border-none bg-white/10 pr-10 pl-4 text-xs text-white placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-white/30"
          />
          <Search className="absolute right-3 size-4 text-slate-400" />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full text-white hover:bg-white/10"
          >
            <Bell className="size-5" />
            <span className="absolute top-0 right-1.5 size-2 rounded-full border-2 border-[var(--color-primary-700)] bg-[var(--color-error-500)]">
              1
            </span>
          </Button>

          <Button
            variant="ghost"
            // size="icon"
            className="h-7 w-7 rounded-full text-white hover:bg-white/10"
          >
            <Settings className="size-5" />
          </Button>
        </div>

        {/* Profile Avatar */}
        <div className="monitor:h-12 monitor:w-12 flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-bold text-[var(--color-primary-700)] shadow-sm">
          XF
        </div>
      </div>
    </header>
  );
}
