import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';

// 🎯 Hook personalizado para formularios con validación Zod

interface UseFormValidationProps<T extends Record<string, any>> {
  schema: z.ZodSchema<T>;
  onSubmit?: (data: T) => void | Promise<void>;
  onError?: (errors: any) => void;
  showToastOnError?: boolean;
  defaultValues?: Partial<T>;
  mode?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
}

export function useFormValidation<T extends Record<string, any>>({
  schema,
  defaultValues,
  mode = 'onChange'
}: UseFormValidationProps<T>) {
  const form = useForm<T>({
    resolver: zodResolver(schema),
    mode,
    defaultValues,
  });

  return form;
}

// 🎨 Hook simplificado para formularios con UI
export function useFormWithUI<T extends Record<string, any>>(props: UseFormValidationProps<T>) {
  const form = useFormValidation(props);
  return form;
}

// 📝 Hook específico para formularios de autenticación
export function useAuthForm<T extends Record<string, any>>(props: UseFormValidationProps<T>) {
  const form = useFormValidation(props);
  return form;
}

// 🔄 Hook para formularios con auto-guardado
export function useAutoSaveForm<T extends Record<string, any>>(props: UseFormValidationProps<T>) {
  const form = useFormValidation(props);
  return form;
}

// 📋 Utilidades para manejo de errores de formulario

export const getFieldError = (errors: any, fieldName: string): string | undefined => {
  return errors?.[fieldName]?.message;
};

export const hasFieldError = (errors: any, fieldName: string): boolean => {
  return !!errors?.[fieldName];
};

export const getFirstError = (errors: any): string | undefined => {
  const firstError = Object.values(errors)[0] as any;
  return firstError?.message;
};

// 🎨 Utilidades para estilos de campos con errores

export const getFieldClassName = (errors: any, fieldName: string, baseClassName: string, errorClassName: string = 'border-red-500'): string => {
  return hasFieldError(errors, fieldName) 
    ? `${baseClassName} ${errorClassName}`
    : baseClassName;
};

// Importaciones necesarias para React