'use Client';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function createInvoice(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { BTCPAY_SERVER_URL, BTCPAY_API_KEY, BTCPAY_STORE_ID } = process.env;

  if (!BTCPAY_SERVER_URL || !BTCPAY_API_KEY || !BTCPAY_STORE_ID) {
    return res.status(500).json({ error: 'サーバが見つかりません。設定を見直してください。' });
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
      }),
    });

    const invoice = await response.json();

    if (response.ok) {
      res.status(200).json({
        url: invoice.checkoutLink,
      });
    } else {
      throw new Error(invoice.message || '失敗しました。');
    }
  } catch (error) {
    console.error('Error createing invoice:', error);
    res.status(500).json({
      error: '失敗しました。',
    });
  }
}
