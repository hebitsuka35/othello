'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  //// ------変数/状態管理宣言------
  //turnColorは現在のターンで配置する石の色を意味する。1は黒、2は白を意味する。
  const [turnColor, setTurnColor] = useState(1);
  //現在のターンの反対の石の色を意味する。2/1(黒)は、2(白)、2/1(黒)は2(白)を意味する。
  const OppoColor: number = 2 / turnColor;
  //盤面の初期状態を意味する。1は黒、0は白を意味する。
  const InitialBoard: number[][] = [
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
  const directions: number[][] = [
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
    [-1, -1],
    [0, -1],
    [1, -1],
  ];

  //// ------関数宣言------
  //// ------判定系------
  //盤面の範囲内にオセロの石をおけるかを判定することを意味する。
  const isInBoard = (x: number, y: number): boolean =>
    x >= 0 && x < board.length && y >= 0 && y < board.length;
  //盤面が黒(1)でもなく白(2)でもなく、0であるかを判定することを意味する。
  const isZero = (x: number, y: number, board: number[][]): boolean => board[y][x] === 0;
  //石を置いたときに、8方向に反対の石の色があるかを判定する関数
  const hasArroundOppColor = (x: number, y: number, turnColor: number): boolean => {
    for (const [dx, dy] of directions) {
      const checkX: number = x + dx;
      const checkY: number = y + dy;
      if (isInBoard(checkX, checkY) && board[checkY][checkX] === OppoColor) {
        return true;
      }
    }
    return false;
  };
  // 石を置くことができるか確認する関数。
  const canSetTurnColor = (x: number, y: number, turnColor: number, board: number[][]): boolean => {
    if (hasArroundOppColor(x, y, turnColor)) {
      const OppoColor = turnColor === 1 ? 2 : 1;

      for (const [dx, dy] of directions) {
        let distanceFromX = x + dx;
        let distanceFromY = y + dy;
        let hasOpponentBetween = false;

        while (
          isInBoard(distanceFromX, distanceFromY) &&
          board[distanceFromY][distanceFromX] === OppoColor
        ) {
          hasOpponentBetween = true;
          distanceFromX += dx;
          distanceFromY += dy;
        }

        if (
          hasOpponentBetween &&
          isInBoard(distanceFromX, distanceFromY) &&
          board[distanceFromY][distanceFromX] === turnColor
        ) {
          return true;
        }
      }
    }
    return false;
  };
  //盤面上に候補地があるかどうかを判定する。
  const checkCanSetTurnColor = (turnColor: number, board: number[][]): boolean => {
    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < board[y].length; x++) {
        if (canSetTurnColor(x, y, turnColor, board)) {
          return true;
        }
      }
    }
    return false;
  };
  //盤面上に1,2のいずれかが置かれて、オセロゲームが終了するかどうかを判定する。
  const isOrNotGameOver = (board: number[][]): boolean => {
    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < board[y].length; x++) {
        if (board[y][x] === 0) {
          return false;
        }
      }
    }
    return true;
  };

  //// ------関数宣言------
  //// ------実行系------
  //盤面のオセロの色の数量を計算することを意味する。
  const countStones = (board: number[][]) => {
    let blackCount: number = 0,
      whiteCount: number = 0;
    board.map((row, y) =>
      row.map((color, x) => {
        if (color === 1) {
          blackCount++;
        } else if (color === 2) {
          whiteCount++;
        }
      }),
    );
    return { blackCount, whiteCount };
  };
  //初期盤面の状態にして、1:黒のオセロの色の石からスタートすることを意味する。
  const resetBoard = (): void => {
    setBoard(InitialBoard);
    setTurnColor(1);
  };
  //盤面上(x,y)に自分のオセロの石を置いたときに、8方向の石を反転させる。
  const flipStones = (x: number, y: number, turnColor: number, board: number[][]): number[][] => {
    const newBoard = structuredClone(board);
    for (const [dx, dy] of directions) {
      let distanceFromX = x + dx;
      let distanceFromY = y + dy;
      //反転する盤面を意味する。
      const stonesToFlip: number[][] = [];
      //8方向に対して相手の色が続いているループの場合は、stonesToFlipに格納する。
      while (
        isInBoard(distanceFromX, distanceFromY) &&
        newBoard[distanceFromY][distanceFromX] === OppoColor
      ) {
        stonesToFlip.push([distanceFromX, distanceFromY]);
        distanceFromX += dx;
        distanceFromY += dy;
      }
      //自分の石の色に挟まれた場合は、自分の石の色をstonesToFlipに格納して、newBoardを自分の石の色に変更する。
      if (
        isInBoard(distanceFromX, distanceFromY) &&
        board[distanceFromY][distanceFromX] === turnColor
      ) {
        for (const [fx, fy] of stonesToFlip) {
          newBoard[fy][fx] = turnColor;
        }
      }
    }
    return newBoard;
  };

  // onClickのクリックイイベントで取得したx,y座標に対して
  // オセロの石を配置する関数を意味する。
  const placeTurnColor = (x: number, y: number) => {
    const newBoard = structuredClone(board);
    if (
      isInBoard(x, y) &&
      isZero(x, y, board) &&
      hasArroundOppColor(x, y, turnColor) &&
      canSetTurnColor(x, y, turnColor, board)
    ) {
      newBoard[y][x] = turnColor;
      const flippedBoard = flipStones(x, y, turnColor, newBoard);
      setTurnColor(OppoColor);
      setBoard(flippedBoard);
    }
  };
  //パスをする関数を意味する。
  const passTurn = () => {
    setTurnColor(OppoColor);
    setBoard(board);
  };

  // //全ての盤面に石が載った場合は、ゲーム終了のメッセージを表示する。
  // const DisplayGameOver = () => (isOrNotGameOver(board) ? `ゲーム終了です。` : ``);

  const dispayGameResult = (board: number[][]): string => {
    if (isOrNotGameOver(board)) {
      const { blackCount, whiteCount } = countStones(board);
      if (blackCount > whiteCount) {
        return 'ゲーム終了です。黒の勝ちです。';
      } else if (blackCount < whiteCount) {
        return 'ゲーム終了です。白の勝ちです。';
      } else {
        return 'ゲーム終了です。引き分けです。';
      }
    }
    return 'ゲーム中です。';
  };

  return (
    <>
      <div className={styles.title}>オセロ</div>
      <div>現在のターン：{turnColor === 1 ? '黒⚫️' : '白⚪️'}</div>
      <div>------------------------------------------------</div>
      <div>黒色⚫️の数：{countStones(board).blackCount}</div>
      <div>白色⚪️の数：{countStones(board).whiteCount}</div>
      <div>------------------------------------------------</div>
      <div>
        <button className={styles.resetButton} onClick={passTurn}>
          パス
        </button>
      </div>
      <div>------------------------------------------------</div>
      <div>
        <button className={styles.resetButton} onClick={resetBoard}>
          リセット
        </button>
      </div>
      <div>------------------------------------------------</div>
      <div>{dispayGameResult(board)}</div>
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
                {canSetTurnColor(x, y, turnColor, board) && color === 0 && (
                  <div className={styles.stone} style={{ background: '#ff7f32' }} />
                )}
              </div>
            )),
          )}
        </div>
      </div>
    </>
  );
}
