"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Satellite, Brain, CheckCircle, Bell, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  details: string[];
  color: string;
}

interface CloudBurstHowItWorksProps {
  className?: string;
  autoPlayInterval?: number;
}

const FadeInOnScroll = ({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === "up" ? 50 : direction === "down" ? -50 : 0,
      x: direction === "left" ? 50 : direction === "right" ? -50 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.25, 0.25, 0.75],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const StaggeredContainer = ({
  children,
  className = "",
  staggerDelay = 0.1,
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.25, 0.25, 0.75] as const,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className={className}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

export function Working({
  className,
  autoPlayInterval = 4000,
}: CloudBurstHowItWorksProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps: Step[] = [
    {
      id: 1,
      title: "Sensors & Satellite Feed",
      description:
        "Data is continuously gathered from ground stations and satellites.",
      icon: <Satellite className="h-6 w-6" />,
      details: [
        "Real-time weather monitoring from multiple sources",
        "Satellite imagery analysis for cloud formation",
        "Ground sensor network integration",
        "Atmospheric pressure and humidity tracking",
      ],
      color: "blue",
    },
    {
      id: 2,
      title: "AI Risk Analysis",
      description:
        "Advanced machine learning algorithms analyze incoming weather data to detect critical cloudburst patterns.",
      icon: <Brain className="h-6 w-6" />,
      details: [
        "Pattern recognition in meteorological data",
        "Deep learning models for weather prediction",
        "Risk assessment algorithms",
        "Historical data correlation analysis",
      ],
      color: "purple",
    },
    {
      id: 3,
      title: "Prediction & Validation",
      description:
        "The system cross-validates predictions with multiple data sources to minimize false alarms.",
      icon: <CheckCircle className="h-6 w-6" />,
      details: [
        "Multi-source data verification",
        "Confidence scoring system",
        "False positive reduction algorithms",
        "Accuracy validation protocols",
      ],
      color: "green",
    },
    {
      id: 4,
      title: "Instant Alerts",
      description:
        "Automated notifications are sent to users and authorities within seconds of detection.",
      icon: <Bell className="h-6 w-6" />,
      details: [
        "Real-time notification system",
        "Multi-channel alert distribution",
        "Emergency response integration",
        "Location-based targeting",
      ],
      color: "orange",
    },
    {
      id: 5,
      title: "Continuous Improvement",
      description:
        "Feedback loops and recent event logs enhance system accuracy over time.",
      icon: <TrendingUp className="h-6 w-6" />,
      details: [
        "Machine learning model refinement",
        "Performance analytics tracking",
        "Feedback integration system",
        "Predictive accuracy optimization",
      ],
      color: "indigo",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      if (progress < 100) {
        setProgress((prev) => prev + 100 / (autoPlayInterval / 100));
      } else {
        setCurrentStep((prev) => (prev + 1) % steps.length);
        setProgress(0);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [progress, steps.length, autoPlayInterval]);

  const getColorClasses = (color: string, isActive: boolean): string => {
    const colorMap: Record<string, string> = {
      blue: isActive
        ? "bg-blue-500 border-blue-500 text-white"
        : "bg-blue-100 border-blue-200 text-blue-600",
      purple: isActive
        ? "bg-purple-500 border-purple-500 text-white"
        : "bg-purple-100 border-purple-200 text-purple-600",
      green: isActive
        ? "bg-green-500 border-green-500 text-white"
        : "bg-green-100 border-green-200 text-green-600",
      orange: isActive
        ? "bg-orange-500 border-orange-500 text-white"
        : "bg-orange-100 border-orange-200 text-orange-600",
      indigo: isActive
        ? "bg-indigo-500 border-indigo-500 text-white"
        : "bg-indigo-100 border-indigo-200 text-indigo-600",
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <section
      id="working"
      className={cn("py-20 relative overflow-hidden", className)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <FadeInOnScroll>
          <div className="text-center mb-16">
            <motion.h2
              className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              How Our{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                CloudBurst Detection
              </span>{" "}
              Works
            </motion.h2>
            <motion.p
              className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Our advanced AI-powered system combines real-time data analysis
              with machine learning to provide accurate cloudburst predictions
              and instant alerts.
            </motion.p>
          </div>
        </FadeInOnScroll>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Steps List */}
          <StaggeredContainer className="space-y-6" staggerDelay={0.15}>
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                className="flex items-start gap-6 cursor-pointer"
                onClick={() => setCurrentStep(index)}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: index === currentStep ? 1 : 0.6 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
              >
                <motion.div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500",
                    getColorClasses(step.color, index === currentStep)
                  )}
                  animate={
                    index === currentStep
                      ? {
                          scale: [1, 1.1, 1],
                        }
                      : {}
                  }
                  transition={{
                    duration: 2,
                    repeat: index === currentStep ? Infinity : 0,
                    ease: "easeInOut",
                  }}
                >
                  {index <= currentStep ? (
                    step.icon
                  ) : (
                    <span className="text-lg font-semibold">{index + 1}</span>
                  )}
                </motion.div>

                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-3">
                    {step.description}
                  </p>

                  {/* Progress Bar for Current Step */}
                  {index === currentStep && (
                    <motion.div
                      className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1 mb-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div
                        className={`h-1 rounded-full bg-gradient-to-r from-${step.color}-400 to-${step.color}-600`}
                        style={{ width: `${progress}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </motion.div>
                  )}

                  {/* Step Details */}
                  <AnimatePresence>
                    {index === currentStep && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <ul className="space-y-2">
                          {step.details.map((detail, detailIndex) => (
                            <motion.li
                              key={detailIndex}
                              className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: detailIndex * 0.1 }}
                            >
                              <div
                                className={`w-1.5 h-1.5 rounded-full bg-${step.color}-400`}
                              />
                              {detail}
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </StaggeredContainer>

          {/* Visual Representation */}
          <FadeInOnScroll delay={0.3} className="lg:sticky lg:top-8">
            <div className="relative">
              {/* Main Visualization Card */}
              <motion.div
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-200 dark:border-slate-700"
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {/* Animated Background */}
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-5"
                  style={{
                    background: `linear-gradient(45deg, transparent, rgba(59, 130, 246, 0.1), transparent)`,
                  }}
                  animate={{
                    background: [
                      "linear-gradient(45deg, transparent, rgba(59, 130, 246, 0.1), transparent)",
                      "linear-gradient(135deg, transparent, rgba(99, 102, 241, 0.1), transparent)",
                      "linear-gradient(225deg, transparent, rgba(139, 92, 246, 0.1), transparent)",
                      "linear-gradient(315deg, transparent, rgba(59, 130, 246, 0.1), transparent)",
                    ],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />

                <div className="relative z-10">
                  {/* Current Step Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <motion.div
                      className={cn(
                        "w-16 h-16 rounded-xl flex items-center justify-center",
                        `bg-${steps[currentStep].color}-100 text-${steps[currentStep].color}-600`
                      )}
                      key={currentStep}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.5, type: "spring" }}
                    >
                      {steps[currentStep].icon}
                    </motion.div>
                    <div>
                      <motion.h3
                        className="text-2xl font-bold text-slate-900 dark:text-slate-100"
                        key={`title-${currentStep}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        {steps[currentStep].title}
                      </motion.h3>
                      <motion.p
                        className="text-slate-600 dark:text-slate-400"
                        key={`desc-${currentStep}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                      >
                        Step {currentStep + 1} of {steps.length}
                      </motion.p>
                    </div>
                  </div>

                  {/* Process Flow Visualization */}
                  <div className="space-y-4">
                    <motion.div
                      className="h-32 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 rounded-xl p-4 flex items-center justify-center"
                      key={`visual-${currentStep}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <motion.div
                        className={`text-6xl opacity-20 text-${steps[currentStep].color}-400`}
                        animate={{
                          scale: [1, 1.1, 1],
                          opacity: [0.2, 0.4, 0.2],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        {steps[currentStep].icon}
                      </motion.div>
                    </motion.div>

                    {/* Step Indicators */}
                    <div className="flex justify-center space-x-2">
                      {steps.map((_, index) => (
                        <motion.button
                          key={index}
                          onClick={() => setCurrentStep(index)}
                          className={cn(
                            "w-3 h-3 rounded-full transition-all duration-300",
                            index === currentStep
                              ? `bg-${steps[currentStep].color}-500 scale-125`
                              : "bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500"
                          )}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                className="absolute -top-4 -right-4 w-8 h-8 bg-blue-400 rounded-full opacity-60"
                animate={{
                  y: [0, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute -bottom-4 -left-4 w-6 h-6 bg-indigo-400 rounded-full opacity-40"
                animate={{
                  y: [0, 10, 0],
                  scale: [1, 0.9, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              />
            </div>
          </FadeInOnScroll>
        </div>
      </div>
    </section>
  );
}
