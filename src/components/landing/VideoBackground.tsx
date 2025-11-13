interface VideoBackgroundProps {
  className?: string
}

export function VideoBackground({ className = '' }: VideoBackgroundProps) {
  return (
    <div className={`video-background ${className}`}>
      {/* Universe background image */}
      <div 
        className="universe-background"
        style={{
          backgroundImage: 'url(/img/universe.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>
      
      {/* Overlay for better text readability */}
      <div className="video-overlay"></div>
    </div>
  )
}
