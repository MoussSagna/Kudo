import { useEffect, useRef } from 'react';
import { Dimensions } from 'react-native';

import type { GameState } from '../game/state';
import { buildStressPlan, type StressMove } from './stressPlan';
import { trayProbes, type PieceReading } from './trayProbe';

/** Time for the animations of a move, clear included, to be over. */
const SETTLE_MS = 1600;
const START_MS = 2500;
const SPACED_MS = 800;
const QUICK_MS = 80;
/** How far from rest a value may be once the animations are over. */
const POSITION_TOLERANCE = 0.5;
const SCALE_TOLERANCE = 0.01;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function read(index: number): Promise<PieceReading | null> {
  const probe = trayProbes.get(index);
  return probe ? new Promise((resolve) => probe.read(resolve)) : Promise.resolve(null);
}

/**
 * Compares what the tray displays with the game: every piece of the state must be mounted,
 * on screen, at its place and at its normal scale. Returns one message per difference.
 */
async function findDivergences(actual: GameState, expected: GameState): Promise<string[]> {
  const found: string[] = [];
  const ids = (game: GameState) => game.tray.map((piece) => piece?.id ?? '-').join(',');
  if (ids(actual) !== ids(expected) || actual.score !== expected.score) {
    found.push(
      `état: plateau [${ids(actual)}] score ${actual.score}, attendu [${ids(expected)}] score ${expected.score}`,
    );
  }
  const screen = Dimensions.get('window');
  for (let index = 0; index < actual.tray.length; index++) {
    const piece = actual.tray[index];
    const probe = trayProbes.get(index);
    if (!piece) {
      if (probe) {
        found.push(`emplacement ${index}: pièce ${probe.pieceId} affichée, absente de l'état`);
      }
      continue;
    }
    if (!probe || probe.pieceId !== piece.id) {
      found.push(`emplacement ${index}: pièce ${piece.id} de l'état, affichée: ${probe?.pieceId ?? 'aucune'}`);
      continue;
    }
    const reading = await read(index);
    if (!reading) {
      found.push(`emplacement ${index}: pièce ${piece.id} non mesurable`);
      continue;
    }
    const { dragX, dragY, lift, scale, box } = reading;
    const isAtRest =
      Math.abs(dragX) <= POSITION_TOLERANCE &&
      Math.abs(dragY) <= POSITION_TOLERANCE &&
      Math.abs(lift) <= POSITION_TOLERANCE &&
      Math.abs(scale - 1) <= SCALE_TOLERANCE;
    const isOnScreen =
      box !== null && box.width > 0 && box.y > screen.height / 2 && box.y + box.height <= screen.height;
    if (!isAtRest || !isOnScreen) {
      found.push(
        `emplacement ${index}: pièce ${piece.id} hors repos — décalage (${dragX.toFixed(1)}, ${(dragY - lift).toFixed(1)}), échelle ${scale.toFixed(2)}, cadre ${box ? `${box.x.toFixed(0)},${box.y.toFixed(0)} ${box.width.toFixed(0)}×${box.height.toFixed(0)}` : 'aucun'}`,
      );
    }
  }
  return found;
}

/**
 * Development only (EXPO_PUBLIC_SAMPLE_GAME=stress): plays a long scripted game by itself,
 * through the code of a real release, with moves chained faster than the animations, refused
 * and cancelled gestures, and pieces held during other moves. After every draw, and after every
 * move when they are spaced, it compares the tray on screen with the game and logs a line
 * starting with `[KUBO-DIVERGENCE]` for every difference.
 */
export function useStressTest(enabled: boolean, game: GameState) {
  const latestGame = useRef(game);

  useEffect(() => {
    latestGame.current = game;
  });

  useEffect(() => {
    if (!enabled) {
      return;
    }
    let cancelled = false;
    let moveNumber = 0;
    let divergences = 0;

    const check = async (expected: GameState, label: string) => {
      const found = await findDivergences(latestGame.current, expected);
      divergences += found.length;
      for (const message of found) {
        console.log(`[KUBO-DIVERGENCE] coup ${moveNumber} (${label}) — ${message}`);
      }
    };
    const release = ({ trayIndex, col, row }: StressMove) => {
      moveNumber += 1;
      trayProbes.get(trayIndex)?.release(col, row);
    };

    const run = async () => {
      const plan = buildStressPlan();
      await wait(START_MS);
      for (let cycle = 0; cycle < plan.length && !cancelled; cycle++) {
        const { pattern, moves } = plan[cycle];
        const [first, second, third] = moves;
        switch (pattern) {
          case 'spaced':
            for (const move of moves) {
              release(move);
              await wait(SPACED_MS);
              if (move !== third) {
                await check(move.result.next, 'coup espacé');
              }
            }
            break;
          case 'burst':
            moves.forEach(release);
            break;
          case 'refused':
            if (first.refused) {
              trayProbes.get(first.trayIndex)?.release(first.refused.col, first.refused.row);
            }
            release(first);
            await wait(QUICK_MS);
            release(second);
            await wait(QUICK_MS);
            release(third);
            break;
          case 'cancelled':
            trayProbes.get(third.trayIndex)?.release(third.col, third.row, false);
            release(first);
            release(second);
            await wait(QUICK_MS);
            release(third);
            break;
          case 'held':
            trayProbes.get(third.trayIndex)?.hold(third.col, third.row);
            await wait(QUICK_MS);
            release(first);
            release(second);
            await wait(QUICK_MS);
            moveNumber += 1;
            trayProbes.get(third.trayIndex)?.letGo(third.col, third.row);
            break;
        }
        await wait(SETTLE_MS);
        await check(third.result.next, `tirage ${cycle + 1}, ${pattern}`);
        console.log(`[KUBO-STRESS] tirage ${cycle + 1} (${pattern}) contrôlé, coup ${moveNumber}`);
      }
      if (!cancelled) {
        console.log(
          `[KUBO-STRESS] fin: ${moveNumber} coups, ${plan.length} tirages, ${divergences} divergences`,
        );
      }
    };
    run();

    return () => {
      cancelled = true;
    };
  }, [enabled]);
}
