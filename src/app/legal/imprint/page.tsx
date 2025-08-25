import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Impressum - My Wedding Site',
  description: 'Impressum und Kontaktinformationen von My Wedding Site.',
  robots: { index: false, follow: false }
}

export default function Imprint() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <Link href="/" className="text-purple-600 hover:text-purple-800 mb-6 inline-block">
          ← Zurück zur Startseite
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Impressum</h1>
        
        <div className="prose max-w-none space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Angaben gemäß § 5 TMG</h2>
            <p>
              <strong>My Wedding Site</strong><br />
              [Ihr Name]<br />
              [Ihre Adresse]<br />
              [PLZ Ort]<br />
              Deutschland
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Kontakt</h2>
            <p>
              <strong>E-Mail:</strong> info@my-wedding-site.com<br />
              <strong>Telefon:</strong> [Ihre Telefonnummer]
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Haftungsausschluss</h2>
            
            <h3 className="text-lg font-medium text-gray-700 mb-2 mt-4">Haftung für Inhalte</h3>
            <p className="mb-4">
              Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten 
              nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als 
              Diensteanbieter jedoch nicht unter der Verpflichtung, übermittelte oder gespeicherte 
              fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine 
              rechtswidrige Tätigkeit hinweisen.
            </p>

            <h3 className="text-lg font-medium text-gray-700 mb-2 mt-4">Haftung für Links</h3>
            <p className="mb-4">
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir 
              keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine 
              Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige 
              Anbieter oder Betreiber der Seiten verantwortlich.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">EU-Streitschlichtung</h2>
            <p className="mb-4">
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
              <br />
              <a 
                href="https://ec.europa.eu/consumers/odr/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-800 underline"
              >
                https://ec.europa.eu/consumers/odr/
              </a>
            </p>
            <p>
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </div>

          <p className="text-sm text-gray-600 mt-8 pt-4 border-t">
            Stand: {new Date().toLocaleDateString('de-DE')}
          </p>
        </div>
      </div>
    </div>
  )
}
