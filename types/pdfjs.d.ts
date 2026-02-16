declare module 'pdfjs-dist/build/pdf.worker.min.mjs' {
  const worker: any;
  export default worker;
}

declare module 'pdfjs-dist' {
  export * from 'pdfjs-dist/types/src/display/api';
}
