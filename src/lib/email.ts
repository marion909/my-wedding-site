import nodemailer from 'nodemailer'

// Email-Konfiguration für Entwicklung (Console/Ethereal)
const createTransporter = () => {
  if (process.env.NODE_ENV === 'production') {
    // Production: Verwende echten SMTP (Gmail, SendGrid, etc.)
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true für 465, false für andere ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  } else {
    // Development: Verwende Ethereal Email (Test-SMTP)
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: 'ethereal.user@ethereal.email',
        pass: 'ethereal.pass',
      },
    })
  }
}

export interface RSVPEmailData {
  guestName: string
  guestEmail: string
  brideName: string
  groomName: string
  weddingDate: string
  attending: boolean
  guestCount: number
  message?: string
  weddingSlug: string
}

export interface WeddingOwnerNotificationData {
  ownerEmail: string
  brideName: string
  groomName: string
  guestName: string
  attending: boolean
  guestCount: number
  message?: string
  weddingSlug: string
}

// RSVP-Bestätigung an den Gast
export async function sendRSVPConfirmation(data: RSVPEmailData) {
  const transporter = createTransporter()

  const attendingText = data.attending ? 'Teilnahme zugesagt ✅' : 'Teilnahme abgesagt ❌'
  const attendingClass = data.attending ? 'yes' : 'no'

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #ddd; }
        .status { padding: 15px; margin: 20px 0; border-radius: 8px; text-align: center; font-weight: bold; }
        .status.yes { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .status.no { background: #f8d7da; color: #721c24; border: 1px solid #f1b5b8; }
        .details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 RSVP Bestätigung</h1>
          <h2>${data.brideName} & ${data.groomName}</h2>
        </div>
        
        <div class="content">
          <p>Liebe/r ${data.guestName},</p>
          
          <p>vielen Dank für deine RSVP-Antwort! Wir haben deine Teilnahme-Information erhalten:</p>
          
          <div class="status ${attendingClass}">
            ${attendingText}
          </div>
          
          <div class="details">
            <h3>📋 Deine RSVP-Details:</h3>
            <ul>
              <li><strong>Name:</strong> ${data.guestName}</li>
              <li><strong>Status:</strong> ${attendingText}</li>
              <li><strong>Anzahl Personen:</strong> ${data.guestCount}</li>
              ${data.message ? `<li><strong>Nachricht:</strong> "${data.message}"</li>` : ''}
            </ul>
          </div>
          
          <div class="details">
            <h3>💒 Hochzeitsdetails:</h3>
            <ul>
              <li><strong>Paar:</strong> ${data.brideName} & ${data.groomName}</li>
              <li><strong>Datum:</strong> ${data.weddingDate}</li>
            </ul>
          </div>
          
          <p>Falls du deine Antwort ändern möchtest, kannst du jederzeit auf unsere Hochzeitsseite zurückkehren:</p>
          <p style="text-align: center;">
            <a href="${process.env.NEXTAUTH_URL}/${data.weddingSlug}" style="background: #667eea; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Hochzeitsseite besuchen
            </a>
          </p>
          
          <div class="footer">
            <p>Wir freuen uns auf einen wunderschönen Tag mit euch! 💕</p>
            <p><em>${data.brideName} & ${data.groomName}</em></p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
            <p style="font-size: 12px;">Diese E-Mail wurde automatisch generiert von My-Wedding-Site.com</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `

  const mailOptions = {
    from: `"${data.brideName} & ${data.groomName}" <noreply@my-wedding-site.com>`,
    to: data.guestEmail,
    subject: `RSVP Bestätigung - Hochzeit ${data.brideName} & ${data.groomName}`,
    html: htmlContent,
    text: `
Liebe/r ${data.guestName},

vielen Dank für deine RSVP-Antwort zu unserer Hochzeit!

Status: ${attendingText}
Anzahl Personen: ${data.guestCount}
${data.message ? `Nachricht: "${data.message}"` : ''}

Hochzeit: ${data.brideName} & ${data.groomName}
Datum: ${data.weddingDate}

Du kannst deine Antwort jederzeit auf unserer Hochzeitsseite ändern:
${process.env.NEXTAUTH_URL}/${data.weddingSlug}

Wir freuen uns auf euch!
${data.brideName} & ${data.groomName}
    `
  }

  try {
    const result = await transporter.sendMail(mailOptions)
    console.log('RSVP confirmation email sent:', result.messageId)
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(result))
    }
    
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('Error sending RSVP confirmation email:', error)
    return { success: false, error: String(error) }
  }
}

// Benachrichtigung an das Hochzeitspaar
export async function sendOwnerNotification(data: WeddingOwnerNotificationData) {
  const transporter = createTransporter()

  const attendingText = data.attending ? 'hat zugesagt ✅' : 'hat abgesagt ❌'
  const attendingEmoji = data.attending ? '✅' : '❌'
  const attendingClass = data.attending ? 'yes' : 'no'

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #ddd; }
        .notification { padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; }
        .notification.yes { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .notification.no { background: #f8d7da; color: #721c24; border: 1px solid #f1b5b8; }
        .details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔔 Neue RSVP-Antwort</h1>
          <h2>Eure Hochzeit</h2>
        </div>
        
        <div class="content">
          <p>Liebe ${data.brideName} und lieber ${data.groomName},</p>
          
          <p>ihr habt eine neue RSVP-Antwort für eure Hochzeit erhalten!</p>
          
          <div class="notification ${attendingClass}">
            <h3>${attendingEmoji} ${data.guestName} ${attendingText}</h3>
          </div>
          
          <div class="details">
            <h3>📋 RSVP-Details:</h3>
            <ul>
              <li><strong>Name:</strong> ${data.guestName}</li>
              <li><strong>Status:</strong> ${attendingText}</li>
              <li><strong>Anzahl Personen:</strong> ${data.guestCount}</li>
              ${data.message ? `<li><strong>Nachricht:</strong> "${data.message}"</li>` : ''}
            </ul>
          </div>
          
          <p style="text-align: center;">
            <a href="${process.env.NEXTAUTH_URL}/dashboard/rsvp" style="background: #667eea; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Alle RSVPs im Dashboard ansehen
            </a>
          </p>
          
          <div class="footer">
            <p>Viel Spaß bei der Hochzeitsplanung! 💕</p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
            <p style="font-size: 12px;">Diese E-Mail wurde automatisch generiert von My-Wedding-Site.com</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `

  const mailOptions = {
    from: '"My-Wedding-Site.com" <notifications@my-wedding-site.com>',
    to: data.ownerEmail,
    subject: `🔔 Neue RSVP: ${data.guestName} ${attendingText}`,
    html: htmlContent,
    text: `
Neue RSVP-Antwort für eure Hochzeit!

${data.guestName} ${attendingText}
Anzahl Personen: ${data.guestCount}
${data.message ? `Nachricht: "${data.message}"` : ''}

Alle RSVPs anzeigen: ${process.env.NEXTAUTH_URL}/dashboard/rsvp

My-Wedding-Site.com
    `
  }

  try {
    const result = await transporter.sendMail(mailOptions)
    console.log('Owner notification email sent:', result.messageId)
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(result))
    }
    
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('Error sending owner notification email:', error)
    return { success: false, error: String(error) }
  }
}
