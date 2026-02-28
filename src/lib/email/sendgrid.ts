// SendGrid Email Service Integration
// Supports: Welcome emails, newsletters, transactional emails

const SENDGRID_API_URL = 'https://api.sendgrid.com/v3/mail/send'

interface EmailPayload {
  to: string | string[]
  from: string
  subject: string
  html?: string
  text?: string
  templateId?: string
  dynamicTemplateData?: Record<string, unknown>
}

/**
 * Send email via SendGrid API
 */
export async function sendEmail(payload: EmailPayload): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.SENDGRID_API_KEY
  
  if (!apiKey) {
    console.error('SendGrid API key not configured')
    return { success: false, error: 'Email service not configured' }
  }

  try {
    const response = await fetch(SENDGRID_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: Array.isArray(payload.to) 
            ? payload.to.map(email => ({ email }))
            : [{ email: payload.to }],
          dynamic_template_data: payload.dynamicTemplateData,
        }],
        from: { email: payload.from },
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
        template_id: payload.templateId,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`SendGrid error: ${error}`)
    }

    return { success: true }
  } catch (error) {
    console.error('SendGrid send error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email' 
    }
  }
}

/**
 * Send welcome email to new newsletter subscribers
 */
export async function sendWelcomeEmail(to: string, name?: string): Promise<void> {
  const result = await sendEmail({
    to,
    from: process.env.FROM_EMAIL || 'hello@producthub.com',
    subject: 'Welcome to Product Discovery Hub! 🚀',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #ea580c;">Welcome ${name || 'there'}!</h1>
        <p>Thanks for subscribing to the Product Discovery Hub newsletter.</p>
        <p>You'll receive our weekly digest every Tuesday with:</p>
        <ul>
          <li>🔥 The hottest new products</li>
          <li>🚀 Featured launches</li>
          <li>💡 Maker stories</li>
          <li>🎯 Exclusive deals</li>
        </ul>
        <p>Stay tuned for your first issue!</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />
        <p style="color: #6b7280; font-size: 12px;">
          You're receiving this because you subscribed to our newsletter.<br>
          <a href="${process.env.NEXTAUTH_URL}/api/newsletter?email=${encodeURIComponent(to)}" style="color: #6b7280;">Unsubscribe</a>
        </p>
      </div>
    `,
  })

  if (!result.success) {
    console.error('Failed to send welcome email:', result.error)
  }
}

/**
 * Send weekly newsletter to subscribers
 */
export async function sendNewsletter(params: {
  to: string[]
  subject: string
  products: Array<{
    name: string
    tagline: string
    url: string
    votes: number
  }>
  sponsor?: {
    name: string
    tagline: string
    url: string
  }
}): Promise<void> {
  const { to, subject, products, sponsor } = params

  const productsHtml = products.map((p, i) => `
    <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px;">
      <div style="display: flex; align-items: center; gap: 10px;">
        <span style="font-size: 24px; font-weight: bold; color: #ea580c;">#${i + 1}</span>
        <div>
          <h3 style="margin: 0; color: #111827;">${p.name}</h3>
          <p style="margin: 5px 0; color: #6b7280;">${p.tagline}</p>
          <a href="${p.url}" style="color: #ea580c; text-decoration: none;">View Product →</a>
        </div>
      </div>
    </div>
  `).join('')

  const sponsorHtml = sponsor ? `
    <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
      <p style="margin: 0 0 10px; font-size: 12px; color: #92400e; text-transform: uppercase; letter-spacing: 1px;">Sponsor Spotlight</p>
      <h3 style="margin: 0 0 5px; color: #92400e;">${sponsor.name}</h3>
      <p style="margin: 0 0 10px; color: #78350f;">${sponsor.tagline}</p>
      <a href="${sponsor.url}" style="color: #92400e; font-weight: bold; text-decoration: none;">Learn More →</a>
    </div>
  ` : ''

  const result = await sendEmail({
    to,
    from: process.env.FROM_EMAIL || 'newsletter@producthub.com',
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #ea580c; margin: 0;">🚀 Top Products This Week</h1>
          <p style="color: #6b7280; margin: 10px 0;">Discover the best new products across North America</p>
        </div>

        ${sponsorHtml}

        <div style="margin-bottom: 30px;">
          ${productsHtml}
        </div>

        <div style="text-align: center; margin: 40px 0;">
          <a href="${process.env.NEXTAUTH_URL}/products" 
             style="background: #ea580c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View All Products
          </a>
        </div>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />
        
        <div style="text-align: center; color: #6b7280; font-size: 12px;">
          <p>You're receiving this because you subscribed to Product Discovery Hub.</p>
          <p>
            <a href="${process.env.NEXTAUTH_URL}" style="color: #6b7280;">Visit Website</a> | 
            <a href="${process.env.NEXTAUTH_URL}/api/newsletter" style="color: #6b7280;">Unsubscribe</a>
          </p>
        </div>
      </div>
    `,
  })

  if (!result.success) {
    console.error('Failed to send newsletter:', result.error)
    throw new Error(result.error)
  }
}

/**
 * Send sponsor confirmation email
 */
export async function sendSponsorConfirmation(params: {
  to: string
  productName: string
  tier: string
  amount: number
  startDate: Date
  endDate: Date
}): Promise<void> {
  const { to, productName, tier, amount, startDate, endDate } = params

  const result = await sendEmail({
    to,
    from: process.env.FROM_EMAIL || 'sponsors@producthub.com',
    subject: `Sponsorship Confirmed: ${productName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #ea580c;">Sponsorship Confirmed! 🎉</h1>
        <p>Thank you for sponsoring <strong>${productName}</strong> on Product Discovery Hub.</p>
        
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 15px; color: #374151;">Order Details</h3>
          <p style="margin: 5px 0;"><strong>Product:</strong> ${productName}</p>
          <p style="margin: 5px 0;"><strong>Tier:</strong> ${tier}</p>
          <p style="margin: 5px 0;"><strong>Amount:</strong> $${amount}</p>
          <p style="margin: 5px 0;"><strong>Start Date:</strong> ${startDate.toLocaleDateString()}</p>
          <p style="margin: 5px 0;"><strong>End Date:</strong> ${endDate.toLocaleDateString()}</p>
        </div>

        <p>Your product will be featured according to the schedule above. You'll receive an email when your sponsorship goes live.</p>
        
        <p>Questions? Reply to this email or contact us at sponsors@producthub.com</p>
      </div>
    `,
  })

  if (!result.success) {
    console.error('Failed to send sponsor confirmation:', result.error)
  }
}

/**
 * Test email configuration
 */
export async function testEmailConfiguration(): Promise<{ success: boolean; message: string }> {
  if (!process.env.SENDGRID_API_KEY) {
    return { success: false, message: 'SENDGRID_API_KEY not configured' }
  }

  try {
    const result = await sendEmail({
      to: process.env.ADMIN_EMAIL || 'test@example.com',
      from: process.env.FROM_EMAIL || 'test@example.com',
      subject: 'Test Email from Product Discovery Hub',
      text: 'This is a test email to verify SendGrid configuration.',
    })

    if (result.success) {
      return { success: true, message: 'Test email sent successfully' }
    } else {
      return { success: false, message: result.error || 'Unknown error' }
    }
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Test failed' }
  }
}
