declare module '@jscad/stl-serializer' {
  export interface StlSerializeOptions {
    binary?: boolean;
    statusCallback?: (status: any) => void;
  }
  export function serialize(options: StlSerializeOptions, ...objects: any[]): ArrayBuffer[] | string[];
}
