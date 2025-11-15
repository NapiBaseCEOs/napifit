import { NextResponse } from "next/server";
import { getDB, testConnection } from "@/lib/d1";

export async function GET(request: Request) {
  const db = getDB(request);
  
  const info = {
    dbAvailable: db !== null,
    dbType: db ? typeof db : null,
    globalThisDB: typeof globalThis !== 'undefined' ? !!(globalThis as any).DB : false,
    globalThisEnvDB: typeof globalThis !== 'undefined' ? !!(globalThis as any).env?.DB : false,
    processEnvDB: typeof process !== 'undefined' ? !!(process as any).env?.DB : false,
    testConnection: false,
  };
  
  if (db) {
    try {
      info.testConnection = await testConnection(request);
    } catch (error) {
      info.testConnection = false;
      console.error('Test connection error:', error);
    }
  }
  
  return NextResponse.json(info);
}

