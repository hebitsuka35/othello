'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  // turnColorは自分のオセロの石の色を意味する。1は黒、2は白を意味する。
  const [turnColor, setTurnColor] = useState(1);
  // OppoColorは相手のオセロの石の色を意味する。turnColorが1の場合は2,2の場合は1になる
  // つまりturnColorが反転するようになっている。
  const OppoColor = 3 - turnColor;
  //boardはオセロの盤面を意味する。
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

  //directionsは自分の石の色からのオセロの盤面におけるベクトルを意味する。
  const directions = [
    [1, 0], //下
    [1, 1], //右下
    [0, 1], //右
    [-1, 1], //右上
    [-1, 0], //上
    [-1, -1], //左上
    [0, -1], //左
    [1, -1], //左下
  ];

  //盤面の範囲内 0以上から8未満かどうかを判定する関数を意味する。
  const isInBoard = (x: number, y: number): boolean => {
    return x >= 0 && x < 8 && y >= 0 && y < 8;
  };

  //自分の石を盤面に置けるかどうかをチェックする関数を意味する。
  const isValidMove = (x: number, y: number, board: number[][]): boolean => {
    //まず置けるかどうかチェックする
    if (board[y][x] !== 0) return false;
    //自分の石を盤面に置けるかどうかを判定するためのフラグを意味する。
    let isValid = false;
    //directionsの第一引数と第二引数をfor文でそれぞれdx,dyで取得する
    for (const [dx, dy] of directions) {
      //xにdxを加えてnewXを定義する。つまり上下の情報をnewXに格納する。
      let newX = x + dx;
      //yにdyを加えてnewYを定義する。つまり左右の情報をnewYに格納する。
      let newY = y + dy;
      //相手の色の石があるかどうかを判定するフラグを意味する。
      let foundOpponent = false;
      // 相手の石に辿り着くnewX,newYが盤面の範囲内の0-7の間にありかつ相手の色の場合
      while (isInBoard(newX, newY) && board[newY][newX] === OppoColor) {
        //相手の色の石があることをtrueにして判定する。
        foundOpponent = true;
        // newXにdxの値(1 | -1)を入れて、newXに格納する。
        newX += dx;
        // newYにdyの値(1 | -1)を入れて、newYに格納する。
        newY += dy;
      }
      // 相手の色がある場合、かつ盤面が0-7の間の場合かつnewY,newXが自分の色の場合
      if (foundOpponent && isInBoard(newX, newY) && board[newY][newX] === turnColor) {
        //有効にする。
        isValid = true;
      }
    }
    //有効であることを返却する。
    return isValid;
  };

  //turnColorをおいた八方の色を反転させる関数を意味する。
  const flipAllDirections = (x: number, y: number, newBoard: number[][]) => {
    for (const [dx, dy] of directions) {
      let newX = x + dx;
      let newY = y + dy;
      //flipPositionsの空の配列を意味する。反転対象の相手の石の座標を意味する。
      //反転できる座標をflipPositions[number,number]の配列
      //例としてflipPositions[行,列]の[]に格納していく。
      const flipPositions: [number, number][] = [];
      //盤面の範囲内かつ相手の石がある場合、相手の石を探してflipPositionsに格納する。
      while (isInBoard(newX, newY) && newBoard[newY][newX] === OppoColor) {
        //newXとnewYをflipPosions格納する。while文により相手の色が連続している場合にflipPositionsに追加する。
        flipPositions.push([newX, newY]);
        newX += dx;
        newY += dy;
      }
      //最後に自分の石に挟まれていたら間の石を反転させる。
      if (isInBoard(newX, newY) && newBoard[newY][newX] === turnColor) {
        for (const [flipX, flipY] of flipPositions) {
          //反転対象の石を自分の色に変える
          newBoard[flipY][flipX] = turnColor;
        }
      }
    }
  };

  const onClick = (x: number, y: number) => {
    //自分の石が置けない場合は何もしない
    if (!isValidMove(x, y, board)) return;
    // newBoardにboardを複写して格納する。
    const newBoard = structuredClone(board);
    //newBoardの色を自分の石の色に変更する。
    newBoard[y][x] = turnColor;
    //newBoardとx,y座標から反転できる石を見つける
    flipAllDirections(x, y, newBoard);
    //反転したnewBoardの状態にboardを変更する。
    setBoard(newBoard);
    //色を反転させる。
    setTurnColor(OppoColor);
  };

  //初期盤面の状態に変更する。
  const resetBoard = () => {
    setBoard([
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 2, 0, 0, 0],
      [0, 0, 0, 2, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ]);
    //自分の石の色を黒に戻す
    setTurnColor(1);
  };

  //現在のターンを表示する
  const displayTurnColor = () => {
    return turnColor === 1 ? '黒⚫️のターン' : '白⚪️のターン';
  };

  //黒の数と白の数を表示する。
  const countStones = (board: number[][]) => {
    let blackCount = 0;
    let whiteCount = 0;

    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        if (board[y][x] === 1) blackCount++;
        if (board[y][x] === 2) whiteCount++;
      }
    }
    return { blackCount, whiteCount };
  };

  const { blackCount, whiteCount } = countStones(board);

  // //盤面が０でない条件を記載する
  // const isFullBoard = ():  => {
  //   return ;
  // };

  //白と黒の数を比較して、勝ち負けを表示する。
  const winnerColor = () => {
    if (blackCount > whiteCount) {
      alert('黒の勝ち');
    } else if (whiteCount > blackCount) {
      alert('白の勝ち');
    } else {
      alert('引き分け');
    }
  };

  return (
    <>
      <div className={styles.header}>
        <div className={styles.title}>オセロ</div>
      </div>
      <div>現在のターン：{displayTurnColor()}</div>
      <div>
        黒の石の数：{blackCount} | 白の石の数：{whiteCount}
      </div>
      <div className={styles.header}>
        <button className={styles.resetButton} onClick={resetBoard}>
          リセット
        </button>
      </div>
      <div className={styles.container}>
        <div className={styles.board}>
          {/* [個人用メモ]mapの第二引数であるy,xはインデックスを意味する。 */}
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
