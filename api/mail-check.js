// TEMPORARY diagnostic — reports SMTP config presence + connection/auth result.
// Does NOT expose secrets (password shown only as a boolean). Remove before merging to production.
import nodemailer from 'nodemailer';

export default async (req, res) => {
  const cfg = {
    SMTP_HOST: process.env.SMTP_HOST || null,
    SMTP_PORT: process.env.SMTP_PORT || null,
    SMTP_USER: process.env.SMTP_USER || null,
    SMTP_PASS_set: !!process.env.SMTP_PASS,
    UNDERWRITER_EMAIL: process.env.UNDERWRITER_EMAIL || null,
    EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME || '(default) Purple Dot Financial',
  };

  if (!process.env.SMTP_HOST || !process.env.SMTP_PASS) {
    res.status(200).json({
      ok: false,
      reason: 'SMTP env vars are NOT visible to this deployment. Most likely they were not scoped to "Preview" (or not saved / not redeployed).',
      cfg,
    });
    return;
  }

  const port = Number(process.env.SMTP_PORT) || 465;
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port !== 587, // 465 = implicit SSL; 587 = STARTTLS
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  try {
    await transporter.verify();
    res.status(200).json({ ok: true, verify: 'SMTP connect + auth SUCCESS ✅', usingPort: port, secure: port !== 587, cfg });
  } catch (e) {
    res.status(200).json({
      ok: false,
      verify: 'SMTP FAILED ❌',
      error: String((e && e.message) || e),
      code: (e && e.code) || null,
      usingPort: port,
      secure: port !== 587,
      cfg,
    });
  }
};
