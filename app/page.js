"use client";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import React, { useRef, useState, useEffect } from "react";
import { TypeAnimation } from 'react-type-animation';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

export const BackgroundBeamsWithCollision = ({
  children,
  className
}) => {
  const containerRef = useRef(null);
  const parentRef = useRef(null);

  const beams = [
    {
      initialX: 10,
      translateX: 10,
      duration: 7,
      repeatDelay: 3,
      delay: 2,
    },
    {
      initialX: 600,
      translateX: 600,
      duration: 3,
      repeatDelay: 3,
      delay: 4,
    },
    {
      initialX: 100,
      translateX: 100,
      duration: 7,
      repeatDelay: 7,
      className: "h-6",
    },
    {
      initialX: 400,
      translateX: 400,
      duration: 5,
      repeatDelay: 14,
      delay: 4,
    },
    {
      initialX: 800,
      translateX: 800,
      duration: 11,
      repeatDelay: 2,
      className: "h-20",
    },
    {
      initialX: 1000,
      translateX: 1000,
      duration: 4,
      repeatDelay: 2,
      className: "h-12",
    },
    {
      initialX: 1200,
      translateX: 1200,
      duration: 6,
      repeatDelay: 4,
      delay: 2,
      className: "h-6",
    },
  ];

  return (
    (<div
      ref={parentRef}
      className={cn(
        "min-h-screen bg-gradient-to-b from-black via-blue-950 to-black relative flex items-center w-full justify-center overflow-hidden",
        className
      )}>
      {beams.map((beam) => (
        <CollisionMechanism
          key={beam.initialX + "beam-idx"}
          beamOptions={beam}
          containerRef={containerRef}
          parentRef={parentRef} />
      ))}
      {children}
      <div
        ref={containerRef}
        className="absolute bottom-0 bg-blue-950 w-full inset-x-0 pointer-events-none"
        style={{
          boxShadow:
            "0 0 24px rgba(0, 0, 0, 0.2), 0 1px 1px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.1), 0 0 4px rgba(0, 0, 0, 0.2), 0 16px 68px rgba(0, 0, 0, 0.15), 0 1px 0 rgba(255, 255, 255, 0.05) inset",
        }}></div>
    </div>)
  );
};

const CollisionMechanism = React.forwardRef(({ parentRef, containerRef, beamOptions = {} }, ref) => {
  const beamRef = useRef(null);
  const [collision, setCollision] = useState({
    detected: false,
    coordinates: null,
  });
  const [beamKey, setBeamKey] = useState(0);
  const [cycleCollisionDetected, setCycleCollisionDetected] = useState(false);

  useEffect(() => {
    const checkCollision = () => {
      if (
        beamRef.current &&
        containerRef.current &&
        parentRef.current &&
        !cycleCollisionDetected
      ) {
        const beamRect = beamRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        const parentRect = parentRef.current.getBoundingClientRect();

        if (beamRect.bottom >= containerRect.top) {
          const relativeX =
            beamRect.left - parentRect.left + beamRect.width / 2;
          const relativeY = beamRect.bottom - parentRect.top;

          setCollision({
            detected: true,
            coordinates: {
              x: relativeX,
              y: relativeY,
            },
          });
          setCycleCollisionDetected(true);
        }
      }
    };

    const animationInterval = setInterval(checkCollision, 50);

    return () => clearInterval(animationInterval);
  }, [cycleCollisionDetected, containerRef]);

  useEffect(() => {
    if (collision.detected && collision.coordinates) {
      setTimeout(() => {
        setCollision({ detected: false, coordinates: null });
        setCycleCollisionDetected(false);
      }, 2000);

      setTimeout(() => {
        setBeamKey((prevKey) => prevKey + 1);
      }, 2000);
    }
  }, [collision]);

  return (<>
    <motion.div
      key={beamKey}
      ref={beamRef}
      animate="animate"
      initial={{
        translateY: beamOptions.initialY || "-200px",
        translateX: beamOptions.initialX || "0px",
        rotate: beamOptions.rotate || 0,
      }}
      variants={{
        animate: {
          translateY: beamOptions.translateY || "1800px",
          translateX: beamOptions.translateX || "0px",
          rotate: beamOptions.rotate || 0,
        },
      }}
      transition={{
        duration: beamOptions.duration || 8,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
        delay: beamOptions.delay || 0,
        repeatDelay: beamOptions.repeatDelay || 0,
      }}
      className={cn(
        "absolute left-0 top-20 m-auto h-14 w-px rounded-full bg-gradient-to-t from-blue-500 via-blue-300 to-transparent",
        beamOptions.className
      )} />
    <AnimatePresence>
      {collision.detected && collision.coordinates && (
        <Explosion
          key={`${collision.coordinates.x}-${collision.coordinates.y}`}
          className=""
          style={{
            left: `${collision.coordinates.x}px`,
            top: `${collision.coordinates.y}px`,
            transform: "translate(-50%, -50%)",
          }} />
      )}
    </AnimatePresence>
  </>);
});

