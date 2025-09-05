"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { motion } from "framer-motion";
import { ShieldAlert, Clock, Home, Phone, Check, X, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Page1() {
  return (
    <div className="p-5 space-y-4">
      <h2 className="font-bold text-2xl">Cloudburst Precautions</h2>
      <RiskHighlights />
      <AnimatedGroup preset="blur-slide" className="grid grid-cols-1 md:grid-cols-2 gap-4 [&>*]:will-change-transform">
        <AnimatedCard icon={<ShieldAlert className="h-5 w-5" />} title="Before">
          {renderList([
            "Subscribe to official weather alerts and local advisories.",
            "Identify safe high-ground routes and nearest shelters.",
            "Prepare go-bag: water, torch, power bank, meds, documents.",
            "Secure drainage around your home; clear debris and gutters.",
          ])}
        </AnimatedCard>
        <AnimatedCard icon={<Clock className="h-5 w-5" />} title="During">
          {renderList([
            "Avoid low-lying areas, underpasses, and culverts.",
            "Do not drive or walk through moving water; turn around.",
            "Stay away from electrical lines, flooded basements, manholes.",
            "Follow evacuation orders promptly; keep phones charged.",
          ])}
        </AnimatedCard>
        <AnimatedCard icon={<Home className="h-5 w-5" />} title="After">
          {renderList([
            "Return home only when authorities declare it safe.",
            "Avoid standing water; risk of contamination and shock.",
            "Document damages for relief/insurance; disinfect surfaces.",
            "Check neighbors, elderly, and those needing assistance.",
          ])}
        </AnimatedCard>
        <AnimatedCard icon={<Phone className="h-5 w-5" />} title="Emergency Contacts">
          {renderList([
            "Local Disaster Management: 1077",
            "Police: 100 | Fire: 101 | Ambulance: 108",
            "Nearest Shelter/Relief Center: See district portal",
            "Power/Utility Helpline: As per city utility numbers",
          ])}
        </AnimatedCard>
      </AnimatedGroup>
      <DoDonts />
      <EmergencyKit />
      <Faqs />
      <Resources />
    </div>
  );
}

function renderList(items: string[]) {
  return (
    <ul className="text-sm text-muted-foreground space-y-2">
      {items.map((text, idx) => (
        <motion.li
          key={idx}
          className="flex items-start gap-2"
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.35, delay: 0.04 * idx }}
        >
          <motion.span
            className="mt-1 h-2 w-2 rounded-full bg-blue-500/70 dark:bg-blue-400/70"
            initial={{ scale: 0.6, opacity: 0.6 }}
            animate={{ scale: [0.6, 1, 0.9], opacity: [0.6, 1, 0.9] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 0.03 * idx }}
          />
          <span>{text}</span>
        </motion.li>
      ))}
    </ul>
  );
}

function AnimatedCard({ title, children, icon }: { title: string; children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.995 }}>
      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center gap-2">
          {icon}
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
        {/* subtle animated gradient edge */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"
          initial={{ opacity: 0.3 }}
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </Card>
    </motion.div>
  );
}

