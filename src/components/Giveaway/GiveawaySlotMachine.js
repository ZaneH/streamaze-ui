import React, { useRef, useEffect, useCallback, useState } from 'react'
import PropTypes from 'prop-types'

const GiveawaySlotMachine = ({
  id,
  duration = 3000,
  easing = function easeOutQuad(
    elapsed,
    initialValue,
    amountOfChange,
    duration
  ) {
    return (
      -amountOfChange * (elapsed /= duration) * (elapsed - 2) + initialValue
    )
  },
  target = 0,
  times = 1,
  onEnd = () => {},
  children,
  style,
}) => {
  const targetRefs = useRef([])
  const frameRef = useRef()

  const [finalElement, setFinalElement] = useState(null)

  useEffect(() => {
    if (target === 0) return

    const $frame = frameRef.current

    $frame.scrollTop = 0

    const $target = targetRefs.current[target]

    if (!$target) return

    const fullScroll = finalElement?.offsetTop
    const targetOffset = $target.offsetTop

    const totalScroll = targetOffset + fullScroll * (times - 1)

    const startTime = Date.now()

    const tick = () => {
      const elapsed = Date.now() - startTime
      if (elapsed > duration) {
        onEnd()
        return
      }

      const amount = easing(elapsed, 0, totalScroll, duration)
      $frame.scrollTop = amount % fullScroll

      requestAnimationFrame(tick)
    }

    tick()
  }, [target, times, duration, easing, onEnd, finalElement])

  useEffect(() => {
    setFinalElement(targetRefs.current[targetRefs.current.length - 1])
  }, [targetRefs?.current?.length])

  return (
    <div
      id={id}
      style={{ overflow: 'hidden', position: 'relative', ...style }}
      ref={frameRef}
    >
      {children
        ?.map((child, index) =>
          React.cloneElement(child, {
            ref: (ref) => (targetRefs.current[index] = ref),
          })
        )
        ?.filter((child) => child)}
    </div>
  )
}

GiveawaySlotMachine.propTypes = {
  id: PropTypes.string,
  duration: PropTypes.number,
  easing: PropTypes.func,
  target: PropTypes.number.isRequired,
  times: PropTypes.number,
  onEnd: PropTypes.func,
  children: PropTypes.node.isRequired,
}

export default GiveawaySlotMachine
