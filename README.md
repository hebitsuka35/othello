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
