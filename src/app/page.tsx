'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  //// ------変数/状態管理宣言------
  //盤面の初期状態を意味する。1は黒、0は白を意味する。
  const InitialBoard:number[][] = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ];
  //現在の盤面を意味する。
  const [board, setBoard] = useState(InitialBoard);
  //onClickで取得したx,y座標からの8方向の座標の位置を意味する。
  const directions:number[][] = [
    [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1],
  ];
  //turnColorは現在のターンで配置する石の色を意味する。1は黒、2は白を意味する。
  const [turnColor, setTurnColor] = useState(1);
  //現在のターンの反対の石の色を意味する。2/1(黒)は、2(白)、2/1(黒)は2(白)を意味する。
  const OppoColor:number = 2/turnColor;

  //// ------関数宣言------
  //盤面にオセロの石をおけるかを判定することを意味する。
  const isInBoard = (x: number, y: number): boolean => x >= 0 && x < board.length && y >= 0 && y < board.length;
  //盤面にオセロの石がおけるか（黒(1)でもなく白(2)でもなく、0であるか）を判定することを意味する。
  const isZero = (x: number, y: number,board:number[][]): boolean => board[y][x] === 0;

  //盤面のオセロの色の数量を計算することを意味する。
  const countStones = (board: number[][]) => {
    let blackCount:number = 0, whiteCount:number = 0;
    board.map((row,y) =>row.map((color,x) => {
      if(color===1){
        blackCount++;
      }else if(color===2){
        whiteCount++;
      };
    })
   );
   return {blackCount,whiteCount};
  };

  //初期盤面して、1:黒のオセロの色の石からスタートするようリセットする。
  const resetBoard = ()=> { 
    setBoard(InitialBoard);
    setTurnColor(1);
  };
  
  // onClickのx,y座標に対してオセロの石を配置する関数を意味する。
  const placeTurnColor = (x: number, y: number) => {
    const newBoard = structuredClone(board);
    if(isZero(x,y,board)){
      newBoard[y][x] = turnColor;
      setTurnColor(OppoColor);
      setBoard(newBoard);
    }
  };

  return (
    <>
      <div className={styles.header}>
        <div className={styles.title}>オセロ</div>
      </div>
      <div>現在のターン：{turnColor === 1 ? '黒⚫️' : '白⚪️'}</div>
      <div>
        黒⚫️の数：{countStones(board).blackCount} 
      </div>
      <div>
        白⚪️の数：{countStones(board).whiteCount}
      </div>
      <div>
        <button className={styles.resetButton} onClick={resetBoard}>
          リセット
        </button>
      </div>
      <div className={styles.container}>
        <div className={styles.board}>
          {board.map((row, y) =>
            row.map((color, x) => (
              <div className={styles.cell} key={`${x}-${y}`} onClick={() => placeTurnColor(x, y)}>
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
    </>
  );
}
