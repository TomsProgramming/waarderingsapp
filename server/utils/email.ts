import nodemailer, { type Transporter } from 'nodemailer'
import { useRuntimeConfig } from '#imports'

let cached: Transporter | null = null

function getTransport(): Transporter {
  if (cached) return cached
  const cfg = useRuntimeConfig()
  cached = nodemailer.createTransport({
    host: cfg.smtpHost,
    port: Number(cfg.smtpPort),
    secure: String(cfg.smtpSecure) === 'true',
    auth: cfg.smtpUser ? { user: cfg.smtpUser, pass: cfg.smtpPass } : undefined
  })
  return cached
}

type Purpose = 'register' | 'login'

interface TemplateVars {
  name: string
  code: string
  purpose: Purpose
  baseUrl: string
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  } as Record<string, string>)[c]!)
}

function buildSubject(p: Purpose): string {
  return p === 'register'
    ? 'Bevestig je registratie bij Waarderingsapp'
    : 'Je inlogcode voor Waarderingsapp'
}

function buildText({ name, code, purpose }: TemplateVars): string {
  const actie = purpose === 'register' ? 'je registratie te bevestigen' : 'in te loggen'
  return [
    `Hallo ${name},`,
    '',
    `Gebruik onderstaande code om ${actie} bij Waarderingsapp:`,
    '',
    `    ${code}`,
    '',
    'Deze code is 10 minuten geldig. Typ hem in de app in het scherm dat op je openstaat.',
    'Heb jij niet geprobeerd in te loggen? Negeer dan deze e-mail.',
    '',
    '— Waarderingsapp · Het Bureau'
  ].join('\n')
}

function buildHtml({ name, code, purpose, baseUrl }: TemplateVars): string {
  const heading = purpose === 'register' ? 'Bevestig je registratie' : 'Bevestig je login'
  const intro = purpose === 'register'
    ? 'Welkom! Gebruik onderstaande code om je registratie af te ronden.'
    : 'We hebben een inlogpoging ontvangen. Gebruik onderstaande code om in te loggen.'
  const preheader = `Je verificatiecode is ${code}. Deze code is 10 minuten geldig.`
  const safeName = escapeHtml(name || 'daar')
  const safeBase = escapeHtml(baseUrl)

  return `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta http-equiv="x-ua-compatible" content="IE=edge">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>${escapeHtml(heading)}</title>
<style>
  @media (max-width: 600px) {
    .wa-card { width: 100% !important; border-radius: 0 !important; }
    .wa-pad { padding-left: 24px !important; padding-right: 24px !important; }
    .wa-code { font-size: 32px !important; letter-spacing: 6px !important; }
  }
  @media (prefers-color-scheme: dark) {
    .wa-bg { background-color: #1a1a1a !important; }
    .wa-card { background-color: #242424 !important; }
    .wa-text { color: #f2f2f2 !important; }
    .wa-muted { color: #bdbdbd !important; }
    .wa-code-box { background-color: #2f2f2f !important; border-color: #3a3a3a !important; }
  }
</style>
</head>
<body class="wa-bg" style="margin:0;padding:0;background-color:#f4f4f4;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;mso-line-height-rule:exactly;">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#f4f4f4;">${escapeHtml(preheader)}</div>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" class="wa-bg" style="background-color:#f4f4f4;">
    <tr>
      <td align="center" style="padding:32px 12px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="560" class="wa-card" style="width:560px;max-width:560px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 6px rgba(0,0,0,0.05);">
          <tr>
            <td style="height:6px;background-color:#FF9408;line-height:6px;font-size:6px;">&nbsp;</td>
          </tr>
          <tr>
            <td class="wa-pad" style="padding:32px 40px 8px 40px;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
              <div style="font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#FF9408;font-weight:600;">Waarderingsapp</div>
              <h1 class="wa-text" style="margin:8px 0 0 0;font-size:24px;line-height:1.3;color:#1a1a1a;font-weight:600;mso-line-height-rule:exactly;">${escapeHtml(heading)}</h1>
            </td>
          </tr>
          <tr>
            <td class="wa-pad wa-text" style="padding:16px 40px 0 40px;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:16px;line-height:1.55;color:#1a1a1a;mso-line-height-rule:exactly;">
              Hallo ${safeName},<br><br>
              ${escapeHtml(intro)}
            </td>
          </tr>
          <tr>
            <td class="wa-pad" align="center" style="padding:28px 40px 8px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td class="wa-code-box" align="center" style="background-color:#f4f4f4;border:1px solid #e4e4e4;border-radius:10px;padding:22px 32px;">
                    <div class="wa-code wa-text" style="font-family:'Courier New',Courier,monospace;font-size:38px;line-height:1;letter-spacing:10px;color:#1a1a1a;font-weight:700;mso-line-height-rule:exactly;">${escapeHtml(code)}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td class="wa-pad wa-muted" style="padding:12px 40px 24px 40px;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:14px;line-height:1.55;color:#666666;text-align:center;mso-line-height-rule:exactly;">
              Deze code is <strong>10 minuten</strong> geldig.
            </td>
          </tr>
          <tr>
            <td class="wa-pad" style="padding:0 40px 32px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-top:1px solid #eeeeee;">
                <tr>
                  <td class="wa-muted" style="padding-top:20px;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:13px;line-height:1.55;color:#888888;mso-line-height-rule:exactly;">
                    Heb jij deze code niet aangevraagd? Dan kun je deze e-mail negeren. Iemand kan per ongeluk jouw e-mailadres hebben ingetypt.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <div class="wa-muted" style="padding-top:16px;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12px;color:#999999;text-align:center;">
          Waarderingsapp &middot; Het Bureau<br>
          <a href="${safeBase}" style="color:#999999;text-decoration:underline;">${safeBase}</a>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export async function sendVerificationCode(
  to: string,
  name: string,
  code: string,
  purpose: Purpose
): Promise<void> {
  const cfg = useRuntimeConfig()
  const baseUrl = cfg.public.baseUrl

  if (!cfg.smtpHost) {
    // Dev-mode fallback: zichtbaar in de server-console zonder SMTP-config.
    console.warn(`[email] SMTP niet geconfigureerd. Verificatiecode voor ${to}: ${code}`)
    return
  }

  const vars: TemplateVars = { name, code, purpose, baseUrl }
  await getTransport().sendMail({
    from: cfg.smtpFrom,
    to,
    subject: buildSubject(purpose),
    text: buildText(vars),
    html: buildHtml(vars)
  })
}
