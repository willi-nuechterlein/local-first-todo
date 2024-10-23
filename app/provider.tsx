"use client";

import { IdbFs, PGlite } from "@electric-sql/pglite";
import { live, PGliteWithLive } from "@electric-sql/pglite/live";
import { PGliteProvider } from "@electric-sql/pglite-react";
import { electricSync } from "@electric-sql/pglite-sync";
import { ReactNode, useEffect, useState } from "react";

export function Providers({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<PGliteWithLive | undefined>(undefined);

  useEffect(() => {
    async function initDb() {
      if (db) {
        return;
      }
      const newDb = await PGlite.create({
        extensions: { live, electric: electricSync() },
        fs: new IdbFs("local-first-todo"),
      });

      await newDb.exec(`
        CREATE TABLE IF NOT EXISTS todos (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          completed BOOLEAN DEFAULT FALSE
        );
      `);

      const shape = await newDb.electric.syncShapeToTable({
        shape: { url: "http://localhost:3000/v1/shape/todos" },
        table: "todos",
        primaryKey: ["id"],
      });

      setDb(newDb);

      return () => {
        shape.unsubscribe();
      };
    }

    initDb();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!db) {
    return null;
  }
  return <PGliteProvider db={db}>{children}</PGliteProvider>;
}
