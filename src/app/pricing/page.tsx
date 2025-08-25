import Link from 'next/link'
import { Metadata } from 'next'
import UpgradeButton from '@/components/UpgradeButton'

export const metadata: Metadata = {
  title: 'Preise - My Wedding Site',
  description: 'Einfache und faire Preise für deine Hochzeitswebsite. Starte kostenlos oder wähle Premium für eine werbefreie Erfahrung.',
  keywords: 'Hochzeitswebsite Preise, kostenlose Hochzeitsseite, Premium Hochzeit Website',
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-purple-800">
          💕 My Wedding Site
        </Link>
        <div className="flex items-center gap-6">
          <Link 
            href="/" 
            className="text-purple-700 hover:text-purple-900 transition-colors"
          >
            Home
          </Link>
          <Link 
            href="/auth/login" 
            className="px-4 py-2 text-purple-700 hover:text-purple-900 transition-colors"
          >
            Anmelden
          </Link>
          <Link 
            href="/auth/register" 
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Registrieren
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6 text-center">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Einfache und <span className="text-purple-600">faire Preise</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Starte kostenlos mit deiner Hochzeitswebsite oder upgrade für eine werbefreie Premium-Erfahrung.
            Keine versteckten Kosten, keine Überraschungen.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Free Tier */}
            <div className="bg-white rounded-2xl shadow-xl p-10 border-2 border-gray-200 hover:border-green-300 transition-colors">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Kostenlos</h2>
                <div className="text-6xl font-bold text-green-600 mb-4">0€</div>
                <p className="text-xl text-gray-600">Für immer kostenlos</p>
                <p className="text-sm text-gray-500 mt-2">Perfekt zum Ausprobieren</p>
              </div>
              
              <ul className="space-y-5 mb-10">
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div>
                    <span className="text-gray-800 font-medium">Schöne Hochzeitswebsite</span>
                    <p className="text-sm text-gray-600">Mit deiner eigenen URL</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div>
                    <span className="text-gray-800 font-medium">4 professionelle Templates</span>
                    <p className="text-sm text-gray-600">Elegant, Rustikal, Modern, Vintage</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div>
                    <span className="text-gray-800 font-medium">RSVP-System</span>
                    <p className="text-sm text-gray-600">Mit automatischen E-Mail-Benachrichtigungen</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div>
                    <span className="text-gray-800 font-medium">Foto-Galerie</span>
                    <p className="text-sm text-gray-600">Bis zu 20 Fotos</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div>
                    <span className="text-gray-800 font-medium">Layout-Editor</span>
                    <p className="text-sm text-gray-600">Drag & Drop Sektionen</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div>
                    <span className="text-gray-800 font-medium">Mit kleinen Werbebannern</span>
                    <p className="text-sm text-gray-600">Diskret platziert</p>
                  </div>
                </li>
              </ul>
              
              <Link 
                href="/auth/register" 
                className="w-full bg-green-600 text-white py-4 px-6 rounded-xl hover:bg-green-700 transition-colors text-center block font-semibold text-lg"
              >
                Kostenlos starten
              </Link>
            </div>

            {/* Premium Tier */}
            <div className="bg-white rounded-2xl shadow-2xl p-10 border-2 border-purple-300 relative hover:border-purple-400 transition-colors">
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg">
                  ⭐ Beliebt
                </span>
              </div>
              
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Premium</h2>
                <div className="text-6xl font-bold text-purple-600 mb-4">5€</div>
                <p className="text-xl text-gray-600">pro Monat</p>
                <p className="text-sm text-gray-500 mt-2">Jederzeit kündbar</p>
              </div>
              
              <ul className="space-y-5 mb-10">
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div>
                    <span className="text-gray-800 font-medium">Alles aus dem kostenlosen Plan</span>
                    <p className="text-sm text-gray-600">Plus alle Premium-Features</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div>
                    <span className="text-gray-800 font-medium text-lg">🚫 Keine Werbung</span>
                    <p className="text-sm text-gray-600">100% werbefrei für deine Gäste</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div>
                    <span className="text-gray-800 font-medium">Unbegrenzte Fotos</span>
                    <p className="text-sm text-gray-600">So viele Bilder wie du möchtest</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div>
                    <span className="text-gray-800 font-medium">Priority Support</span>
                    <p className="text-sm text-gray-600">Bevorzugter E-Mail-Support</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div>
                    <span className="text-gray-800 font-medium">Erweiterte Anpassungen</span>
                    <p className="text-sm text-gray-600">Mehr Design-Optionen</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div>
                    <span className="text-gray-800 font-medium">Detaillierte Statistiken</span>
                    <p className="text-sm text-gray-600">Seitenaufrufe und RSVP-Analytics</p>
                  </div>
                </li>
              </ul>
              
              <UpgradeButton 
                planId="premium" 
                price={5} 
                currency="EUR"
                className="w-full py-4 text-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Häufig gestellte Fragen
          </h2>
          
          <div className="space-y-8">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Ist der kostenlose Plan wirklich kostenlos?
              </h3>
              <p className="text-gray-600">
                Ja! Der kostenlose Plan ist für immer kostenlos. Du kannst alle Grundfunktionen nutzen, 
                einschließlich RSVP-System und Foto-Galerie. Lediglich kleine Werbebanner werden diskret angezeigt.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Kann ich jederzeit zwischen den Plänen wechseln?
              </h3>
              <p className="text-gray-600">
                Absolut! Du kannst jederzeit zum Premium-Plan upgraden oder kündigen. 
                Bei einer Kündigung wechselst du automatisch zurück zum kostenlosen Plan.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Welche Zahlungsmethoden werden akzeptiert?
              </h3>
              <p className="text-gray-600">
                Wir akzeptieren alle gängigen Kreditkarten, PayPal und SEPA-Lastschrift. 
                Alle Zahlungen werden sicher über Stripe abgewickelt.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Was passiert mit meinen Daten bei einer Kündigung?
              </h3>
              <p className="text-gray-600">
                Deine Hochzeitswebsite bleibt online und funktionsfähig. Du wechselst lediglich 
                zurück zum kostenlosen Plan mit den entsprechenden Beschränkungen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">
            Bereit für deine Traumhochzeit?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Erstelle in wenigen Minuten deine eigene Hochzeitswebsite. 
            Starte kostenlos und upgrade jederzeit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/auth/register" 
              className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors text-lg"
            >
              Kostenlos starten
            </Link>
            <button className="bg-purple-800 text-white px-8 py-4 rounded-xl font-semibold hover:bg-purple-900 transition-colors text-lg">
              Premium wählen
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-xl font-bold mb-4">💕 My Wedding Site</div>
              <p className="text-gray-300 text-sm">
                Erstelle deine perfekte Hochzeitswebsite in wenigen Minuten.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2 text-sm">
                <Link href="/" className="block text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
                <Link href="/auth/register" className="block text-gray-300 hover:text-white transition-colors">
                  Registrieren
                </Link>
                <Link href="/auth/login" className="block text-gray-300 hover:text-white transition-colors">
                  Anmelden
                </Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Rechtliches</h4>
              <div className="space-y-2 text-sm">
                <Link href="/legal/privacy" className="block text-gray-300 hover:text-white transition-colors">
                  Datenschutzerklärung
                </Link>
                <Link href="/legal/imprint" className="block text-gray-300 hover:text-white transition-colors">
                  Impressum
                </Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 My Wedding Site. Made with 💕</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
