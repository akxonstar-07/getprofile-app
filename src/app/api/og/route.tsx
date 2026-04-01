import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username') || 'Creator';
    const avatar = searchParams.get('avatar') || '';
    const name = searchParams.get('name') || username;

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0f172a',
            backgroundImage: 'linear-gradient(to bottom right, #0f172a, #1e1b4b)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '40px',
              border: '2px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {avatar ? (
              <img
                src={avatar}
                alt={name}
                style={{
                  width: '200px',
                  height: '200px',
                  borderRadius: '100px',
                  border: '8px solid rgba(255,255,255,0.1)',
                  marginBottom: '40px',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <div
                style={{
                  width: '200px',
                  height: '200px',
                  borderRadius: '100px',
                  backgroundColor: '#4f46e5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '80px',
                  fontWeight: 'bold',
                  marginBottom: '40px',
                }}
              >
                {username.charAt(0).toUpperCase()}
              </div>
            )}
            
            <h1
              style={{
                fontSize: '80px',
                fontWeight: '900',
                color: 'white',
                margin: 0,
                textAlign: 'center',
                fontFamily: 'sans-serif',
              }}
            >
              {name}
            </h1>
            
            <p
              style={{
                fontSize: '36px',
                color: '#94a3b8',
                marginTop: '20px',
                fontFamily: 'monospace',
              }}
            >
              getprofile.me/{username}
            </p>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.error(e);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
