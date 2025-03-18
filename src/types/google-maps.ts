// src/types/google-maps.d.ts
declare global {
    interface Window {
      HelloNeighbor?: {
        selectProducer: (id: number) => void;
      };
      google: any;
      [key: string]: any; // For dynamic callback names
    }
  }
  
  export {};