export interface VoucherDialogProps {
  isOpen: boolean;
  onClose: () => void;
  voucher?: any;
  type: "create" | "edit";
}

export interface FormErrors {
  [key: string]: string | null;
}

export interface VoucherFormData {
  id?: number | null;
  code: string;
  name: string;
  description: string;
  value: number | string;
  minOrderTotal: number | string;
  startedAt: string;
  endedAt: string;
}

export interface VoucherDTO {
  id: number;
  code: string;
  name: string;
  description: string;
  value: number;
  minOrderTotal: number;
  startedAt: Date | string;
  endedAt: Date | string;
}