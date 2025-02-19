'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  //// ------変数宣言------
  //盤面のサイズつまり縦と横の升目の下図を意味する。
  const boadsize = 8;
  // 最初の盤面を意味する。
  const InitialBoard = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ];
  //盤面に置いた石からの座標軸8方向を意味する。
  const directions = [
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
    [-1, -1],
    [0, -1],
    [1, -1],
  ];
  //UIにおけるonClickで取得できるx,y座標とboard[[,],[,],・・]におけるy:行、x:列を意味する。

  //// ------状態管理宣言------
  // 1: 黒, 2: 白
  const [turnColor, setTurnColor] = useState(1);
  // 反対の色を意味する。
  const OppoColor = 3 - turnColor;
  // 盤面の状態管理を意味する。
  const [board, setBoard] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  // boardをnewBoardにコピーする。reactのルール上、boardを直接更新しないようにする必要があるため。
  const newBoard = structuredClone(board);
  // 盤面にオセロをおけないときにパスする状態を意味する。
  const [passCount, setPassCount] = useState(0);
  // 盤面で多い色が決まったときの表示メッセージを意味する。
  const [winnerMessage, setWinnerMessage] = useState('');

  //// ------関数宣言------
  //  xとyすなわち置いた石の盤面における座標軸盤面の範囲内にあるのか、範囲内の場合trueをreturnする。
  const isInBoard = (x: number, y: number): boolean =>
    x >= 0 && x < boadsize && y >= 0 && y < boadsize;
  //  x,yそれぞれが0すなわち石がおかれていない場合、falseをreturnする。
  const isNotZero = (board: number[][], x: number, y: number): boolean =>
    board[y][x] !== 0 ? false : true;
  //  x,yの座標の盤面に石を置くことができるかをreturnする。

  const isValidMove = (x: number, y: number, board: number[][]) => {
    isNotZero(board, x, y);

    //石に対する8方向それぞれの座標軸(x,y)の方向を取得する。UI座標x -> board[]の行y、UI座標y -> board[]の列xに対応することに注意する。
    for (const [dx, dy] of directions) {
      let distanceFromX: number = x + dx;
      let distanceFromY: number = y + dy;
      // 反対の色がみつかるかどうかをフラグで管理する。
      let foundOpponent: boolean = false;
      // distanceFromX,distanceFromYが盤面の中にありかつ相手の石の色がある場合は
      // foundOpponentつまり相手の石の色があるフラグをtrueにして、x軸とy軸にそれぞれ１ずつ加えて
      // 確認していく。
      while (
        isInBoard(distanceFromX, distanceFromY) &&
        board[distanceFromY][distanceFromX] === OppoColor
      ) {
        foundOpponent = true;
        distanceFromX += dx;
        distanceFromY += dy;
      }
      //相手の色のフラグがtrueであり（相手の色がまわりにある）かつ自分の色がある場合はtrueで返却する
      if (
        foundOpponent &&
        isInBoard(distanceFromX, distanceFromY) &&
        board[distanceFromY][distanceFromX] === turnColor
      ) {
        return true;
      }
    }
    //上記以外の場合は、石をおけないのでfor文から抜ける。
    return false;
  };

  //オセロの石の色を反転させる場所を計算する関数を意味する。
  const flipAllDirections = (x: number, y: number, newBoard: number[][]) => {
    // flipPositions[number,number][]に反転させる座標の情報を格納する。
    for (const [dx, dy] of directions) {
      let distanceFromX = x + dx,
        distanceFromY = y + dy;
      const flipPositions: [number, number][] = [];
      //盤面の範囲内かつ相手の石の色がある場合は、flipPositions[]配列に上記の全方向の情報を格納する。
      while (
        isInBoard(distanceFromX, distanceFromY) &&
        newBoard[distanceFromY][distanceFromX] === OppoColor
      ) {
        flipPositions.push([distanceFromX, distanceFromY]);
        distanceFromX += dx;
        distanceFromY += dy;
      }
      //自分の石の色の場合は、flipPositionsを自分の石に変更する。
      if (
        isInBoard(distanceFromX, distanceFromY) &&
        newBoard[distanceFromY][distanceFromX] === turnColor
      ) {
        for (let i = 0; i < flipPositions.length; i++) {
          const flipX = flipPositions[i][0];
          const flipY = flipPositions[i][1];
          newBoard[flipY][flipX] = turnColor;
        }
      }
    }
  };

  //石を反転できる盤面をチェックする関数
  const hasValidMove = (color: number, board: number[][]) => {
    for (let y = 0; y < boadsize; y++) {
      for (let x = 0; x < boadsize; x++) {
        //動かせるx,y座標なのかを確認して、returnを返す。
        if (isValidMove(x, y, board)) return true;
      }
    }
    return false;
  };

  //board現時点の白と黒の石の下図を計算することを意味する。
  const countStones = (board: number[][]) => {
    let blackCount = 0;
    let whiteCount = 0;

    //盤面の各行を繰り返し処理
    for (let i = 0; i < board.length; i++) {
      const row = board[i];

      for (let j = 0; j < row.length; j++) {
        const cell = row[j];
        if (cell === 1) {
          blackCount++;
        }
        if (cell === 2) {
          whiteCount++;
        }
      }
    }

    return { blackCount, whiteCount };
  };

  //石の多い方勝者を計算する関数を意味する。
  const checkWinner = (board: number[][]) => {
    //現在の盤面の黒と白の石の下図を計算する関数を意味する。
    const { blackCount, whiteCount } = countStones(board);
    //黒い石が反転できる場所が盤面にあるかをチェックする関数を意味する。
    const blackHasMove = hasValidMove(1, board);
    //白い石が反転できる場所が盤面にあるかをチェックする関数を意味する。
    const whiteHasMove = hasValidMove(2, board);
    //黒い石と白い石の両方が反転できない状態の場合
    if (!blackHasMove && !whiteHasMove) {
      //かつ黒い石が白い石の数より多い場合
      if (blackCount > whiteCount) return '黒の勝ちです。リセットボタンを押してください。';
      //かつ白い石が黒い石の数より多い場合
      if (whiteCount > blackCount) return '白の勝ちです。リセットボタンを押してください。';
      //上記で無い場合は引き分けと表示する。
      return '引き分けです。リセットボタンを押してください。';
    }
    return null;
  };

  //パスをする関数を設定する。
  const passTurn = () => {
    //winnerMeaageがtrue
    if (winnerMessage) return;
    //次のターンはturnColorつまり自分の色の反対の色をnextTurnとする。
    const nextTurn = 3 - turnColor;
    //盤面に動かせる石があるか
    if (hasValidMove(nextTurn, board)) {
      //相手の色のターンへ変更
      setTurnColor(nextTurn);
      //有効な手があるのでパスカントをリセットする。
      setPassCount(0);
    } else {
      //newPassCountにする。
      const newPassCount = passCount + 1;
      // passCountをnewPasscountへ
      setPassCount(newPassCount);

      //newPassCountが2以上の場合はゲームを終了する。
      if (newPassCount >= 2) {
        // checkWinnerで結果を確認して、checkWinnerがあったらsetWinnerMessageにreturn文のメッセージを
        // 格納する。
        const result = checkWinner(board);
        if (result) {
          setWinnerMessage(result);
          return;
        }
      } else {
        setTurnColor(nextTurn); // もう一度ターンを切り替える
      }
    }
  };

  const onClick = (x: number, y: number) => {
    if (!isValidMove(x, y, board)) return;

    newBoard[y][x] = turnColor;
    flipAllDirections(x, y, newBoard);
    setBoard(newBoard);

    const nextTurn = 3 - turnColor;
    if (hasValidMove(nextTurn, newBoard)) {
      setTurnColor(nextTurn);
      setPassCount(0);
    } else {
      passTurn(); // 自動的にパス処理
    }

    const result = checkWinner(newBoard);
    if (result) setWinnerMessage(result);
  };

  const resetBoard = () => {
    setBoard(InitialBoard);
    setTurnColor(1);
    setWinnerMessage('');
    setPassCount(0);
  };

  return (
    <>
      <div className={styles.header}>
        <div className={styles.title}>オセロ</div>
      </div>
      <div>現在のターン：{turnColor === 1 ? '黒⚫️のターン' : '白⚪️のターン'}</div>
      <div>
        黒⚫️の数：{countStones(board).blackCount} | 白⚪️の数：{countStones(board).whiteCount}
      </div>
      {winnerMessage && <div>{winnerMessage}</div>}
      <div className={styles.header}>
        <button className={styles.resetButton} onClick={resetBoard}>
          リセット
        </button>
        <button className={styles.passButton} onClick={passTurn} disabled={winnerMessage !== ''}>
          パス
        </button>
      </div>
      <div className={styles.container}>
        <div className={styles.board}>
          {board.map((row, y) =>
            row.map((color, x) => (
              <div className={styles.cell} key={`${x}-${y}`} onClick={() => onClick(x, y)}>
                {color !== 0 && (
                  <div
                    className={styles.stone}
                    style={{ background: color === 1 ? '#000' : '#fff' }}
                  />
                )}
                {color === 0 && isValidMove(x, y, board) && <div className={styles.hint} />}
              </div>
            )),
          )}
        </div>
      </div>
    </>
  );
}
