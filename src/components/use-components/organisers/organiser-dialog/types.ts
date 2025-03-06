export interface OrganiserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  organiser?: any;
  type: "create" | "edit";
}

export interface FormErrors {
  [key: string]: string;
}

export interface OrganiserFormData {
  id?: number | null;
  name: string;
  description: string;
  avatarImagePath?: string;
}

export interface UserDTO {
  id: number;
  username: string;
  email?: string;
}

export interface OrganiserDTO {
  id: number;
  name: string;
  description: string;
  avatarImagePath: string;
  events?: any[];
}