import React, { useEffect } from "react";
import AppNavigation from "./src/navigation/AppNavigation";
import { SQLiteProvider } from "expo-sqlite";
import * as SQLite from "expo-sqlite";

export default function App() {
  const fetch = async () => {
    const db = await SQLite.openDatabaseAsync("cashier.db");
  
    try {
      await db.execAsync("BEGIN TRANSACTION;"); 
  
//       await db.execAsync(`
// INSERT INTO transactions (codeTransaction, productId, quantity, totalPrice, timestamps) VALUES 
// ('TX-20240810-01', 1, 2, 4000, '2024-08-10 10:15:00'),
// ('TX-20240810-02', 2, 1, 2000, '2024-08-10 11:30:00'),
// ('TX-20240811-01', 1, 3, 6000, '2024-08-11 09:20:00'),
// ('TX-20240811-02', 3, 1, 1500, '2024-08-11 15:45:00'),
// ('TX-20240812-01', 4, 5, 10000, '2024-08-12 13:10:00'),
// ('TX-20240813-01', 2, 2, 5000, '2024-08-13 08:30:00'),
// ('TX-20240814-01', 3, 1, 2500, '2024-08-14 14:50:00'),
// ('TX-20240814-02', 1, 4, 8000, '2024-08-14 16:00:00'),
// ('TX-20240815-01', 4, 2, 7000, '2024-08-15 12:30:00'),
// ('TX-20240816-01', 2, 1, 3000, '2024-08-16 11:45:00'),
// ('TX-20240817-01', 3, 3, 9000, '2024-08-17 10:05:00'),
// ('TX-20240818-01', 1, 2, 4000, '2024-08-18 14:20:00'),
// ('TX-20240819-01', 2, 1, 2000, '2024-08-19 13:35:00'),
// ('TX-20240820-01', 4, 3, 9000, '2024-08-20 15:15:00'),
// ('TX-20240821-01', 3, 2, 5000, '2024-08-21 17:40:00'),
// ('TX-20240822-01', 1, 1, 2000, '2024-08-22 09:50:00'),
// ('TX-20240823-01', 4, 2, 7000, '2024-08-23 12:05:00'),
// ('TX-20240824-01', 2, 4, 10000, '2024-08-24 18:25:00'),
// ('TX-20240825-01', 3, 1, 2500, '2024-08-25 11:10:00'),
// ('TX-20240826-01', 1, 3, 6000, '2024-08-26 14:55:00'),
// ('TX-20240827-01', 2, 2, 5000, '2024-08-27 13:30:00'),
// ('TX-20240828-01', 3, 1, 1500, '2024-08-28 15:40:00'),
// ('TX-20240829-01', 4, 5, 10000, '2024-08-29 10:15:00');

//       `);


      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS stores (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name VARCHAR NOT NULL,
          owner VARCHAR NOT NULL
        );
      `);
  
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name VARCHAR NOT NULL,
          price INTEGER NOT NULL,
          stock INTEGER NOT NULL,
          countSelling INTEGER DEFAULT 0,
          image TEXT
        );
      `);
      
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS transactions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          codeTransaction VARCHAR NOT NULL,
          productId INTEGER,
          quantity INTEGER NOT NULL,
          totalPrice INTEGER NOT NULL,
          timestamps DATETIME DEFAULT (datetime('now', 'localtime')),
          FOREIGN KEY(productId) REFERENCES products(id)
        );
      `);
  
      await db.execAsync("COMMIT;");
      console.log("Tables created successfully.");
    } catch (error) {
      await db.execAsync("ROLLBACK;");
      console.error("Error creating tables:", error.message);
    } finally {
      console.log("Database setup complete.");
    }
  };
  
  useEffect(() => {
    fetch();
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
