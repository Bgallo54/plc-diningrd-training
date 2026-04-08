import { Card, CardContent } from "@/components/ui/card";
import { Users, Heart, Shield, Utensils, ClipboardList, Tablet, Bell, BarChart3, ChevronRight } from "lucide-react";
import plcLogo from "@assets/plc-logo.jpg";

const steps = [
  {
    icon: ClipboardList,
    title: "1. Build the Resident Profile in MealCard",
    color: "hsl(262, 50%, 45%)",
    description: "Every resident's journey begins in MealCard. When a new resident arrives or preferences change, update their profile with:",
    items: [
      "Dietary restrictions and medical diets (diabetic, renal, gluten-free, etc.)",
      "Texture modifications (pureed, mechanical soft, regular)",
      "Food allergies and intolerances — these flow through to TableSide for safety alerts",
      "Preferred dining room and usual seating",
      "Favorite menu selections and usual meal choices",
      "Personal substitution items — items they prefer instead of the daily menu",
    ],
    impact: "A complete MealCard profile is the foundation of personalized dining. It ensures every interaction — from the kitchen to the dining room — reflects who the resident is and what they need."
  },
  {
    icon: Utensils,
    title: "2. Design Menus That Offer Choice in PlateFul",
    color: "hsl(142, 50%, 35%)",
    description: "PlateFul is where your menu strategy comes to life. Use it to create menus that balance nutrition, variety, and resident preferences:",
    items: [
      "Build multi-week rotation cycles to prevent menu fatigue",
      "Add substitution options so residents always have alternatives",
      "Set the Default Menu Flag (Sunday start) to keep reporting accurate",
      "Customize reports with community branding and dietary breakdowns",
      "Review recipes, cost analysis, and nutritional values to optimize your offerings",
    ],
    impact: "When menus are thoughtfully designed with built-in choices and substitutions, residents feel empowered — they choose what they want rather than accepting what's available."
  },
  {
    icon: Tablet,
    title: "3. Deliver the Experience at TableSide",
    color: "hsl(25, 70%, 45%)",
    description: "TableSide is where technology meets hospitality. This is the moment residents feel the difference:",
    items: [
      "Meal cards auto-populate with resident preferences — staff don't have to memorize every detail",
      "Allergy alerts appear at the point of ordering, preventing dangerous food from reaching the table",
      "Residents see their options and choose in real time, just like a restaurant",
      "Special notes capture day-to-day preferences ('no breading today', 'extra sugar packets')",
      "Held orders let tables be served together — enhancing the social dining experience",
      "Advanced ordering accommodates residents who prefer to plan ahead",
      "Declined meals are tracked for nutrition monitoring and follow-up care",
    ],
    impact: "TableSide transforms dining from 'receiving food' to 'choosing your meal.' That dignity of choice is fundamental to quality of life in senior living."
  },
  {
    icon: Shield,
    title: "4. Protect Residents with Safety Systems",
    color: "hsl(0, 60%, 45%)",
    description: "DiningRD's safety features work behind the scenes to protect every resident:",
    items: [
      "Allergy management prevents orders that conflict with known allergies",
      "Diet-restricted menus only show items appropriate for each resident's medical diet",
      "Meal card highlighting gives kitchen staff instant visual identification of special diets",
      "Consistent print settings eliminate human error in meal preparation",
      "Reporting tracks declined meals so care teams can follow up on nutritional intake",
    ],
    impact: "Every safety feature in DiningRD exists because in senior dining, a mistake isn't just inconvenient — it can be dangerous. These tools are your safety net."
  },
  {
    icon: BarChart3,
    title: "5. Monitor, Learn, and Improve Through DiningHub",
    color: "hsl(210, 60%, 40%)",
    description: "DiningHub connects your team to the resources and data needed for continuous improvement:",
    items: [
      "Review consultant reports for dietary compliance and clinical recommendations",
      "Access the latest diet manual and nutritional guidelines",
      "Use the in-service library for ongoing team education",
      "Track community visit schedules and follow up on action items",
      "Stay current with best practices in senior living dining",
    ],
    impact: "A dining program that learns and adapts is one that consistently delights. DiningHub gives your team the feedback loop to keep improving."
  },
];

export default function ResidentGuide() {
  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-primary/10 text-primary">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold" data-testid="text-resident-guide-title">Customizing Dining to Resident Needs</h1>
          <p className="text-sm text-muted-foreground mt-1">
            How DiningRD's platform guides and supports your dining team to personalize the experience for every resident.
          </p>
        </div>
      </div>

      {/* Philosophy Card */}
      <Card className="border-l-4 border-l-primary overflow-hidden">
        <CardContent className="p-5 flex gap-4 items-start">
          <img src={plcLogo} alt="PLC" className="w-12 h-12 rounded-xl object-cover shrink-0" />
          <div>
            <h2 className="font-semibold text-sm mb-2">The Priority Life Care Approach</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              At Priority Life Care, we believe every resident deserves a dining experience that feels personal, 
              safe, and dignified. DiningRD gives our teams the tools to move from standardized meal service to truly 
              person-centered dining — where each resident's preferences, dietary needs, and daily choices are honored at every meal.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-2">
              Below is how each platform module works together to make this possible.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Steps */}
      <div className="space-y-4">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-0">
                {/* Step header */}
                <div className="p-5 pb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg shrink-0" style={{ backgroundColor: `${step.color}15`, color: step.color }}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-semibold text-sm">{step.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{step.description}</p>
                  <ul className="space-y-2 ml-1">
                    {step.items.map((item, j) => (
                      <li key={j} className="flex gap-2 text-sm">
                        <ChevronRight className="w-3.5 h-3.5 mt-1 text-muted-foreground/40 shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Impact footer */}
                <div className="bg-primary/5 px-5 py-3 flex gap-2 items-start border-t border-primary/10">
                  <Heart className="w-3.5 h-3.5 mt-0.5 text-primary shrink-0" />
                  <p className="text-xs text-muted-foreground italic">{step.impact}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary */}
      <Card className="bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="p-5 text-center">
          <Bell className="w-6 h-6 mx-auto text-primary mb-3" />
          <h3 className="font-semibold text-sm mb-2">The Platform Is Only as Good as the Team Behind It</h3>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
            DiningRD provides the tools — but it's your dining team that brings them to life. Complete the training modules, 
            practice the workflows, and make every meal an opportunity to show residents they are seen, heard, and valued.
          </p>
          <p className="text-xs text-muted-foreground mt-3 italic">
            For questions or support, reach out to your DiningRD Client Success Specialist or the PLC Corporate Dining team.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
