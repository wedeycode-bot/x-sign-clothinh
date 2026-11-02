import { NextResponse } from 'next/server';

const VALID_PASSCODES = [
  process.env.ADMIN_PASSCODE,
  'XSIGN2026',
  'XSIGN-ATELIER-2026',
  'xsign-owner',
  'atelier-boss'
].filter(Boolean);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { passcode } = body;

    if (!passcode || typeof passcode !== 'string') {
      return NextResponse.json({ success: false, message: 'Passcode required' }, { status: 400 });
    }

    const cleanPasscode = passcode.trim();
    const isMatch = VALID_PASSCODES.some((valid) => valid?.toLowerCase() === cleanPasscode.toLowerCase());

    if (!isMatch) {
      return NextResponse.json({ success: false, message: 'Invalid manager access code' }, { status: 401 });
    }

    const token = `xsign_mgr_${Buffer.from(cleanPasscode + '_' + Date.now()).toString('base64')}`;

    const response = NextResponse.json({
      success: true,
      message: 'Access granted. Welcome, Director.',
      token,
    });

    response.cookies.set('xsign_admin_session', token, {
      path: '/',
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json({ success: false, message: 'Authentication failure' }, { status: 500 });
  }
}
