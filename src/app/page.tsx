import Image from "next/image";
import Link from "next/link";
import { generateLandingSEO } from "@/lib/seo";
import { Metadata } from "next";

export const metadata: Metadata = generateLandingSEO()

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-purple-800">
          💕 My Wedding Site
        </div>
        <div className="flex items-center gap-6">
          <a 
            href="#templates" 
            className="text-purple-700 hover:text-purple-900 transition-colors hidden md:block"
          >
            Templates
          </a>
          <a 
            href="#pricing" 
            className="text-purple-700 hover:text-purple-900 transition-colors hidden md:block"
          >
            Preise
          </a>
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
      <main className="container mx-auto px-6 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            Eure perfekte
            <span className="text-purple-600 block">Hochzeitswebsite</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Erstellt in wenigen Minuten eine wunderschöne Website für eure Hochzeit. 
            Mit RSVP-System, Fotogalerie und allem was ihr braucht.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link 
              href="/auth/register" 
              className="px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold text-lg"
            >
              Kostenlos starten
            </Link>
            <Link 
              href="#templates" 
              className="px-8 py-4 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-semibold text-lg"
            >
              Beispiele ansehen
            </Link>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold mb-2">4 wunderschöne Templates</h3>
              <p className="text-gray-600">Klassisch, Rustikal, Modern oder Vintage - für jeden Geschmack das Richtige.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-2">RSVP-System</h3>
              <p className="text-gray-600">Gäste können direkt auf eurer Website zu- oder absagen. Ihr habt alles im Blick.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-4xl mb-4">📸</div>
              <h3 className="text-xl font-semibold mb-2">Fotogalerie</h3>
              <p className="text-gray-600">Teilt eure schönsten Momente mit Familie und Freunden.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Templates Preview Section */}
      <section id="templates" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Wählt euer perfektes Design
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Template Previews - später durch echte Screenshots ersetzt */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-100 p-6 rounded-xl">
              <h3 className="font-semibold text-lg mb-2">Klassisch Elegant</h3>
              <p className="text-sm text-gray-600">Zeitlos schön in Gold und Weiß</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-xl">
              <h3 className="font-semibold text-lg mb-2">Rustikal Romantisch</h3>
              <p className="text-sm text-gray-600">Natürlich und warm</p>
            </div>
            <div className="bg-gradient-to-br from-slate-50 to-gray-100 p-6 rounded-xl">
              <h3 className="font-semibold text-lg mb-2">Modern Minimalistisch</h3>
              <p className="text-sm text-gray-600">Klar und elegant</p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-rose-100 p-6 rounded-xl">
              <h3 className="font-semibold text-lg mb-2">Vintage Boho</h3>
              <p className="text-sm text-gray-600">Verspielt und romantisch</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Einfache und faire Preise
            </h2>
            <p className="text-xl text-gray-600">
              Starte kostenlos oder upgrade für werbefreie Erfahrung
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Kostenlos</h3>
                <div className="text-4xl font-bold text-green-600 mb-2">0€</div>
                <p className="text-gray-600">Für immer kostenlos</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <span className="text-gray-700">Schöne Hochzeitswebsite</span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <span className="text-gray-700">4 professionelle Templates</span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <span className="text-gray-700">RSVP-System</span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <span className="text-gray-700">Foto-Galerie</span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-3 h-3 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <span className="text-gray-700">Mit Werbung</span>
                </li>
              </ul>
              
              <Link 
                href="/auth/register" 
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors text-center block font-semibold"
              >
                Kostenlos starten
              </Link>
            </div>

            {/* Premium Tier */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-purple-200 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  ⭐ Beliebt
                </span>
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium</h3>
                <div className="text-4xl font-bold text-purple-600 mb-2">5€</div>
                <p className="text-gray-600">pro Monat</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <span className="text-gray-700">Alles aus dem kostenlosen Plan</span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <span className="text-gray-700"><strong>Keine Werbung</strong></span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <span className="text-gray-700">Unbegrenzte Fotos</span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <span className="text-gray-700">Premium Support</span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <span className="text-gray-700">Erweiterte Anpassungen</span>
                </li>
              </ul>
              
              <Link 
                href="/pricing" 
                className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors text-center block font-semibold"
              >
                Premium wählen
              </Link>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600">
              Fragen zu den Plänen? 
              <a href="mailto:support@my-wedding-site.com" className="text-purple-600 hover:text-purple-800 ml-1">
                Kontaktiere uns
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Brand */}
            <div>
              <div className="text-xl font-bold mb-4">💕 My Wedding Site</div>
              <p className="text-gray-300 text-sm">
                Erstelle deine perfekte Hochzeitswebsite in wenigen Minuten.
                Schön, einfach und kostenlos.
              </p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2 text-sm">
                <Link href="/auth/register" className="block text-gray-300 hover:text-white transition-colors">
                  Kostenlos registrieren
                </Link>
                <Link href="/auth/login" className="block text-gray-300 hover:text-white transition-colors">
                  Anmelden
                </Link>
                <Link href="#templates" className="block text-gray-300 hover:text-white transition-colors">
                  Templates ansehen
                </Link>
              </div>
            </div>
            
            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4">Rechtliches</h4>
              <div className="space-y-2 text-sm">
                <Link href="/legal/privacy" className="block text-gray-300 hover:text-white transition-colors">
                  Datenschutzerklärung
                </Link>
                <Link href="/legal/imprint" className="block text-gray-300 hover:text-white transition-colors">
                  Impressum
                </Link>
                <a 
                  href="mailto:support@my-wedding-site.com" 
                  className="block text-gray-300 hover:text-white transition-colors"
                >
                  Kontakt
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 My Wedding Site. Made with 💕 for amazing couples.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