function RiskHighlights() {
  const items = [
    { label: "Flash Flood Risk", value: "High", color: "bg-red-500/80" },
    { label: "Urban Waterlogging", value: "Moderate", color: "bg-amber-500/80" },
    { label: "Landslide (Hilly)", value: "Watch", color: "bg-blue-500/80" },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {items.map((it) => (
        <motion.div key={it.label} whileHover={{ y: -2 }} className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{it.label}</span>
            <span className={`text-xs px-2 py-0.5 rounded text-white ${it.color}`}>{it.value}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function DoDonts() {
  const doList = [
    "Move to higher ground quickly",
    "Unplug electricals if flooding is likely",
    "Keep emergency numbers handy",
  ];
  const dontList = [
    "Do not enter flooded basements",
    "Do not drive through waterlogged roads",
    "Do not touch wet electrical equipment",
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AnimatedCard title="Do" icon={<Check className="h-5 w-5 text-emerald-500" />}>
        <ul className="text-sm text-muted-foreground space-y-2">
          {doList.map((t, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500/70" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </AnimatedCard>
      <AnimatedCard title="Don’t" icon={<X className="h-5 w-5 text-red-500" />}>
        <ul className="text-sm text-muted-foreground space-y-2">
          {dontList.map((t, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-red-500/70" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </AnimatedCard>
    </div>
  );
}

function EmergencyKit() {
  const kit = [
    "Drinking water (2–3 days)",
    "Non-perishable food",
    "First aid + essential meds",
    "Power bank + torch + batteries",
    "Waterproof document pouch",
  ];
  return (
    <AnimatedCard title="Emergency Kit Checklist">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {kit.map((k, i) => (
          <motion.div key={i} whileHover={{ scale: 1.01 }} className="rounded-md border p-3 flex items-center gap-2">
            <Check className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-muted-foreground">{k}</span>
          </motion.div>
        ))}
      </div>
    </AnimatedCard>
  );
}

function Faqs() {
  const items = [
    {
      q: "What is a cloudburst?",
      a:
        "A cloudburst is a short-duration, very high-intensity rainfall event over a small area, often causing flash floods. It is typically driven by convective storms and orographic lift (in hilly areas). Impacts include rapid waterlogging, overflowing drains, and landslides. Even 50–100 mm in an hour can be disruptive in dense urban zones. Common signs include towering cumulonimbus clouds, thunder/lightning, and quickly darkening skies.",
      key: "item-1",
    },
    {
      q: "When are alerts issued?",
      a:
        "Alerts are issued when forecast intensity (mm/hr) and probability pass predefined thresholds for the next 6–12 hours. We consider recent radar trends, model ensembles, soil saturation, tide levels (for coastal cities), and vulnerability (e.g., low-lying areas). Levels: Advisory → Watch → Warning. Treat a Warning as an action signal: avoid travel, prepare to move to higher ground, and secure belongings.",
      key: "item-2",
    },
    {
      q: "Who to follow for official updates?",
      a:
        "Follow your state/district disaster management authority, the national meteorological department, and local civic bodies. Use official social handles and helpline numbers; avoid unverified forwards during emergencies. Enable notifications on trusted apps/portals. Keep a battery bank ready so you can receive alerts during power outages.",
      key: "item-3",
    },
    {
      q: "How does prediction work here?",
      a:
        "We combine nowcasting (radar/satellite), high-resolution numerical models, and recent rainfall/gauge trends. The system updates risk scores by zone, factoring topography, drainage hotspots, and convective indices, typically every 15–60 minutes. Limitations: small storms can intensify rapidly; forecasts have uncertainty. Always pair guidance with official advisories.",
      key: "item-4",
    },
    {
      q: "What if I am trapped in rising water?",
      a:
        "Move to higher floors immediately, avoid basements and live electricals, and call emergency services. Signal from windows/roof using a bright cloth or torch. If driving, abandon the vehicle if water rises above the hubcaps. Do not enter fast-flowing water; use a stick to gauge depth if you must wade. Keep your phone in a waterproof pouch.",
      key: "item-5",
    },
    {
      q: "Is tap water safe after flooding?",
      a:
        "Assume no. Use bottled/boiled water until authorities confirm safety. Disinfect surfaces with bleach solution and avoid contact with stagnant water due to contamination and electrocution hazards. Discard food that has come into contact with flood water. Wash hands frequently and wear rubber footwear when cleaning.",
      key: "item-6",
    },
    {
      q: "Why does probability change frequently?",
      a:
        "Convective systems evolve quickly with shifting wind shear and moisture. We update risk as new radar/model data arrives (15–60 min). Short-term changes do not necessarily mean long-term relief—keep monitoring. Look for consistent downgrades across multiple runs before relaxing precautions.",
      key: "item-7",
    },
  ];

  const first = items.slice(0, 4);
  const rest = items.slice(4);
  const [showMore, setShowMore] = useState(false);

  return (
    <AnimatedCard title="Quick FAQs">
      <Accordion type="single" collapsible className="w-full">
        {first.map((it) => (
          <AccordionItem key={it.key} value={it.key}>
            <AccordionTrigger>{it.q}</AccordionTrigger>
            <AccordionContent>{it.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <motion.div
        initial={false}
        animate={{ height: showMore ? "auto" : 0, opacity: showMore ? 1 : 0 }}
        className="overflow-hidden"
      >
        <Accordion type="single" collapsible className="w-full mt-2">
          {rest.map((it) => (
            <AccordionItem key={it.key} value={it.key}>
              <AccordionTrigger>{it.q}</AccordionTrigger>
              <AccordionContent>{it.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
      <div className="mt-3">
        <Button size="sm" variant="outline" onClick={() => setShowMore((v) => !v)}>
          {showMore ? "Show less" : "Show more"}
        </Button>
      </div>
    </AnimatedCard>
  );
}

function Resources() {
  const links = [
    { label: "District Disaster Management", href: "#", desc: "Local advisories, helplines, and evacuation info." },
    { label: "Shelter/Relief Center Map", href: "#", desc: "Nearest safe shelters and relief distribution points." },
    { label: "Safety Handbook (PDF)", href: "#", desc: "Step-by-step guidance for households and communities." },
    { label: "IMD Weather & Radar", href: "#", desc: "Official radar loops and warnings." },
    { label: "River Level & Flood Monitoring", href: "#", desc: "Upstream river gauges and flood status." },
    { label: "State Emergency Ops (SEOC)", href: "#", desc: "State-level incident updates and contacts." },
  ];
  return (
    <AnimatedCard title="Useful Resources">
      <ul className="text-sm text-muted-foreground space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            <a className="inline-flex items-start gap-2 hover:text-foreground transition-colors" href={l.href}>
              <LinkIcon className="h-4 w-4 mt-0.5" />
              <span>
                <span className="font-medium text-foreground/90">{l.label}</span>
                <span className="block text-xs text-muted-foreground">{l.desc}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </AnimatedCard>
  );
}
