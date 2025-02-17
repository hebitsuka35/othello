'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  // [コメント]turnColorは自分のオセロの石の色を意味する。1は黒、2は白を意味する。
  const [turnColor, setTurnColor] = useState(1);
  // [コメント]OppoColorは相手のオセロの石の色を意味する。turnColorが1の場合は2,2の場合は1になる。
  const OppoColor = 3 - turnColor;
  //[コメント]boardはオセロの盤面を意味する。
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

  //[コメント]directionsは自分のオセロの盤面における位置ベクトルを意味する。
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

  //盤面の範囲内かどうかを判定する関数を意味する。
  const isInBanmen = (x: number, y: number): boolean => {
    return x >= 0 && x < 8 && y >= 0 && y < 8;
  };

  //石を置けるかどうかをチェックする関数を意味する。
  const isValidMove = (x: number, y: number, board: number[][]): boolean => {
    if (board[y][x] != 0) return false;

    let isValid = false;
    for (const [dx, dy] of directions) {
      let newX = x + dx;
      let newY = y + dy;
      let foundOpponent = false;

      while (isInBanmen(newX, newY) && board[newY][newX] === OppoColor) {
        foundOpponent = true;
        newX += dx;
        newY += dy;
      }

      if (foundOpponent && isInBanmen(newX, newY) && board[newY][newX] === turnColor) {
        isValid = true;
      }
    }
    return isValid;
  };

  //turnColorをおいた八方の色を反転させる関数を意味する。
  const flipAllDirections = (x: number, y: number, newBoard: number[][]) => {
    for (const [dx, dy] of directions) {
      let newX = x + dx;
      let newY = y + dy;
      const flipPositions: [number, number][] = [];

      //盤面の範囲内かつ相手の石がある場合
      while (isInBanmen(newX, newY) && newBoard[newY][newX] === OppoColor) {
        flipPositions.push([newX, newY]);
        newX += dx;
        newY += dy;
      }

      //自分の石に挟まれていたら間の石を反転させる。
      if (isInBanmen(newX, newY) && newBoard[newY][newX] === turnColor) {
        for (const [flipX, flipY] of flipPositions) {
          newBoard[flipY][flipX] = turnColor;
        }
      }
    }
  };

  const onClick = (x: number, y: number) => {
    //石がある場合は何もしない
    if (!isValidMove(x, y, board)) return;

    const newBoard = structuredClone(board);
    newBoard[y][x] = turnColor;
    flipAllDirections(x, y, newBoard);
    setBoard(newBoard);
    setTurnColor(OppoColor);
  };

  return (
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
            </div>
          )),
        )}
      </div>
    </div>
  );
}