CollisionMechanism.displayName = "CollisionMechanism";

const Explosion = ({
  ...props
}) => {
  const spans = Array.from({ length: 20 }, (_, index) => ({
    id: index,
    initialX: 0,
    initialY: 0,
    directionX: Math.floor(Math.random() * 80 - 40),
    directionY: Math.floor(Math.random() * -50 - 10),
  }));

  return (
    (<div {...props} className={cn("absolute z-50 h-2 w-2", props.className)}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute -inset-x-10 top-0 m-auto h-2 w-10 rounded-full bg-gradient-to-r from-transparent via-blue-400 to-transparent blur-sm"></motion.div>
      {spans.map((span) => (
        <motion.span
          key={span.id}
          initial={{ x: span.initialX, y: span.initialY, opacity: 1 }}
          animate={{
            x: span.directionX,
            y: span.directionY,
            opacity: 0,
          }}
          transition={{ duration: Math.random() * 1.5 + 0.5, ease: "easeOut" }}
          className="absolute h-1 w-1 rounded-full bg-gradient-to-b from-blue-400 to-blue-600" />
      ))}
    </div>)
  );
};

const FeatureCard = ({ title, description, icon }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)" }}
    className="bg-blue-900 bg-opacity-30 p-4 sm:p-6 rounded-lg shadow-lg transition-all duration-300 ease-in-out"
  >
    <div className="text-blue-400 text-2xl sm:text-3xl mb-2 sm:mb-4">{icon}</div>
    <h3 className="text-lg sm:text-xl font-semibold text-blue-200 mb-1 sm:mb-2">{title}</h3>
    <p className="text-sm sm:text-base text-blue-100">{description}</p>
  </motion.div>
);

const Page = () => {
  const router = useRouter();

  return (
    <BackgroundBeamsWithCollision>
      <div className="absolute top-4 right-4 z-20">
        <Button onClick={() => router.push('/dashboard')}>
          Dashboard
        </Button>
      </div>
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500"
        >
          AvocadoAI
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="text-xl sm:text-2xl mb-6 sm:mb-8 text-blue-200"
        >
          <TypeAnimation
            sequence={[
              'Revolutionizing video generation',
              2000,
              'Unleash your creativity',
              2000,
              'AI-powered video creation',
              2000,
            ]}
            wrapper="span"
            speed={50}
            style={{ display: 'inline-block' }}
            repeat={Infinity}
          />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto mb-8 sm:mb-12"
        >
          Experience the future of video creation with AvocadoAI. Our cutting-edge AI technology transforms your ideas into stunning visual content effortlessly.
        </motion.p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
          <FeatureCard
            icon="🎙️"
            title="Google TTS"
            description="High-quality text-to-speech for natural-sounding voiceovers"
          />
          <FeatureCard
            icon="🧠"
            title="AssemblyAI"
            description="Advanced speech recognition and audio intelligence"
          />
          <FeatureCard
            icon="🎬"
            title="Replicate & Modal"
            description="Powerful AI models for video generation and editing"
          />
          <FeatureCard
            icon="🎨"
            title="Remotion"
            description="Programmatic video creation for stunning visuals"
          />
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="mt-8 sm:mt-12"
        >
          <Button
            onClick={() => router.push('/dashboard/create-new')}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-full text-base sm:text-lg"
          >
            Start Creating Now
          </Button>
        </motion.div>
      </div>
    </BackgroundBeamsWithCollision>
  );
};

export default Page;