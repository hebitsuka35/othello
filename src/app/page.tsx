'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  // [コメント]turnColorは自分のオセロの石の色を意味する。1は黒、2は白を意味する。
  const [turnColor, setTurnColor] = useState(1);
  // [コメント]AitenoColorは相手のオセロの石の色を意味する。turnColorが1の場合は2,2の場合は1になる。
  const AItenoColor = 3 - turnColor;
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
    [1, 0], //上
    [1, 1], //右上
    [0, 1], //右
    [-1, 1], //右下
    [-1, 0], //下
    [-1, -1], //左下
    [0, -1], //左
    [1, -1], //左上
  ];

  const onClick = (x: number, y: number) => {
    const newBoard = structuredClone(board);
    //[個人用メモ]盤面最上段にはみ出さないよう、かつ、下の盤面が相手のオセロの石の色の場合は、上の盤面を反転する
    if (board[y + 1] !== undefined && board[y + 1][x] === AItenoColor) {
      newBoard[y][x] = turnColor;
      setTurnColor(AItenoColor);
    }
    //[個人用メモ]盤面最下段にはみ出さないよう、かつ、上の盤面が相手のオセロの石の色の場合は、下の盤面を反転する
    if (board[y - 1] !== undefined && board[y - 1][x] === AItenoColor) {
      newBoard[y][x] = turnColor;
      setTurnColor(AItenoColor);
    }
    setBoard(newBoard);
    //[個人用メモ]盤面最右段にはみ出さないよう、かつ、左の盤面が相手のオセロの石の色の場合は、右の盤面を反転する
    if (board[x + 1] !== undefined && board[y][x - 1] === AItenoColor) {
      newBoard[y][x] = turnColor;
      setTurnColor(AItenoColor);
    }
    //[個人用メモ]盤面最左段にはみ出さないよう、かつ、右の盤面が相手のオセロの石の色の場合は、左の盤面を反転する
    if (board[x - 1] !== undefined && board[y][x + 1] === AItenoColor) {
      newBoard[y][x] = turnColor;
      setTurnColor(AItenoColor);
    }

    setBoard(newBoard);
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
