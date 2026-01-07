import { Bell, Search, Settings } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"

export function TopHeader() {
  return (
     <header className="bg-primary text-primary-foreground px-8 py-4 border-b border-primary flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center">
          <span className="text-xs font-bold">P</span>
        </div>
        <h1 className="text-lg font-semibold">PEM Digital</h1>
      </div>

      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary-foreground/60" />
          <Input
            type="text"
            placeholder="Search Anything..."
            className="w-full pl-10 pr-4 py-2 rounded-full bg-white/10 text-primary-foreground placeholder-primary-foreground/60 border border-white/20 focus:outline-none focus:border-white/40"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Settings className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-semibold text-sm">
          XF
        </Button>
      </div>
    </header>
  )
}