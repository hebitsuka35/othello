import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function POST(_request: NextRequest) {
  const { BTCPAY_SERVER_URL, BTCPAY_API_KEY, BTCPAY_STORE_ID } = process.env;

  if (!BTCPAY_SERVER_URL || !BTCPAY_API_KEY || !BTCPAY_STORE_ID) {
    return NextResponse.json(
      { error: 'サーバが見つかりません。設定を見直してください。' },
      { status: 500 },
    );
  }

  try {
    const response = await fetch(`${BTCPAY_SERVER_URL}/api/v1/invoices`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Token ${BTCPAY_API_KEY}`,
      },
      body: JSON.stringify({
        amount: 10,
        currency: 'JPY',
        storeId: BTCPAY_STORE_ID,
        checkout: {
          paymentMethods: ['BTC-LightningNetwork'],
          defaultPaymentMethod: 'BTC-LightningNetwork',
        },
      }),
    });

    const invoice = await response.json();

    if (response.ok) {
      return NextResponse.json({
        url: invoice.checkoutLink,
      });
    } else {
      throw new Error(invoice.message || '失敗しました。');
    }
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json(
      {
        error: '失敗しました。',
      },
      { status: 500 },
    );
  }
}
