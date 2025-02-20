'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  //// ------変数/状態管理宣言------
  //turnColorは現在のターンで配置する石の色を意味する。1は黒、2は白を意味する。
  const [turnColor, setTurnColor] = useState(1);
  //現在のターンの反対の石の色を意味する。2/1(黒)は、2(白)、2/1(黒)は2(白)を意味する。
  const OppoColor:number = 2/turnColor;
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

  //// ------関数宣言------
  //// ------判定系------
  //盤面の範囲内にオセロの石をおけるかを判定することを意味する。
  const isInBoard = (x: number, y: number): boolean => x >= 0 && x < board.length && y >= 0 && y < board.length;
  //盤面が黒(1)でもなく白(2)でもなく、0であるかを判定することを意味する。
  const isZero = (x: number, y: number,board:number[][]): boolean => board[y][x] === 0;
   
  //// ------関数宣言------
  //// ------実行系------
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

  //初期盤面の状態にして、1:黒のオセロの色の石からスタートすることを意味する。
  const resetBoard = ()=> { 
    setBoard(InitialBoard);
    setTurnColor(1);
  };

  //オセロの石を置いたときに、置いた盤面の8方向に反対の石の色があり、かつ反対の石の色の先に自分の石の色がある場合に反転する、
  // 反対の石の色の先の何個先に自分の石の色があるのかはわからない前提であることを意味する。
  
  //置いた石の盤面の8方向の座標を意味する。
  
  // let distanceFromX0 = directions[0][0];
  // let distanceFromX1 = directions[1][0];
  // let distanceFromX2 = directions[2][0];
  // console.log(distanceFromX0,distanceFromX1,distanceFromX2);
  //directionsのy座標がとれた
  const distanceFromX:number[] = [];
  for(let i = 0;i<directions.length;i++){
    distanceFromX.push(directions[i][0]);
    
    console.log((directions[i][0]));
    console.log(distanceFromX);
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
      <div>------------------------------------------------</div>
      <div>
        黒⚫️の数：{countStones(board).blackCount} 
      </div>
      <div>
        白⚪️の数：{countStones(board).whiteCount}
      </div>
      <div>------------------------------------------------</div>
      <div>
        <button className={styles.resetButton} onClick={resetBoard}>
          リセット
        </button>
      </div>
      <div>------------------------------------------------</div>
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
