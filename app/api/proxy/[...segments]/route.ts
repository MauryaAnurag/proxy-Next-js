import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosRequestConfig } from 'axios';

const BASE_URL = 'https://apiforcornershost.cubisysit.com';

async function handleRequest(req: NextRequest, method: string) {
  if (req.method === 'OPTIONS') {
    // Handle preflight OPTIONS request
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }
  const url = `${BASE_URL}${req.nextUrl.pathname.replace('/proxy', '')}`;
  // return new NextResponse( url );
  const headers = { 'Content-Type': 'application/json' };

  try {
    let axiosConfig: AxiosRequestConfig = {
      method: method,
      url: url,
      headers: headers,
    };

    if (method === 'GET' || method === 'DELETE') {
      const params = new URLSearchParams(req.nextUrl.search);
      axiosConfig = {
        ...axiosConfig,
        params: params,
      };
    } else {
      const body = await req.json();
      axiosConfig = {
        ...axiosConfig,
        data: body,
      };
    }

    const response = await axios(axiosConfig);
    const nextResponse = new NextResponse(JSON.stringify(response.data), { status: response.status });

    // Set CORS headers
    nextResponse.headers.set('Access-Control-Allow-Origin', '*');
    nextResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    nextResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return nextResponse;
  } catch (error) {
    console.error('Proxy Error:', error);
    return new NextResponse(JSON.stringify({ error: 'Proxy Error' }), { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return handleRequest(req, 'GET');
}

export async function POST(req: NextRequest) {
  return handleRequest(req, 'POST');
}

export async function PUT(req: NextRequest) {
  return handleRequest(req, 'PUT');
}

export async function DELETE(req: NextRequest) {
  return handleRequest(req, 'DELETE');
}
