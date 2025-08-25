import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Datenschutzerklärung - My Wedding Site',
  description: 'Datenschutzerklärung und Informationen zum Umgang mit personenbezogenen Daten.',
  robots: { index: false, follow: false }
}

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <Link href="/" className="text-purple-600 hover:text-purple-800 mb-6 inline-block">
          ← Zurück zur Startseite
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Datenschutzerklärung</h1>
        
        <div className="prose max-w-none">
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">1. Datenschutz auf einen Blick</h2>
          <p className="mb-4">
            Diese Datenschutzerklärung klärt Sie über die Art, den Umfang und Zweck der Verarbeitung von 
            personenbezogenen Daten auf unserer Webseite auf.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">2. Welche Daten sammeln wir?</h2>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li><strong>Registrierungsdaten:</strong> E-Mail-Adresse, Passwort (verschlüsselt)</li>
            <li><strong>Hochzeitsdaten:</strong> Namen, Hochzeitsdatum, Ort, Geschichte</li>
            <li><strong>RSVP-Daten:</strong> Namen und E-Mail-Adressen der Gäste</li>
            <li><strong>Fotos:</strong> Von Ihnen hochgeladene Bilder</li>
            <li><strong>Technische Daten:</strong> IP-Adresse, Browser-Informationen (Logs)</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">3. Zweck der Datenverarbeitung</h2>
          <p className="mb-4">
            Wir verwenden Ihre Daten ausschließlich für:
          </p>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li>Bereitstellung Ihrer Hochzeitswebsite</li>
            <li>RSVP-Verwaltung und E-Mail-Benachrichtigungen</li>
            <li>Technische Funktionalität der Plattform</li>
            <li>Kundensupport</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">4. Datensicherheit</h2>
          <p className="mb-4">
            Ihre Daten werden verschlüsselt übertragen und gespeichert. Passwörter werden mit bcrypt gehashed.
            Der Zugriff ist nur für autorisierte Personen möglich.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">5. Ihre Rechte</h2>
          <p className="mb-4">
            Sie haben das Recht auf:
          </p>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li>Auskunft über Ihre gespeicherten Daten</li>
            <li>Berichtigung unrichtiger Daten</li>
            <li>Löschung Ihrer Daten</li>
            <li>Einschränkung der Verarbeitung</li>
            <li>Datenübertragbarkeit</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">6. Cookies</h2>
          <p className="mb-4">
            Wir verwenden nur technisch notwendige Cookies für die Session-Verwaltung.
            Keine Tracking- oder Marketing-Cookies.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">7. Kontakt</h2>
          <p className="mb-4">
            Bei Fragen zum Datenschutz kontaktieren Sie uns unter: <br />
            <strong>E-Mail:</strong> privacy@my-wedding-site.com
          </p>

          <p className="text-sm text-gray-600 mt-8">
            Stand: {new Date().toLocaleDateString('de-DE')}
          </p>
        </div>
      </div>
    </div>
  )
}
