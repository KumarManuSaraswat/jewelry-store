import { useMemo, useSyncExternalStore } from "react";
import {
  getSessionSnapshot,
  parseSession,
  subscribeToSession,
} from "../utils/auth";

const serverSnapshot = () => null;

export default function useUserInfo() {
  const snapshot = useSyncExternalStore(
    subscribeToSession,
    getSessionSnapshot,
    serverSnapshot,
  );
  return useMemo(() => parseSession(snapshot), [snapshot]);
}
