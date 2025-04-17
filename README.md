#### 2. `createInvoice.ts` (APIルート)

BTCPayServerに請求書を作成するバックエンドのAPIを用意します。

```tsx
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function createInvoice(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { BTCPAY_SERVER_URL, BTCPAY_API_KEY, BTCPAY_STORE_ID } = process.env;

  if (!BTCPAY_SERVER_URL || !BTCPAY_API_KEY || !BTCPAY_STORE_ID) {
    return res.status(500).json({ error: 'Server environment variables not set' });
  }

  try {
    const response = await fetch(`${BTCPAY_SERVER_URL}/api/v1/invoices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${BTCPAY_API_KEY}`,
      },
      body: JSON.stringify({
        amount: 1, // 支払い金額 (USD)
        currency: 'JPY',
        storeId: BTCPAY_STORE_ID,
      }),
    });

    const invoice = await response.json();

    if (response.ok) {
      res.status(200).json({ url: invoice.checkoutLink }); // 支払いページのリンクを返す
    } else {
      throw new Error(invoice.message || 'Failed to create invoice');
    }
  } catch (error: any) {
    console.error('Error creating invoice:', error.message);
    res.status(500).json({ error: 'Failed to create invoice' });
  }
}
```

---

#### 3. `.env.local`

BTCPayServer関連の秘密情報や設定を保存する環境変数ファイル。

```env
BTCPAY_SERVER_URL=https://your-btcpay-server-url-here
BTCPAY_API_KEY=your-btcpay-api-key-here
BTCPAY_STORE_ID=your-btcpay-store-id-here
```

---

オセロの動作確認方法

１.vercel
(1)vercelデプロイ先にアクセスする
・vercelサーバ動作環境URL
https://othello-fdc5ulvxs-hebitsuka35s-projects.vercel.app/
(2)デプロイ先のURL
・vercelデプロイ先
https://vercel.com/hebitsuka35s-projects/othello

2.ローカル
(1)ローカルにgit cloneする
・
git clone git@github.com:hebitsuka35/othello.git
・プロジェクトのルートディレクトリに移動
cd
・npmインストール
npm i
・localhost:3000でサーバを起動する。
npm run dev
・ブラウザのURLに下記を入力して実行する。
<http://localhost:3000>

3.docker
(1)Dockerfileのあるルートディレクトリへ移動する。
(2)docker build コマンドでイメージを作成する。
　docker build -t othello .
(3)imagesの確認
　docker images
・実行結果例
　REPOSITORY TAG IMAGE ID CREATED SIZE
　othello latest 28388452f7c8 2 minutes ago 2.01GB
(3)docker run コマンドでコンテナを起動。
　docker run -p 3000:3000 othello
(4)ブラウザのURLに下記を入力して実行する。
<http://localhost:3000>
(5)containerの確認
docker ps
・実行結果例
CONTAINER ID IMAGE COMMAND CREATED STATUS PORTS NAMES
63aa36e21395 othello "docker-entrypoint.s…" 5 minutes ago Up 5 minutes 0.0.0.0:3000->3000/tcp dreamy_proskuriakova
(6)docker containerの停止
　docker stop <コンテナIDまたはコンテナ名>
docker stop 63aa36e21395 または othello
(7)docker containerの削除
docker rm <コンテナIDまたはコンテナ名>

91.githubへの格納コマンド
cd で othelloディレクトリに移動する。
git add .
git commit -m 'コメント'
git push origin main

99.プロジェクトの元テンプレート格納先
https://github.com/solufa/next-ts-starter

```

```
