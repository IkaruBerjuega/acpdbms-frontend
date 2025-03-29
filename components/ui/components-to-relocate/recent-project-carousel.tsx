'use client';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Project } from '../components-to-relocate/AdminTools';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface ProjectCarouselProps {
  projects: Project[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export function ProjectCarousel({
  projects,
  autoPlay = true,
  autoPlayInterval = 10000,
}: ProjectCarouselProps) {
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);
  const [hoverLeft, setHoverLeft] = useState(false);
  const [hoverRight, setHoverRight] = useState(false);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on('select', onSelect);

    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api || !autoPlay) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [api, autoPlay, autoPlayInterval]);

  const handlePrevious = () => {
    api?.scrollPrev();
  };

  const handleNext = () => {
    api?.scrollNext();
  };

  if (!projects.length) {
    return (
      <div className='w-full h-full flex items-center justify-center text-white-secondary text-xl'>
        No recent projects yet.
      </div>
    );
  }

  return (
    <div className='relative mt-4 w-full h-full'>
      <Carousel
        setApi={setApi}
        className='w-full h-full'
        opts={{
          align: 'start',
          loop: true,
        }}
      >
        <CarouselContent className='h-full'>
          {projects.map((project, index) => (
            <CarouselItem key={index} className='h-full'>
              <div className='h-full w-full relative'>
                {/* Project image - full page */}
                <div className='absolute inset-0'>
                  <img
                    src={
                      project.image_url ||
                      `/placeholder.svg?height=600&width=800`
                    }
                    alt={project.project_title || `Project ${index + 1}`}
                    className='w-full h-full object-cover'
                  />
                </div>

                {/* Project title with semi-white background */}
                <div className='bg-white-secondary/70 absolute bottom-0'>
                  <div className='px-8 py-6 inline-block'>
                    <h3 className='text-black text-xl md:text-2xl font-bold'>
                      {project.project_title || `Project ${index + 1}`}
                    </h3>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Hidden default navigation controls */}
        <div className='hidden'>
          <CarouselPrevious />
          <CarouselNext />
        </div>

        {/* Indicators */}
        <div className='absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2 z-30'>
          {projects.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={cn(
                'w-2.5 h-2.5 rounded-full transition-all',
                current === index
                  ? 'bg-primary w-8'
                  : 'bg-primary/50 hover:bg-primary/100'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </Carousel>

      {/* Full height left navigation area */}
      <div
        className='absolute left-0 top-0 bottom-0 w-24 z-20 cursor-pointer flex items-center justify-start pl-6'
        onClick={handlePrevious}
        onMouseEnter={() => setHoverLeft(true)}
        onMouseLeave={() => setHoverLeft(false)}
      >
        <div
          className={cn(
            'absolute inset-0 transition-opacity duration-300',
            hoverLeft ? 'opacity-20' : 'opacity-0'
          )}
          style={{
            background: 'linear-gradient(to right, white, transparent)',
          }}
        />
        <ChevronLeft
          className={cn(
            'h-10 w-10 text-primary transition-all duration-300',
            hoverLeft ? 'scale-125' : 'scale-100'
          )}
        />
      </div>

      {/* Full height right navigation area */}
      <div
        className='absolute right-0 top-0 bottom-0 w-24 z-20 cursor-pointer flex items-center justify-end pr-6'
        onClick={handleNext}
        onMouseEnter={() => setHoverRight(true)}
        onMouseLeave={() => setHoverRight(false)}
      >
        <div
          className={cn(
            'absolute inset-0 transition-opacity duration-300',
            hoverRight ? 'opacity-20' : 'opacity-0'
          )}
          style={{
            background: 'linear-gradient(to left, white, transparent)',
          }}
        />
        <ChevronRight
          className={cn(
            'h-10 w-10 text-primary transition-all duration-300',
            hoverRight ? 'scale-125' : 'scale-100'
          )}
        />
      </div>
    </div>
  );
}
