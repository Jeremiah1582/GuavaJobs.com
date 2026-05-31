"use client"

interface GuavaProps {
  className?: string
  style?: React.CSSProperties
  size?: "sm" | "md" | "lg"
  variant?: "full" | "half" | "leaf"
}

function GuavaShape({ size = "md", variant = "full", style, className }: GuavaProps) {
  const sizeMap = {
    sm: { width: 24, height: 28 },
    md: { width: 40, height: 48 },
    lg: { width: 64, height: 76 },
  }
  const { width, height } = sizeMap[size]

  if (variant === "leaf") {
    return (
      <svg
        width={width * 0.6}
        height={height * 0.5}
        viewBox="0 0 24 20"
        fill="none"
        className={className}
        style={style}
      >
        <path
          d="M12 2C6 2 2 8 2 14C2 14 6 12 12 12C18 12 22 14 22 14C22 8 18 2 12 2Z"
          fill="color-mix(in oklch, var(--guava-green) 35%, transparent)"
        />
        <path
          d="M12 4C12 4 12 8 12 12"
          stroke="color-mix(in oklch, var(--guava-green) 40%, transparent)"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  if (variant === "half") {
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 40 48"
        fill="none"
        className={className}
        style={style}
      >
        <ellipse
          cx="20"
          cy="26"
          rx="18"
          ry="20"
          fill="color-mix(in oklch, var(--guava-pink) 32%, transparent)"
        />
        <ellipse
          cx="20"
          cy="26"
          rx="12"
          ry="14"
          fill="color-mix(in oklch, var(--guava-pink) 28%, transparent)"
        />
        <circle cx="16" cy="24" r="1.5" fill="color-mix(in oklch, var(--guava-green) 35%, transparent)" />
        <circle cx="24" cy="24" r="1.5" fill="color-mix(in oklch, var(--guava-green) 35%, transparent)" />
        <circle cx="20" cy="28" r="1.5" fill="color-mix(in oklch, var(--guava-green) 35%, transparent)" />
        <circle cx="17" cy="30" r="1" fill="color-mix(in oklch, var(--guava-green) 30%, transparent)" />
        <circle cx="23" cy="30" r="1" fill="color-mix(in oklch, var(--guava-green) 30%, transparent)" />
      </svg>
    )
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 40 48"
      fill="none"
      className={className}
      style={style}
    >
      <path
        d="M20 2C20 2 20 6 20 8"
        stroke="color-mix(in oklch, var(--guava-green) 40%, transparent)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M20 4C20 4 26 3 28 6C28 6 24 8 20 6"
        fill="color-mix(in oklch, var(--guava-green) 35%, transparent)"
      />
      <ellipse
        cx="20"
        cy="28"
        rx="17"
        ry="18"
        fill="color-mix(in oklch, var(--guava-pink) 30%, transparent)"
      />
      <ellipse
        cx="20"
        cy="30"
        rx="10"
        ry="11"
        fill="color-mix(in oklch, var(--guava-pink) 25%, transparent)"
      />
      <ellipse
        cx="14"
        cy="24"
        rx="4"
        ry="5"
        fill="color-mix(in oklch, var(--guava-pink-light) 40%, transparent)"
      />
    </svg>
  )
}

export default function FloatingGuavas() {
  const guavas = [
    { x: "5%", y: "8%", size: "lg" as const, variant: "full" as const, bounceX: 30, bounceY: 25, duration: 18 },
    { x: "92%", y: "12%", size: "md" as const, variant: "half" as const, bounceX: -25, bounceY: 20, duration: 22 },
    { x: "15%", y: "25%", size: "sm" as const, variant: "leaf" as const, bounceX: 20, bounceY: -15, duration: 16 },
    { x: "88%", y: "35%", size: "lg" as const, variant: "full" as const, bounceX: -35, bounceY: 28, duration: 24 },
    { x: "3%", y: "45%", size: "md" as const, variant: "half" as const, bounceX: 28, bounceY: -22, duration: 20 },
    { x: "95%", y: "55%", size: "sm" as const, variant: "leaf" as const, bounceX: -22, bounceY: 18, duration: 17 },
    { x: "8%", y: "65%", size: "sm" as const, variant: "full" as const, bounceX: 18, bounceY: 24, duration: 21 },
    { x: "90%", y: "75%", size: "md" as const, variant: "leaf" as const, bounceX: -24, bounceY: -20, duration: 19 },
    { x: "4%", y: "85%", size: "lg" as const, variant: "half" as const, bounceX: 32, bounceY: 15, duration: 25 },
    { x: "93%", y: "92%", size: "sm" as const, variant: "full" as const, bounceX: -20, bounceY: 22, duration: 18 },
  ]

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {guavas.map((guava, index) => (
        <div
          key={index}
          className="absolute"
          style={{
            left: guava.x,
            top: guava.y,
            animation: `bounceAround${index} ${guava.duration}s ease-in-out infinite`,
          }}
        >
          <GuavaShape size={guava.size} variant={guava.variant} />
        </div>
      ))}

      <style jsx>{`
        @keyframes bounceAround0 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.65; }
          25% { transform: translate(${guavas[0].bounceX}px, ${guavas[0].bounceY}px) rotate(8deg); opacity: 0.85; }
          50% { transform: translate(${guavas[0].bounceX * 0.5}px, ${guavas[0].bounceY * -0.8}px) rotate(-5deg); opacity: 0.75; }
          75% { transform: translate(${guavas[0].bounceX * -0.3}px, ${guavas[0].bounceY * 0.6}px) rotate(3deg); opacity: 0.7; }
        }
        @keyframes bounceAround1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.65; }
          25% { transform: translate(${guavas[1].bounceX}px, ${guavas[1].bounceY}px) rotate(-6deg); opacity: 0.85; }
          50% { transform: translate(${guavas[1].bounceX * -0.6}px, ${guavas[1].bounceY * 0.7}px) rotate(4deg); opacity: 0.75; }
          75% { transform: translate(${guavas[1].bounceX * 0.4}px, ${guavas[1].bounceY * -0.5}px) rotate(-3deg); opacity: 0.7; }
        }
        @keyframes bounceAround2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.6; }
          25% { transform: translate(${guavas[2].bounceX}px, ${guavas[2].bounceY}px) rotate(10deg); opacity: 0.8; }
          50% { transform: translate(${guavas[2].bounceX * 0.8}px, ${guavas[2].bounceY * -0.9}px) rotate(-8deg); opacity: 0.7; }
          75% { transform: translate(${guavas[2].bounceX * -0.5}px, ${guavas[2].bounceY * 0.4}px) rotate(5deg); opacity: 0.65; }
        }
        @keyframes bounceAround3 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.65; }
          25% { transform: translate(${guavas[3].bounceX}px, ${guavas[3].bounceY}px) rotate(-7deg); opacity: 0.85; }
          50% { transform: translate(${guavas[3].bounceX * -0.7}px, ${guavas[3].bounceY * 0.6}px) rotate(6deg); opacity: 0.75; }
          75% { transform: translate(${guavas[3].bounceX * 0.5}px, ${guavas[3].bounceY * -0.4}px) rotate(-4deg); opacity: 0.7; }
        }
        @keyframes bounceAround4 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.65; }
          25% { transform: translate(${guavas[4].bounceX}px, ${guavas[4].bounceY}px) rotate(5deg); opacity: 0.85; }
          50% { transform: translate(${guavas[4].bounceX * 0.6}px, ${guavas[4].bounceY * -0.7}px) rotate(-6deg); opacity: 0.75; }
          75% { transform: translate(${guavas[4].bounceX * -0.4}px, ${guavas[4].bounceY * 0.5}px) rotate(4deg); opacity: 0.7; }
        }
        @keyframes bounceAround5 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.6; }
          25% { transform: translate(${guavas[5].bounceX}px, ${guavas[5].bounceY}px) rotate(-9deg); opacity: 0.8; }
          50% { transform: translate(${guavas[5].bounceX * -0.5}px, ${guavas[5].bounceY * 0.8}px) rotate(7deg); opacity: 0.7; }
          75% { transform: translate(${guavas[5].bounceX * 0.6}px, ${guavas[5].bounceY * -0.6}px) rotate(-5deg); opacity: 0.65; }
        }
        @keyframes bounceAround6 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.65; }
          25% { transform: translate(${guavas[6].bounceX}px, ${guavas[6].bounceY}px) rotate(6deg); opacity: 0.85; }
          50% { transform: translate(${guavas[6].bounceX * 0.7}px, ${guavas[6].bounceY * -0.5}px) rotate(-4deg); opacity: 0.75; }
          75% { transform: translate(${guavas[6].bounceX * -0.6}px, ${guavas[6].bounceY * 0.7}px) rotate(3deg); opacity: 0.7; }
        }
        @keyframes bounceAround7 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.6; }
          25% { transform: translate(${guavas[7].bounceX}px, ${guavas[7].bounceY}px) rotate(-8deg); opacity: 0.8; }
          50% { transform: translate(${guavas[7].bounceX * -0.8}px, ${guavas[7].bounceY * 0.6}px) rotate(5deg); opacity: 0.7; }
          75% { transform: translate(${guavas[7].bounceX * 0.4}px, ${guavas[7].bounceY * -0.7}px) rotate(-3deg); opacity: 0.65; }
        }
        @keyframes bounceAround8 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.65; }
          25% { transform: translate(${guavas[8].bounceX}px, ${guavas[8].bounceY}px) rotate(7deg); opacity: 0.85; }
          50% { transform: translate(${guavas[8].bounceX * 0.5}px, ${guavas[8].bounceY * -0.8}px) rotate(-6deg); opacity: 0.75; }
          75% { transform: translate(${guavas[8].bounceX * -0.6}px, ${guavas[8].bounceY * 0.5}px) rotate(4deg); opacity: 0.7; }
        }
        @keyframes bounceAround9 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.65; }
          25% { transform: translate(${guavas[9].bounceX}px, ${guavas[9].bounceY}px) rotate(-5deg); opacity: 0.85; }
          50% { transform: translate(${guavas[9].bounceX * -0.7}px, ${guavas[9].bounceY * 0.7}px) rotate(8deg); opacity: 0.75; }
          75% { transform: translate(${guavas[9].bounceX * 0.5}px, ${guavas[9].bounceY * -0.6}px) rotate(-4deg); opacity: 0.7; }
        }
      `}</style>
    </div>
  )
}
