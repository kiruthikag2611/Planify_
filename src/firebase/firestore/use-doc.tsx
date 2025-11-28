
'use client';

import {
  doc,
  onSnapshot,
  DocumentReference,
  DocumentData,
  FirestoreError,
  DocumentSnapshot,
} from 'firebase/firestore';
import { useEffect, useState, useMemo } from 'react';
import { useFirestore } from '../provider';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

interface UseDocOptions<T> {
  initialData?: T;
}

export function useDoc<T>(
  pathOrRef: string | DocumentReference | null,
  options?: UseDocOptions<T>
) {
  const firestore = useFirestore();
  const [data, setData] = useState<T | null>(options?.initialData || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  const memoizedRef = useMemo(() => {
    if (!pathOrRef || !firestore) return null;
    if (typeof pathOrRef === 'string') {
      return doc(firestore, pathOrRef);
    }
    return pathOrRef;
  }, [pathOrRef, firestore]);

  useEffect(() => {
    if (!memoizedRef) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      memoizedRef,
      (snapshot: DocumentSnapshot<DocumentData>) => {
        if (snapshot.exists()) {
          const docData = snapshot.data();
          // Ensure we don't cause a re-render if the data is the same
          setData(prevData => {
            const newData = { ...docData, id: snapshot.id } as T;
            if (JSON.stringify(prevData) === JSON.stringify(newData)) {
              return prevData;
            }
            return newData;
          });
        } else {
          setData(null);
        }
        setLoading(false);
        setError(null);
      },
      (err: FirestoreError) => {
        const permissionError = new FirestorePermissionError({
          path: memoizedRef.path,
          operation: 'get',
        });
        errorEmitter.emit('permission-error', permissionError);

        setError(err);
        setLoading(false);
        console.error(`Error fetching document: ${err.message}`);
      }
    );

    return () => unsubscribe();
  }, [memoizedRef]);

  return { data, loading, error };
}
