import { NextResponse } from "next/server";
import { getDB, testConnection } from "@/lib/d1";

export async function GET(request: Request) {
  // D1 binding'i tüm olası yollardan kontrol et
  const req = request as any;
  
  const info: any = {
    dbAvailable: false,
    dbType: null,
    bindingLocations: {
      requestEnvDB: !!(req.env?.DB),
      requestCfDB: !!(req.cf?.DB),
      globalThisDB: typeof globalThis !== 'undefined' ? !!(globalThis as any).DB : false,
      globalThisEnvDB: typeof globalThis !== 'undefined' ? !!(globalThis as any).env?.DB : false,
      processEnvDB: typeof process !== 'undefined' ? !!(process as any).env?.DB : false,
      requestKeys: request ? Object.keys(req).filter(k => k !== 'headers' && k !== 'body' && k !== 'url') : [],
    },
    testConnection: false,
    error: null,
  };
  
  // D1 binding'i al
  const db = getDB(request);
  
  if (db) {
    info.dbAvailable = true;
    info.dbType = typeof db;
    info.dbMethods = Object.keys(db).filter(k => typeof (db as any)[k] === 'function');
    
    try {
      info.testConnection = await testConnection(request);
    } catch (error: any) {
      info.testConnection = false;
      info.error = error?.message || String(error);
      console.error('Test connection error:', error);
    }
  } else {
    info.error = 'D1 database binding not found in any location';
  }
  
  return NextResponse.json(info);
}

