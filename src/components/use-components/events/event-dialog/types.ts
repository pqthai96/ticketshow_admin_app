import { AddressInfo } from "@/components/address-selector";

export interface Ticket {
  id: string | null;
  title: string;
  description: string;
  price: string;
  type: string;
  quantity: string;
}

export interface FormErrors {
  [key: string]: string;
}

export interface EventFormData {
  title?: string;
  statusId: string;
  categoryId: any;
  organiserId: any;
  startedAt?: string;
  endedAt?: string;
  locationProvince?: string;
  locationDistrict?: string;
  locationWard?: string;
  locationAddress: string;
  venueName: string;
  content: string;
  type: boolean;
  seatPrice?: number | null;
  bookedSeats?: string | null;
  tickets?: Ticket[] | null;
  bannerImagePath?: string;
  positionImagePath?: string | null;
}

export interface EventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  event?: any;
  type: string;
}

export interface ImageUploaderProps {
  imagePreview: string;
  oldImagePreview: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  label: string;
  name: string;
  description: string;
  inputRef: React.RefObject<HTMLInputElement>;
}

export interface EventBasicInfoFormProps {
  selectedStatus: string;
  selectedCategory: string;
  categories: any[];
  isLoadingCategories: boolean;
  selectedOrganiser: string;
  organisers: any[];
  isLoadingOrganisers: boolean;
  onStatusChange: (value: any) => void;
  onCategoryChange: (value: any) => void;
  onOrganiserChange: (value: any) => void;
  errors: FormErrors;
  eventData?: any;
  type: string;
}

export interface EventLocationFormProps {
  address: string;
  venueName: string;
  onAddressChange: (newAddressInfo: AddressInfo) => void;
  onAddressDetailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVenueNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: FormErrors;
  eventData?: any;
}

export interface EventTypeSelectorProps {
  eventType: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface SeatDetailsFormProps {
  seatPrice: string;
  bookedSeats: string;
  onSeatPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: FormErrors;
  type?: string
}

export interface TicketManagementFormProps {
  tickets: Ticket[];
  onAddTicket: () => void;
  onRemoveTicket: (index: number) => void;
  onTicketChange: (index: number, field: string, value: any) => void;
  errors: FormErrors;
  isCreateMode: boolean;
}

export interface TicketFormItemProps {
  ticket: Ticket;
  index: number;
  onTicketChange: (index: number, field: string, value: any) => void;
  onRemoveTicket: (index: number) => void;
  errors: FormErrors;
  isCreateMode: boolean;
}