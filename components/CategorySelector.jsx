"use client"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function CategorySelector({ categories }) {
  const scrollContainerRef = useRef(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)

  useEffect(() => {
    const checkScroll = () => {
      const container = scrollContainerRef.current
      if (container) {
        setShowLeftArrow(container.scrollLeft > 0)
        setShowRightArrow(container.scrollLeft < container.scrollWidth - container.clientWidth)
      }
    }

    checkScroll()
    window.addEventListener("resize", checkScroll)
    return () => window.removeEventListener("resize", checkScroll)
  }, [])

  const scroll = (direction) => {
    const container = scrollContainerRef.current
    if (container) {
      const scrollAmount = direction === "left" ? -200 : 200
      container.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  const handleScroll = () => {
    const container = scrollContainerRef.current
    if (container) {
      setShowLeftArrow(container.scrollLeft > 0)
      setShowRightArrow(container.scrollLeft < container.scrollWidth - container.clientWidth)
    }
  }

  return (
    <div className="relative bg-stone-200 shadow-sm">
      <div
        className="flex overflow-x-auto whitespace-nowrap py-2 px-4 scrollbar-hide"
        ref={scrollContainerRef}
        onScroll={handleScroll}
      >
        {categories?.map((category, index) => (
          <a
            key={index}
            href={`#${category}`}
            className="inline-block px-3 py-2 text-stone-800 font-semibold hover:bg-stone-300 rounded-md mr-2"
          >
            {category}
          </a>
        ))}
      </div>
      {showLeftArrow && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-stone-200 hover:bg-stone-300"
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}
      {showRightArrow && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-stone-200 hover:bg-stone-300"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

