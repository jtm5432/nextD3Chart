// react-table-config.d.ts
import {
    UsePaginationInstanceProps,
    UsePaginationState,
    UsePaginationOptions
  } from 'react-table';
  
  declare module 'react-table' {
    export interface TableOptions<D extends Record<string, unknown>> extends UsePaginationOptions<D> { }
  
    export interface TableInstance<D extends Record<string, unknown>> extends UsePaginationInstanceProps<D> { }
  
    export interface TableState<D extends Record<string, unknown>> extends UsePaginationState<D> { }
  }
  