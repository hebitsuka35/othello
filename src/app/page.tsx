'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [turnColor, setTurnColor] = useState(1); // 1: 黒, 2: 白
  const [winnerMessage, setWinnerMessage] = useState('');
  const [passCount, setPassCount] = useState(0);
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

  const isInBoard = (x: number, y: number) => x >= 0 && x < 8 && y >= 0 && y < 8;

  const isValidMove = (x: number, y: number, board: number[][]) => {
    if (board[y][x] !== 0) return false;
    const OppoColor = 3 - turnColor;

    for (const [dx, dy] of directions) {
      let newX = x + dx,
        newY = y + dy;
      let foundOpponent = false;

      while (isInBoard(newX, newY) && board[newY][newX] === OppoColor) {
        foundOpponent = true;
        newX += dx;
        newY += dy;
      }

      if (foundOpponent && isInBoard(newX, newY) && board[newY][newX] === turnColor) {
        return true;
      }
    }
    return false;
  };

  const flipAllDirections = (x: number, y: number, newBoard: number[][]) => {
    const OppoColor = 3 - turnColor;

    for (const [dx, dy] of directions) {
      let newX = x + dx,
        newY = y + dy;
      const flipPositions: [number, number][] = [];

      while (isInBoard(newX, newY) && newBoard[newY][newX] === OppoColor) {
        flipPositions.push([newX, newY]);
        newX += dx;
        newY += dy;
      }

      if (isInBoard(newX, newY) && newBoard[newY][newX] === turnColor) {
        flipPositions.forEach(([flipX, flipY]) => {
          newBoard[flipY][flipX] = turnColor;
        });
      }
    }
  };

  const countStones = (board: number[][]) => {
    let blackCount = 0,
      whiteCount = 0;

    board.forEach((row) =>
      row.forEach((cell) => {
        if (cell === 1) blackCount++;
        if (cell === 2) whiteCount++;
      }),
    );

    return { blackCount, whiteCount };
  };

  const hasValidMove = (color: number, board: number[][]) => {
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        if (isValidMove(x, y, board)) return true;
      }
    }
    return false;
  };

  const checkWinner = (board: number[][]) => {
    const { blackCount, whiteCount } = countStones(board);
    const blackHasMove = hasValidMove(1, board);
    const whiteHasMove = hasValidMove(2, board);

    if (!blackHasMove && !whiteHasMove) {
      if (blackCount > whiteCount) return '黒の勝ちです。リセットボタンを押してください。';
      if (whiteCount > blackCount) return '白の勝ちです。リセットボタンを押してください。';
      return '引き分けです。リセットボタンを押してください。';
    }
    return null;
  };

  const passTurn = () => {
    if (winnerMessage) return;

    const nextTurn = 3 - turnColor;
    if (hasValidMove(nextTurn, board)) {
      setTurnColor(nextTurn);
      setPassCount(0); // 有効な手があればパスカウントをリセット
    } else {
      const newPassCount = passCount + 1;
      setPassCount(newPassCount);

      if (newPassCount >= 2) {
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

    const newBoard = structuredClone(board);
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

    console.log('9999');
  };

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
