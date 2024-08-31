import React, { useEffect } from "react";
import AppNavigation from "./src/navigation/AppNavigation";
import { SQLiteProvider } from "expo-sqlite";
import * as SQLite from "expo-sqlite";

export default function App() {
  const feth = async () => {
    const db = await SQLite.openDatabaseAsync("cashier.db");

    await db.execAsync(`
    

            CREATE TABLE IF NOT EXISTS stores (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR NOT NULL,
                owner VARCHAR NOT NULL
            );

            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR NOT NULL,
                price INTEGER NOT NULL,
                stock INTEGER NOT NULL,
                countSelling INTEGER DEFAULT 0,
                image TEXT
            );
            
            CREATE TABLE IF NOT EXISTS transactions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    codeTransaction VARCHAR NOT NULL,
                    productId INTEGER,
                    quantity INTEGER NOT NULL,
                    totalPrice INTEGER NOT NULL,
                    timestamps DATETIME DEFAULT (datetime('now', 'localtime')),
                    FOREIGN KEY(productId) REFERENCES products(id)
            )


        `);
    console.log("selesai 1");
  };

  useEffect(() => {
    feth();
  }, []);

  return (
    <SQLiteProvider
      databaseName="cashier.db"
      assetSource={{ assetId: require("./cashier.db") }}
    >
      <AppNavigation />
    </SQLiteProvider>
  );
}
