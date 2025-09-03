import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Función utilitaria para combinar clases CSS de manera inteligente
 * Utiliza clsx para manejar clases condicionales y twMerge para resolver conflictos de Tailwind
 * 
 * @param inputs - Array de clases CSS, objetos condicionales o valores falsy
 * @returns String con las clases CSS combinadas y optimizadas
 * 
 * Ejemplos de uso:
 * cn('px-2 py-1', 'text-sm') // 'px-2 py-1 text-sm'
 * cn('px-2', { 'py-1': true, 'text-lg': false }) // 'px-2 py-1'
 * cn('px-2 px-4') // 'px-4' (twMerge resuelve el conflicto)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Función para formatear texto en formato título (primera letra mayúscula)
 * @param str - String a formatear
 * @returns String formateado
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Función para generar IDs únicos
 * @param prefix - Prefijo opcional para el ID
 * @returns String con ID único
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}