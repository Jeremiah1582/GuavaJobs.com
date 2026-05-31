"use client"

import { useEffect, useState } from "react"
import { FileText, User, Sparkles, CheckCircle2, Shield, Table2, ArrowRight } from "lucide-react"

type AnimationPhase = 
  | "idle" 
  | "showing-inputs" 
  | "merging" 
  | "generating" 
  | "complete" 
  | "saving-to-tracker"
  | "status-applied"
  | "status-offer-made"
  | "status-accepted"

export default function PhoneAnimation() {
  const [phase, setPhase] = useState<AnimationPhase>("idle")
  const [cycleCount, setCycleCount] = useState(0)

  useEffect(() => {
    const runAnimation = () => {
      // Phase 1: Show inputs
      setPhase("showing-inputs")
      
      setTimeout(() => {
        // Phase 2: Merge animation
        setPhase("merging")
      }, 2000)

      setTimeout(() => {
        // Phase 3: Generating
        setPhase("generating")
      }, 3500)

      setTimeout(() => {
        // Phase 4: Complete (with no-hallucination badge)
        setPhase("complete")
      }, 5500)

      setTimeout(() => {
        // Phase 5: Saving to tracker
        setPhase("saving-to-tracker")
      }, 7500)

      setTimeout(() => {
        // Phase 6: Status - Applied
        setPhase("status-applied")
      }, 9000)

      setTimeout(() => {
        // Phase 7: Status - Offer Made
        setPhase("status-offer-made")
      }, 11000)

      setTimeout(() => {
        // Phase 8: Status - Offer Accepted
        setPhase("status-accepted")
      }, 13000)

      setTimeout(() => {
        // Reset for next cycle
        setPhase("idle")
        setCycleCount(c => c + 1)
      }, 16000)
    }

    // Start animation after a short delay
    const startDelay = setTimeout(() => {
      runAnimation()
    }, 1000)

    return () => clearTimeout(startDelay)
  }, [cycleCount])

  const isDocumentPhase = phase === "generating" || phase === "complete"
  const isTrackerPhase = phase === "saving-to-tracker" || phase === "status-applied" || phase === "status-offer-made" || phase === "status-accepted"

  const getStatusColor = () => {
    switch (phase) {
      case "status-applied": return "oklch(0.65 0.15 250)" // Blue
      case "status-offer-made": return "oklch(0.70 0.15 80)" // Amber/Yellow
      case "status-accepted": return "oklch(0.65 0.18 145)" // Green
      default: return "oklch(0.65 0.15 250)"
    }
  }

  const getStatusBgColor = () => {
    switch (phase) {
      case "status-applied": return "oklch(0.65 0.15 250 / 0.15)"
      case "status-offer-made": return "oklch(0.70 0.15 80 / 0.15)"
      case "status-accepted": return "oklch(0.65 0.18 145 / 0.15)"
      default: return "oklch(0.65 0.15 250 / 0.15)"
    }
  }

  const getStatusText = () => {
    switch (phase) {
      case "status-applied": return "Applied"
      case "status-offer-made": return "Offer Made"
      case "status-accepted": return "Accepted"
      default: return "Applied"
    }
  }

  return (
    <div className="relative flex items-center justify-center py-16">
      {/* Phone frame */}
      <div 
        className="relative w-[280px] h-[580px] rounded-[40px] p-3 shadow-2xl"
        style={{
          background: "linear-gradient(145deg, oklch(0.25 0.02 280) 0%, oklch(0.18 0.02 280) 100%)",
          boxShadow: "0 25px 80px -12px oklch(0.20 0.02 280 / 0.4), 0 0 0 1px oklch(0.35 0.02 280 / 0.3)"
        }}
      >
        {/* Notch */}
        <div 
          className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 rounded-full z-20"
          style={{ background: "oklch(0.15 0.02 280)" }}
        />
        
        {/* Screen */}
        <div 
          className="relative w-full h-full rounded-[32px] overflow-hidden"
          style={{ background: "var(--background)" }}
        >
          {/* Status bar */}
          <div className="flex items-center justify-between px-6 pt-8 pb-2">
            <span className="text-[10px] font-medium text-muted-foreground">9:41</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-2 rounded-sm border border-muted-foreground/50">
                <div className="w-3 h-1.5 rounded-sm bg-accent m-[1px]" />
              </div>
            </div>
          </div>

          {/* App header */}
          <div className="px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <div 
                className="w-6 h-6 rounded-lg flex items-center justify-center"
                style={{ background: "oklch(0.65 0.18 25 / 0.15)" }}
              >
                <span className="text-[10px]" style={{ color: "oklch(0.65 0.18 25)" }}>G</span>
              </div>
              <span className="text-xs font-semibold text-foreground">Guavajobs</span>
            </div>
          </div>

          {/* Content area */}
          <div className="p-4 h-[calc(100%-90px)] flex flex-col">
            {/* Title */}
            <h3 className="text-sm font-semibold text-foreground mb-4 text-center">
              {isTrackerPhase ? "Application Tracker" : 
               phase === "complete" ? "Cover Letter Ready" : "AI Cover Letter"}
            </h3>

            {/* Animation container */}
            <div className="flex-1 relative">
              {/* Job Description Card */}
              <div 
                className={`absolute left-0 w-[45%] transition-all ease-out ${
                  phase === "idle" ? "opacity-0 translate-y-4" :
                  phase === "showing-inputs" ? "opacity-100 translate-y-0" :
                  phase === "merging" ? "opacity-100 translate-x-[60%] scale-90" :
                  "opacity-0 scale-75"
                }`}
                style={{ 
                  transitionDuration: "1000ms",
                  top: "8%"
                }}
              >
                <div 
                  className="p-3 rounded-xl border border-border/50"
                  style={{ 
                    background: "linear-gradient(135deg, oklch(0.85 0.06 290 / 0.2) 0%, oklch(0.90 0.04 290 / 0.1) 100%)"
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-3 h-3" style={{ color: "oklch(0.60 0.10 290)" }} />
                    <span className="text-[9px] font-medium text-foreground">Job Description</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-1.5 rounded-full bg-muted-foreground/20 w-full" />
                    <div className="h-1.5 rounded-full bg-muted-foreground/20 w-4/5" />
                    <div className="h-1.5 rounded-full bg-muted-foreground/15 w-3/5" />
                    <div className="h-1.5 rounded-full bg-muted-foreground/10 w-4/5" />
                  </div>
                </div>
              </div>

              {/* Profile Card */}
              <div 
                className={`absolute right-0 w-[45%] transition-all ease-out ${
                  phase === "idle" ? "opacity-0 translate-y-4" :
                  phase === "showing-inputs" ? "opacity-100 translate-y-0" :
                  phase === "merging" ? "opacity-100 -translate-x-[60%] scale-90" :
                  "opacity-0 scale-75"
                }`}
                style={{ 
                  transitionDuration: "1000ms",
                  transitionDelay: phase === "showing-inputs" ? "300ms" : "0ms",
                  top: "8%"
                }}
              >
                <div 
                  className="p-3 rounded-xl border border-border/50"
                  style={{ 
                    background: "linear-gradient(135deg, oklch(0.85 0.08 50 / 0.2) 0%, oklch(0.90 0.05 50 / 0.1) 100%)"
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-3 h-3" style={{ color: "oklch(0.60 0.10 50)" }} />
                    <span className="text-[9px] font-medium text-foreground">Your Profile</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-1.5 rounded-full bg-muted-foreground/20 w-3/4" />
                    <div className="h-1.5 rounded-full bg-muted-foreground/20 w-full" />
                    <div className="h-1.5 rounded-full bg-muted-foreground/15 w-2/3" />
                    <div className="h-1.5 rounded-full bg-muted-foreground/10 w-4/5" />
                  </div>
                </div>
              </div>

              {/* Merge indicator / Sparkle */}
              <div 
                className={`absolute left-1/2 -translate-x-1/2 transition-all ease-out ${
                  phase === "merging" ? "opacity-100 scale-100" :
                  phase === "generating" ? "opacity-100 scale-110" :
                  "opacity-0 scale-50"
                }`}
                style={{ 
                  transitionDuration: "800ms",
                  top: "16%"
                }}
              >
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    phase === "generating" ? "animate-pulse" : ""
                  }`}
                  style={{ 
                    background: "linear-gradient(135deg, oklch(0.65 0.18 25 / 0.2) 0%, oklch(0.70 0.15 40 / 0.15) 100%)",
                    boxShadow: phase === "generating" ? "0 0 20px oklch(0.65 0.18 25 / 0.3)" : "none"
                  }}
                >
                  <Sparkles className="w-5 h-5 text-accent" />
                </div>
              </div>

              {/* Generated Document */}
              <div 
                className={`absolute left-1/2 -translate-x-1/2 w-[85%] transition-all ease-out ${
                  isDocumentPhase ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ 
                  transitionDuration: "1000ms",
                  transitionDelay: phase === "generating" ? "500ms" : "0ms",
                  top: "32%"
                }}
              >
                <div 
                  className="p-3 rounded-xl border border-accent/30 relative overflow-hidden"
                  style={{ 
                    background: "linear-gradient(145deg, var(--card) 0%, oklch(0.98 0.01 50 / 0.5) 100%)",
                    boxShadow: phase === "complete" ? "0 8px 32px oklch(0.65 0.18 25 / 0.15)" : "none"
                  }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-3 h-3 text-accent" />
                      <span className="text-[9px] font-semibold text-foreground">Cover Letter</span>
                    </div>
                    {phase === "complete" && (
                      <CheckCircle2 className="w-3 h-3 text-accent animate-in fade-in zoom-in duration-500" />
                    )}
                  </div>
                  
                  {/* Document lines - more compact */}
                  <div className="space-y-1.5">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-700 ${
                        phase === "complete" ? "bg-foreground/15 w-full" : "bg-muted-foreground/10 w-0"
                      }`}
                    />
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-700 ${
                        phase === "complete" ? "bg-foreground/12 w-[90%]" : "bg-muted-foreground/10 w-0"
                      }`}
                      style={{ transitionDelay: "100ms" }}
                    />
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-700 ${
                        phase === "complete" ? "bg-foreground/10 w-[95%]" : "bg-muted-foreground/10 w-0"
                      }`}
                      style={{ transitionDelay: "200ms" }}
                    />
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-700 ${
                        phase === "complete" ? "bg-foreground/12 w-[70%]" : "bg-muted-foreground/10 w-0"
                      }`}
                      style={{ transitionDelay: "300ms" }}
                    />
                  </div>

                  {/* Generating shimmer overlay */}
                  {phase === "generating" && (
                    <div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/10 to-transparent"
                      style={{
                        animation: "shimmer 1.5s infinite"
                      }}
                    />
                  )}
                </div>

                {/* No Hallucinations Badge - shown during complete phase */}
                {phase === "complete" && (
                  <div 
                    className="mt-3 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg animate-in fade-in slide-in-from-bottom-2 duration-700"
                    style={{ 
                      background: "linear-gradient(135deg, oklch(0.65 0.15 145 / 0.12) 0%, oklch(0.70 0.12 145 / 0.08) 100%)",
                      border: "1px solid oklch(0.65 0.15 145 / 0.25)"
                    }}
                  >
                    <Shield className="w-3 h-3" style={{ color: "oklch(0.55 0.15 145)" }} />
                    <span className="text-[8px] font-medium" style={{ color: "oklch(0.40 0.10 145)" }}>
                      No hallucinations - uses only your data
                    </span>
                  </div>
                )}
              </div>

              {/* Application Tracker View */}
              <div 
                className={`absolute left-1/2 -translate-x-1/2 w-[92%] transition-all ease-out ${
                  isTrackerPhase ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12 pointer-events-none"
                }`}
                style={{ 
                  transitionDuration: "1000ms",
                  top: "5%"
                }}
              >
                {/* Saving animation */}
                {phase === "saving-to-tracker" && (
                  <div className="flex flex-col items-center justify-center py-8 animate-in fade-in duration-500">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center mb-3 animate-pulse"
                      style={{ 
                        background: "linear-gradient(135deg, oklch(0.65 0.18 25 / 0.15) 0%, oklch(0.70 0.15 40 / 0.1) 100%)"
                      }}
                    >
                      <Table2 className="w-6 h-6 text-accent" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground">Saving to tracker</span>
                      <div className="flex gap-0.5">
                        <div className="w-1 h-1 rounded-full bg-accent animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-1 h-1 rounded-full bg-accent animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-1 h-1 rounded-full bg-accent animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Tracker Table */}
                {(phase === "status-applied" || phase === "status-offer-made" || phase === "status-accepted") && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {/* Table Header */}
                    <div 
                      className="flex items-center px-3 py-2 rounded-t-lg border border-b-0 border-border/50"
                      style={{ background: "oklch(0.96 0.01 50 / 0.5)" }}
                    >
                      <span className="text-[8px] font-semibold text-muted-foreground w-[45%]">POSITION</span>
                      <span className="text-[8px] font-semibold text-muted-foreground w-[30%]">COMPANY</span>
                      <span className="text-[8px] font-semibold text-muted-foreground w-[25%]">STATUS</span>
                    </div>

                    {/* Table Row - Active application */}
                    <div 
                      className="flex items-center px-3 py-3 border border-border/50 transition-all duration-700"
                      style={{ 
                        background: getStatusBgColor(),
                        borderColor: getStatusColor() + "40"
                      }}
                    >
                      <div className="w-[45%]">
                        <span className="text-[9px] font-medium text-foreground block">Frontend Dev</span>
                        <span className="text-[7px] text-muted-foreground">Applied 2 days ago</span>
                      </div>
                      <div className="w-[30%]">
                        <span className="text-[9px] text-foreground">TechCorp</span>
                      </div>
                      <div className="w-[25%]">
                        <span 
                          className="text-[8px] font-semibold px-2 py-0.5 rounded-full transition-all duration-500"
                          style={{ 
                            background: getStatusBgColor(),
                            color: getStatusColor(),
                            border: `1px solid ${getStatusColor()}50`
                          }}
                        >
                          {getStatusText()}
                        </span>
                      </div>
                    </div>

                    {/* Other rows (static) */}
                    <div className="flex items-center px-3 py-2.5 border border-t-0 border-border/50 bg-card/50">
                      <div className="w-[45%]">
                        <span className="text-[9px] text-muted-foreground">UX Designer</span>
                      </div>
                      <div className="w-[30%]">
                        <span className="text-[9px] text-muted-foreground">DesignLab</span>
                      </div>
                      <div className="w-[25%]">
                        <span className="text-[8px] text-muted-foreground/70 px-2 py-0.5 rounded-full bg-muted/50">
                          Interview
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center px-3 py-2.5 rounded-b-lg border border-t-0 border-border/50 bg-card/30">
                      <div className="w-[45%]">
                        <span className="text-[9px] text-muted-foreground">Product Mgr</span>
                      </div>
                      <div className="w-[30%]">
                        <span className="text-[9px] text-muted-foreground">StartupXYZ</span>
                      </div>
                      <div className="w-[25%]">
                        <span className="text-[8px] text-muted-foreground/70 px-2 py-0.5 rounded-full bg-muted/50">
                          Applied
                        </span>
                      </div>
                    </div>

                    {/* Status progression indicator */}
                    <div className="flex items-center justify-center gap-2 mt-4">
                      <div 
                        className={`w-2 h-2 rounded-full transition-all duration-500 ${
                          phase === "status-applied" ? "scale-125" : ""
                        }`}
                        style={{ background: phase === "status-applied" ? "oklch(0.65 0.15 250)" : "oklch(0.65 0.15 250 / 0.3)" }}
                      />
                      <ArrowRight className="w-3 h-3 text-muted-foreground/40" />
                      <div 
                        className={`w-2 h-2 rounded-full transition-all duration-500 ${
                          phase === "status-offer-made" ? "scale-125" : ""
                        }`}
                        style={{ background: phase === "status-offer-made" || phase === "status-accepted" ? "oklch(0.70 0.15 80)" : "oklch(0.70 0.15 80 / 0.3)" }}
                      />
                      <ArrowRight className="w-3 h-3 text-muted-foreground/40" />
                      <div 
                        className={`w-2 h-2 rounded-full transition-all duration-500 ${
                          phase === "status-accepted" ? "scale-125" : ""
                        }`}
                        style={{ background: phase === "status-accepted" ? "oklch(0.65 0.18 145)" : "oklch(0.65 0.18 145 / 0.3)" }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom hint text */}
            <p className="text-[9px] text-muted-foreground text-center mt-2 min-h-[24px]">
              {phase === "idle" || phase === "showing-inputs" ? "Combining your experience with job requirements" :
               phase === "merging" ? "Analyzing and matching..." :
               phase === "generating" ? "Writing personalized content..." :
               phase === "complete" ? "Grounded in your real experience" :
               phase === "saving-to-tracker" ? "Auto-saving your application..." :
               phase === "status-applied" ? "Application submitted and tracked" :
               phase === "status-offer-made" ? "Great news - offer received!" :
               "Congratulations on your new role!"}
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  )
}
