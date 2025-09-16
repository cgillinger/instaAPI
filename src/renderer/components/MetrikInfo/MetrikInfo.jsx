import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  Info, 
  ChevronDown, 
  ChevronUp, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share, 
  Bookmark, 
  UserPlus,
  Calculator,
  BarChart3,
  TrendingUp,
  Image,
  Video,
  Layers
} from 'lucide-react';

const MetrikInfo = ({ compact = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('rawMetrics');

  // Råa metriker från Instagram API
  const rawMetrics = [
    {
      name: 'reach',
      displayName: 'Räckvidd',
      icon: <Eye className="w-4 h-4" />,
      description: 'Antal unika konton som såg inlägget',
      details: 'Tillförlitlig metrik på postnivå. Visar hur många olika personer som faktiskt såg ditt innehåll.',
      availability: 'Alla posttyper',
      color: 'text-blue-600'
    },
    {
      name: 'views',
      displayName: 'Visningar',
      icon: <Eye className="w-4 h-4" />,
      description: 'Antal videovisningar (minst 3 sekunder)',
      details: 'För video/Reels: antal gånger video spelats minst 3 sekunder (eller nästan hela längden om kortare än 3 sek).',
      availability: 'VIDEO och REELS',
      color: 'text-purple-600'
    },
    {
      name: 'likes',
      displayName: 'Gilla-markeringar',
      icon: <Heart className="w-4 h-4" />,
      description: 'Antal hjärtan på inlägget',
      details: 'Grundläggande engagemangsmetrik. Visar direkta positiva reaktioner från användare.',
      availability: 'Alla posttyper',
      color: 'text-red-500'
    },
    {
      name: 'comments',
      displayName: 'Kommentarer',
      icon: <MessageCircle className="w-4 h-4" />,
      description: 'Antal kommentarer på inlägget',
      details: 'Visar djupare engagemang. Användare som tar tid att kommentera är ofta mer engagerade.',
      availability: 'Alla posttyper',
      color: 'text-green-600'
    },
    {
      name: 'shares',
      displayName: 'Delningar',
      icon: <Share className="w-4 h-4" />,
      description: 'Antal delningar till Stories eller DM',
      details: 'Främst för Reels. Visar när användare delar innehåll till sina Stories eller skickar som direktmeddelande.',
      availability: 'Främst REELS (ofta 0 för FEED)',
      color: 'text-orange-500'
    },
    {
      name: 'saves',
      displayName: 'Sparade',
      icon: <Bookmark className="w-4 h-4" />,
      description: 'Antal gånger inlägget sparats',
      details: 'Visar att användare vill komma tillbaka till innehållet senare. Stark indikator på värdefullt innehåll.',
      availability: 'Alla posttyper',
      color: 'text-yellow-600'
    },
    {
      name: 'follows',
      displayName: 'Följare',
      icon: <UserPlus className="w-4 h-4" />,
      description: 'Nya följare från detta inlägg',
      details: 'Antal konton som började följa dig direkt från att ha sett detta specifika inlägg.',
      availability: 'FEED och STORY (EJ Reels)',
      color: 'text-indigo-600',
      warning: 'Finns inte för Reels-inlägg'
    }
  ];

  // Beräknade metriker som appen skapar
  const calculatedMetrics = [
    {
      name: 'engagement_total',
      displayName: 'Interaktioner',
      icon: <Calculator className="w-4 h-4" />,
      description: 'Grundläggande engagemang',
      formula: 'Likes + Kommentarer + Delningar',
      details: 'Summerar de tre huvudsakliga interaktionstyperna. Bra för jämförelse mellan olika inlägg.',
      color: 'text-blue-600'
    },
    {
      name: 'engagement_total_extended',
      displayName: 'Totalt engagemang',
      icon: <TrendingUp className="w-4 h-4" />,
      description: 'Omfattande engagemang',
      formula: 'Likes + Kommentarer + Delningar + Sparade + Följare',
      details: 'Inkluderar alla tillgängliga engagemangstyper. Ger en mer komplett bild av inläggets prestanda.',
      color: 'text-purple-600',
      note: 'Följare = 0 för Reels, vilket kan påverka jämförelser mellan posttyper'
    },
    {
      name: 'average_reach',
      displayName: 'Genomsnittlig räckvidd',
      icon: <BarChart3 className="w-4 h-4" />,
      description: 'Räckvidd per konto (endast Per konto-vy)',
      formula: 'Total räckvidd ÷ Antal inlägg',
      details: 'Visar genomsnittlig räckvidd per inlägg för varje konto. Hjälper identifiera vilka konton som når flest.',
      color: 'text-green-600'
    },
    {
      name: 'post_count',
      displayName: 'Antal publiceringar',
      icon: <Layers className="w-4 h-4" />,
      description: 'Totalt antal inlägg per konto',
      formula: 'Antal inlägg under vald period',
      details: 'Visar aktivitetsnivå. Kan användas för att analysera sambandet mellan antal inlägg och resultat.',
      color: 'text-gray-600'
    },
    {
      name: 'posts_per_day',
      displayName: 'Inlägg per dag',
      icon: <TrendingUp className="w-4 h-4" />,
      description: 'Publiceringshastighet',
      formula: 'Antal inlägg ÷ Antal dagar i period',
      details: 'Visar publiceringshastighet. Hjälper förstå optimal postingfrekvens för varje konto.',
      color: 'text-cyan-600'
    }
  ];

  // Posttyper och deras egenskaper
  const postTypes = [
    {
      type: 'IMAGE + FEED',
      icon: <Image className="w-4 h-4" />,
      description: 'Vanliga fotoinlägg i feed',
      metrics: 'Räckvidd, Likes, Kommentarer, Sparade, Följare',
      notes: 'Delningar oftast 0. Visningar finns ej.',
      color: 'text-blue-600'
    },
    {
      type: 'VIDEO + FEED',
      icon: <Video className="w-4 h-4" />,
      description: 'Videoinlägg i feed',
      metrics: 'Räckvidd, Likes, Kommentarer, Sparade, Följare, Visningar',
      notes: 'Inkluderar visningar för videoinnehåll.',
      color: 'text-purple-600'
    },
    {
      type: 'CAROUSEL',
      icon: <Layers className="w-4 h-4" />,
      description: 'Flera bilder/videos i samma post',
      metrics: 'Räckvidd, Likes, Kommentarer, Sparade, Följare, Visningar (för videos)',
      notes: 'Kombinerar egenskaper beroende på innehåll.',
      color: 'text-green-600'
    },
    {
      type: 'REELS',
      icon: <Video className="w-4 h-4" />,
      description: 'Kortformat video (Instagram Reels)',
      metrics: 'Räckvidd, Likes, Kommentarer, Sparade, Delningar, Visningar',
      notes: 'INGEN följare-metrik tillgänglig från Instagram API.',
      color: 'text-orange-500'
    }
  ];

  if (compact) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2"
      >
        <Info className="w-4 h-4" />
        Metrikförklaring
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </Button>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-600" />
            Metrikförklaring
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent>
          <div className="space-y-6">
            {/* Tabs för olika kategorier */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('rawMetrics')}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'rawMetrics'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Instagram-metriker
              </button>
              <button
                onClick={() => setActiveTab('calculated')}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'calculated'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Beräknade värden
              </button>
              <button
                onClick={() => setActiveTab('postTypes')}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'postTypes'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Posttyper
              </button>
            </div>

            {/* Instagram-metriker */}
            {activeTab === 'rawMetrics' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Dessa metriker kommer direkt från Instagram API och visar verklig användarinteraktion med dina inlägg.
                </p>
                
                <div className="grid gap-3">
                  {rawMetrics.map((metric) => (
                    <div key={metric.name} className="border rounded-lg p-3 hover:bg-gray-50">
                      <div className="flex items-start gap-3">
                        <div className={`${metric.color} mt-0.5`}>
                          {metric.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{metric.displayName}</h4>
                            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                              {metric.availability}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{metric.description}</p>
                          <p className="text-xs text-gray-500">{metric.details}</p>
                          {metric.warning && (
                            <Alert className="mt-2 bg-yellow-50 border-yellow-200">
                              <AlertDescription className="text-yellow-800 text-xs">
                                ⚠️ {metric.warning}
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Beräknade metriker */}
            {activeTab === 'calculated' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Dessa värden beräknas av appen för att ge djupare insikter och möjliggöra jämförelser.
                </p>
                
                <div className="grid gap-3">
                  {calculatedMetrics.map((metric) => (
                    <div key={metric.name} className="border rounded-lg p-3 hover:bg-gray-50">
                      <div className="flex items-start gap-3">
                        <div className={`${metric.color} mt-0.5`}>
                          {metric.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">{metric.displayName}</h4>
                          <p className="text-sm text-gray-600 mb-2">{metric.description}</p>
                          <div className="bg-gray-50 p-2 rounded text-xs font-mono mb-2">
                            {metric.formula}
                          </div>
                          <p className="text-xs text-gray-500">{metric.details}</p>
                          {metric.note && (
                            <Alert className="mt-2 bg-blue-50 border-blue-200">
                              <AlertDescription className="text-blue-800 text-xs">
                                💡 {metric.note}
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Posttyper */}
            {activeTab === 'postTypes' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Olika posttyper har tillgång till olika metriker baserat på Instagram API:s begränsningar.
                </p>
                
                <div className="grid gap-3">
                  {postTypes.map((type) => (
                    <div key={type.type} className="border rounded-lg p-3 hover:bg-gray-50">
                      <div className="flex items-start gap-3">
                        <div className={`${type.color} mt-0.5`}>
                          {type.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">{type.type}</h4>
                          <p className="text-sm text-gray-600 mb-2">{type.description}</p>
                          <div className="mb-2">
                            <span className="text-xs font-medium text-gray-700">Tillgängliga metriker: </span>
                            <span className="text-xs text-gray-600">{type.metrics}</span>
                          </div>
                          <p className="text-xs text-gray-500">{type.notes}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Alert className="bg-amber-50 border-amber-200">
                  <AlertDescription className="text-amber-800 text-sm">
                    <strong>Viktigt för analys:</strong> Eftersom Reels inte har "Följare"-metrik blir 
                    "Totalt engagemang" systematiskt lägre för Reels jämfört med Feed-inlägg. 
                    Använd "Interaktioner" för mer rättvis jämförelse mellan posttyper.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default MetrikInfo;