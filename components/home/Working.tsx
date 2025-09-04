"use client";

import { cn } from "@/lib/utils";
import { Satellite, Brain, CheckCircle, Bell, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import * as React from "react";
import { createContext, useContext } from "react";
import { LoaderCircle } from "lucide-react";

// Stepper Types
type StepperContextValue = {
  activeStep: number;
  setActiveStep: (step: number) => void;
  orientation: "horizontal" | "vertical";
};

type StepItemContextValue = {
  step: number;
  state: StepState;
  isDisabled: boolean;
  isLoading: boolean;
};

type StepState = "active" | "completed" | "inactive" | "loading";

// Stepper Contexts
const StepperContext = createContext<StepperContextValue | undefined>(
  undefined
);
const StepItemContext = createContext<StepItemContextValue | undefined>(
  undefined
);

const useStepper = () => {
  const context = useContext(StepperContext);
  if (!context) {
    throw new Error("useStepper must be used within a Stepper");
  }
  return context;
};

const useStepItem = () => {
  const context = useContext(StepItemContext);
  if (!context) {
    throw new Error("useStepItem must be used within a StepperItem");
  }
  return context;
};

// Stepper Components
interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: number;
  value?: number;
  onValueChange?: (value: number) => void;
  orientation?: "horizontal" | "vertical";
}

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  (
    {
      defaultValue = 0,
      value,
      onValueChange,
      orientation = "horizontal",
      className,
      ...props
    },
    ref
  ) => {
    const [activeStep, setInternalStep] = React.useState(defaultValue);

    const setActiveStep = React.useCallback(
      (step: number) => {
        if (value === undefined) {
          setInternalStep(step);
        }
        onValueChange?.(step);
      },
      [value, onValueChange]
    );

    const currentStep = value ?? activeStep;

    return (
      <StepperContext.Provider
        value={{
          activeStep: currentStep,
          setActiveStep,
          orientation,
        }}
      >
        <div
          ref={ref}
          className={cn(
            "group/stepper inline-flex data-[orientation=horizontal]:w-full data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col",
            className
          )}
          data-orientation={orientation}
          {...props}
        />
      </StepperContext.Provider>
    );
  }
);
Stepper.displayName = "Stepper";

interface StepperItemProps extends React.HTMLAttributes<HTMLDivElement> {
  step: number;
  completed?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

const StepperItem = React.forwardRef<HTMLDivElement, StepperItemProps>(
  (
    {
      step,
      completed = false,
      disabled = false,
      loading = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { activeStep } = useStepper();

    const state: StepState =
      completed || step < activeStep
        ? "completed"
        : activeStep === step
        ? "active"
        : "inactive";

    const isLoading = loading && step === activeStep;

    return (
      <StepItemContext.Provider
        value={{ step, state, isDisabled: disabled, isLoading }}
      >
        <div
          ref={ref}
          className={cn(
            "group/step flex items-center group-data-[orientation=horizontal]/stepper:flex-row group-data-[orientation=vertical]/stepper:flex-col",
            className
          )}
          data-state={state}
          {...(isLoading ? { "data-loading": true } : {})}
          {...props}
        >
          {children}
        </div>
      </StepItemContext.Provider>
    );
  }
);
StepperItem.displayName = "StepperItem";

interface StepperTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const StepperTrigger = React.forwardRef<HTMLButtonElement, StepperTriggerProps>(
  ({ asChild = false, className, children, ...props }, ref) => {
    const { setActiveStep } = useStepper();
    const { step, isDisabled } = useStepItem();

    if (asChild) {
      return <div className={className}>{children}</div>;
    }

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center gap-3 disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        onClick={() => setActiveStep(step)}
        disabled={isDisabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);
StepperTrigger.displayName = "StepperTrigger";

interface StepperIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const StepperIndicator = React.forwardRef<
  HTMLDivElement,
  StepperIndicatorProps
>(({ asChild = false, className, children, ...props }, ref) => {
  const { state, step, isLoading } = useStepItem();

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground data-[state=active]:bg-primary data-[state=completed]:bg-primary data-[state=active]:text-primary-foreground data-[state=completed]:text-primary-foreground",
        className
      )}
      data-state={state}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          <span className="transition-all group-data-[loading=true]/step:scale-0 group-data-[state=completed]/step:scale-0 group-data-[loading=true]/step:opacity-0 group-data-[state=completed]/step:opacity-0 group-data-[loading=true]/step:transition-none">
            {step}
          </span>
          <CheckCircle
            className="absolute scale-0 opacity-0 transition-all group-data-[state=completed]/step:scale-100 group-data-[state=completed]/step:opacity-100 w-4 h-4"
            aria-hidden="true"
          />
          {isLoading && (
            <span className="absolute transition-all">
              <LoaderCircle
                className="animate-spin"
                size={14}
                strokeWidth={2}
                aria-hidden="true"
              />
            </span>
          )}
        </>
      )}
    </div>
  );
});
StepperIndicator.displayName = "StepperIndicator";

const StepperTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("text-sm font-medium", className)} {...props} />
));
StepperTitle.displayName = "StepperTitle";

const StepperDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
StepperDescription.displayName = "StepperDescription";

const StepperSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "m-0.5 bg-muted group-data-[orientation=horizontal]/stepper:h-0.5 group-data-[orientation=vertical]/stepper:h-12 group-data-[orientation=horizontal]/stepper:w-full group-data-[orientation=vertical]/stepper:w-0.5 group-data-[orientation=horizontal]/stepper:flex-1 group-data-[state=completed]/step:bg-primary",
        className
      )}
      {...props}
    />
  );
});
StepperSeparator.displayName = "StepperSeparator";

// Main Component
type CloudBurstHowItWorksProps = React.HTMLAttributes<HTMLElement>;

