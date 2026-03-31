import { useCallback, useLayoutEffect, useRef, useState } from 'preact/hooks'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { useDebugId } from '../../lib/useDebugId'
import { cn } from '../../lib/utils'
import { Button } from '../ui/Button'
import { Icon } from '../ui/Icon'

const MOBILE_MAX = '(max-width: 767px)'

export interface AboutDescriptionSpoilerProps {
  text: string
  readMoreLabel: string
  readLessLabel: string
  className?: string
}

export function AboutDescriptionSpoiler({
  text,
  readMoreLabel,
  readLessLabel,
  className = ''
}: AboutDescriptionSpoilerProps) {
  const isMobile = useMediaQuery(MOBILE_MAX)
  const [expanded, setExpanded] = useState(false)
  const [hasOverflow, setHasOverflow] = useState(false)
  const bodyRef = useRef<HTMLParagraphElement>(null)
  const regionId = useDebugId('about-description')

  useLayoutEffect(() => {
    if (!isMobile) {
      setExpanded(false)
      setHasOverflow(false)
    }
  }, [isMobile])

  const updateOverflow = useCallback(() => {
    const el = bodyRef.current
    if (!el || !isMobile) {
      setHasOverflow(false)
      return
    }
    if (expanded) {
      return
    }
    setHasOverflow(el.scrollHeight > el.clientHeight + 2)
  }, [isMobile, expanded])

  useLayoutEffect(() => {
    updateOverflow()
  }, [updateOverflow, text, isMobile, expanded])

  useLayoutEffect(() => {
    if (!isMobile || !bodyRef.current) {
      return
    }
    const el = bodyRef.current
    const ro = new ResizeObserver(() => updateOverflow())
    ro.observe(el)
    return () => ro.disconnect()
  }, [isMobile, updateOverflow, text])

  if (!isMobile) {
    return (
      <p
        id={regionId}
        className={cn('about-description', 'about-description--full', className)}
      >
        {text}
      </p>
    )
  }

  const showToggle = hasOverflow || expanded

  return (
    <div className="about-description-spoiler">
      <div
        className={cn(
          'about-description-spoiler-body',
          !expanded && hasOverflow && 'about-description-spoiler-body--faded'
        )}
      >
        <p
          ref={bodyRef}
          id={regionId}
          className={cn(
            'about-description',
            expanded ? 'about-description--full' : 'about-description--clamped',
            className
          )}
        >
          {text}
        </p>
      </div>
      {showToggle ? (
        <Button
          type="button"
          variant="outlineElevated"
          size="md"
          className="about-description-spoiler-toggle"
          aria-expanded={expanded}
          aria-controls={regionId}
          onClick={() => setExpanded((v) => !v)}
        >
          <span>{expanded ? readLessLabel : readMoreLabel}</span>
          <Icon name={expanded ? 'chevron-up' : 'chevron-down'} size={18} aria-hidden />
        </Button>
      ) : null}
    </div>
  )
}
