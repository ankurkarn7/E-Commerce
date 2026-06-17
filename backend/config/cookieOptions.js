// In production the frontend and backend are on different domains over HTTPS,
// so cross-site cookies require SameSite=None + Secure. Locally (http over
// localhost) browsers reject those, so fall back to Lax + non-secure.
const isProd = process.env.NODE_ENV === 'production';

const cookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/',
};

module.exports = cookieOptions;