interface ProcessStepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  stepNumber: number;
  isActive?: boolean;
}

const ProcessStep: React.FC<ProcessStepProps> = ({
  icon,
  title,
  description,
  features,
  stepNumber,
  isActive = false,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: stepNumber * 0.1 }}
    viewport={{ once: true }}
    className={cn(
      "relative rounded-2xl border bg-card p-8 text-card-foreground transition-all duration-500 ease-in-out",
      "hover:scale-105 hover:shadow-xl hover:border-primary/50 hover:bg-muted/50",
      isActive &&
        "scale-105 shadow-xl border-primary bg-primary/5 ring-2 ring-primary/30"
    )}
  >
    {isActive && (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-primary"
      >
        <div className="absolute inset-0 h-4 w-4 rounded-full bg-primary animate-ping" />
      </motion.div>
    )}

    <div
      className={cn(
        "mb-6 flex h-16 w-16 items-center justify-center rounded-xl transition-colors duration-300",
        isActive
          ? "bg-primary text-primary-foreground"
          : "bg-primary/10 text-primary"
      )}
    >
      {icon}
    </div>

    <h3
      className={cn(
        "mb-4 text-2xl font-bold transition-colors duration-300",
        isActive && "text-primary"
      )}
    >
      {title}
    </h3>

    <p className="mb-6 text-lg text-muted-foreground leading-relaxed">
      {description}
    </p>

    <ul className="space-y-3">
      {features.map((feature, index) => (
        <motion.li
          key={index}
          className="flex items-start gap-3"
          initial={{ opacity: 0.7 }}
          animate={{ opacity: isActive ? 1 : 0.7 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <div
            className={cn(
              "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full mt-0.5 transition-colors duration-300",
              isActive ? "bg-primary/30" : "bg-primary/20"
            )}
          >
            <CheckCircle
              className={cn(
                "h-3 w-3 transition-colors duration-300",
                isActive ? "text-primary" : "text-primary"
              )}
            />
          </div>
          <span className="text-muted-foreground">{feature}</span>
        </motion.li>
      ))}
    </ul>
  </motion.div>
);

export const Working: React.FC<CloudBurstHowItWorksProps> = ({
  className,
  ...props
}) => {
  const [currentStep, setCurrentStep] = React.useState(1);

  const processSteps = [
    {
      icon: <Satellite className="h-8 w-8" />,
      title: "Sensors & Satellite Feed",
      description:
        "Data is continuously gathered from ground stations and satellites to monitor atmospheric conditions in real-time.",
      features: [
        "Real-time weather data collection",
        "Multi-source satellite integration",
        "Ground station network monitoring",
        "Atmospheric pressure tracking",
      ],
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI Risk Analysis",
      description:
        "Advanced machine learning algorithms analyze incoming weather data to detect critical cloudburst patterns.",
      features: [
        "Deep learning pattern recognition",
        "Historical data correlation",
        "Predictive modeling algorithms",
        "Risk assessment scoring",
      ],
    },
    {
      icon: <CheckCircle className="h-8 w-8" />,
      title: "Prediction & Validation",
      description:
        "The system cross-validates predictions with multiple data sources to minimize false alarms and ensure accuracy.",
      features: [
        "Multi-source data validation",
        "False alarm reduction",
        "Confidence level assessment",
        "Prediction accuracy optimization",
      ],
    },
    {
      icon: <Bell className="h-8 w-8" />,
      title: "Instant Alerts",
      description:
        "Automated notifications are sent to users and authorities within seconds of detection for immediate response.",
      features: [
        "Real-time alert system",
        "Multi-channel notifications",
        "Emergency response integration",
        "Location-based targeting",
      ],
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Continuous Improvement",
      description:
        "Feedback loops and recent event logs enhance system accuracy over time through machine learning optimization.",
      features: [
        "Adaptive learning algorithms",
        "Performance analytics",
        "System optimization",
        "Accuracy enhancement",
      ],
    },
  ];

  return (
    <section
      id="working"
      className={cn("w-full py-20 sm:py-32", className)}
      {...props}
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mx-auto mb-20 max-w-4xl text-center"
        >
          <h2 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl mb-6">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Our advanced cloudburst prediction system combines cutting-edge
            technology with real-time data analysis to provide accurate early
            warnings
          </p>
        </motion.div>

        <div className="mx-auto mb-16 max-w-6xl">
          <Stepper
            value={currentStep}
            onValueChange={setCurrentStep}
            className="mb-12"
          >
            {processSteps.map((step, index) => (
              <StepperItem
                key={index + 1}
                step={index + 1}
                className="[&:not(:last-child)]:flex-1"
              >
                <StepperTrigger
                  className="group flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-muted transition-colors duration-200"
                  onClick={() => setCurrentStep(index + 1)}
                >
                  <StepperIndicator className="h-12 w-12 text-base" />
                  <div className="text-center">
                    <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      Step {index + 1}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 max-w-24 line-clamp-2">
                      {step.title}
                    </div>
                  </div>
                </StepperTrigger>
                {index < processSteps.length - 1 && <StepperSeparator />}
              </StepperItem>
            ))}
          </Stepper>
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
          {processSteps.map((step, index) => (
            <ProcessStep
              key={index}
              icon={step.icon}
              title={step.title}
              description={step.description}
              features={step.features}
              stepNumber={index}
              isActive={currentStep === index + 1}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="mx-auto max-w-3xl rounded-2xl bg-primary/5 p-8 border border-primary/20">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Advanced Prediction Technology
            </h3>
            <p className="text-lg text-muted-foreground">
              Our system processes over 10,000 data points per second from
              multiple sources, achieving 95% accuracy in cloudburst prediction
              with lead times of up to 2 hours.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
