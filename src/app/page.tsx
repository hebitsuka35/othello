'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  //// ------変数宣言------
  const boadsize = 8;
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
  const directions = [
    [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1],
  ];

  //// ------状態管理宣言------
  const [turnColor, setTurnColor] = useState(1);
  const OppoColor = 3 - turnColor;
  const [board, setBoard] = useState(InitialBoard);
  const [passCount, setPassCount] = useState(0);
  const [winnerMessage, setWinnerMessage] = useState('');

  //// ------関数宣言------
  const isInBoard = (x: number, y: number): boolean => x >= 0 && x < boadsize && y >= 0 && y < boadsize;

  const isNotZero = (board: number[][], x: number, y: number): boolean => board[y][x] === 0;

  const isValidMove = (x: number, y: number, board: number[][]) => {
    if (!isNotZero(board, x, y)) return false;

    for (const [dx, dy] of directions) {
      let distanceFromX = x + dx, distanceFromY = y + dy;
      let foundOpponent = false;
      while (isInBoard(distanceFromX, distanceFromY) && board[distanceFromY][distanceFromX] === OppoColor) {
        foundOpponent = true;
        distanceFromX += dx;
        distanceFromY += dy;
      }
      if (foundOpponent && isInBoard(distanceFromX, distanceFromY) && board[distanceFromY][distanceFromX] === turnColor) {
        return true;
      }
    }
    return false;
  };

  const flipAllDirections = (x: number, y: number, newBoard: number[][]) => {
    for (const [dx, dy] of directions) {
      let distanceFromX = x + dx, distanceFromY = y + dy;
      const flipPositions: [number, number][] = [];
      while (isInBoard(distanceFromX, distanceFromY) && newBoard[distanceFromY][distanceFromX] === OppoColor) {
        flipPositions.push([distanceFromX, distanceFromY]);
        distanceFromX += dx;
        distanceFromY += dy;
      }
      if (isInBoard(distanceFromX, distanceFromY) && newBoard[distanceFromY][distanceFromX] === turnColor) {
        for (let i = 0; i < flipPositions.length; i++) {
          const [flipX, flipY] = flipPositions[i];
          newBoard[flipY][flipX] = turnColor;
        }
      }
    }
  };

  const hasValidMove = (color: number, board: number[][]) => {
    for (let y = 0; y < boadsize; y++) {
      for (let x = 0; x < boadsize; x++) {
        if (isValidMove(x, y, board)) return true;
      }
    }
    return false;
  };

  const countStones = (board: number[][]) => {
    let blackCount = 0, whiteCount = 0;
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] === 1) blackCount++;
        if (board[i][j] === 2) whiteCount++;
      }
    }
    return { blackCount, whiteCount };
  };

  const checkWinner = (board: number[][]) => {
    const { blackCount, whiteCount } = countStones(board);
    const blackHasMove = hasValidMove(1, board);
    const whiteHasMove = hasValidMove(2, board);

    if (!blackHasMove && !whiteHasMove) {
      let resultMessage = '';
      if (blackCount > whiteCount) resultMessage = '黒の勝ちです。リセットボタンを押してください。';
      if (whiteCount > blackCount) resultMessage = '白の勝ちです。リセットボタンを押してください。';
      if (blackCount === whiteCount) resultMessage = '引き分けです。リセットボタンを押してください。';

      setWinnerMessage(resultMessage);
      return resultMessage;
    }
    return null;
  };

  const isBoardFull = (board: number[][]) => {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] === 0) return false;
      }
    }
    return true;
  };
  

  const passTurn = () => {
    if (winnerMessage) return;  // ゲームがすでに終了している場合は何もしない
  
    const nextTurn = 3 - turnColor;  // 相手のターン
  
    // 相手が動ける場合、ターンを交代
    if (hasValidMove(nextTurn, board)) {
      setTurnColor(nextTurn);
      setPassCount(0);  // パスカウントをリセット
    } else {
      // 相手が動けない場合、パスカウントを増加
      const newPassCount = passCount + 1;
      setPassCount(newPassCount);
  
      // パスが2回連続で続いた場合、またはボードが埋まった場合に勝者をチェック
      if (newPassCount >= 2 || isBoardFull(board)) {
        const result = checkWinner(board);  // 勝者を判定
        if (result) setWinnerMessage(result);  // 勝者メッセージを設定
      } else {
        // パスが1回だけなら次のターンへ
        setTurnColor(nextTurn);
      }
    }
  };
  
  

  const onClick = (x: number, y: number) => {
    if (board[y][x] !== 0) return;
    if (!isValidMove(x, y, board)) return;

    const newBoard = structuredClone(board);
    newBoard[y][x] = turnColor;
    flipAllDirections(x, y, newBoard);
    setBoard(newBoard);

    const nextTurn = 3 - turnColor;
    if (hasValidMove(nextTurn, newBoard)) {
      setTurnColor(nextTurn);
      setPassCount(0);
    } else {
      passTurn();
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
