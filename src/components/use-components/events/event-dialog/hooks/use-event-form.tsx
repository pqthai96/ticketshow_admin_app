// hooks/use-event-form.ts
import { useState, useEffect } from "react";
import { useImageUpload } from "./use-image-upload";
import axiosClient from "@/api-client/api-client";
import { FormErrors, EventFormData, Ticket } from "../types";
import { AddressInfo } from "@/components/address-selector";

export const useEventForm = (event: any, type: string) => {
  // Form validation states
  const [errors, setErrors] = useState<FormErrors>({});
  const [contentData, setContentData] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  // Category state
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<any>(event?.categoryDTO.id || "");
  const [selectedStatus, setSelectedStatus] = useState<string>(event?.statusDTO?.id || "1");

  // Organiser state
  const [organisers, setOrganisers] = useState<any[]>([]);
  const [isLoadingOrganisers, setIsLoadingOrganisers] = useState(true);
  const [selectedOrganiser, setSelectedOrganiser] = useState<any>(event?.organiserDTO.id || "");

  // Default event type to "seat" for create mode, otherwise use event.type (true = ticket, false = seat)
  const [eventType, setEventType] = useState<string>(
    type === "create" ? "seat" : (event?.type ? "ticket" : "seat")
  );

  const [seatPrice, setSeatPrice] = useState<string>(event?.seatPrice?.toString() || "");
  const [bookedSeats, setBookedSeats] = useState<string>(event?.bookedSeats || "");

  // Address states
  const [addressInfo, setAddressInfo] = useState<AddressInfo | null>(null);
  const [address, setAddress] = useState<string>(event?.locationAddress || "");
  const [venueName, setVenueName] = useState<string>(event?.venueName || "");

  // Image hooks
  const bannerImageUpload = useImageUpload({ isBanner: true, setErrors });
  const positionImageUpload = useImageUpload({ isBanner: false, setErrors });

  // Fetch categories and organisers when component mounts
  useEffect(() => {
    fetchCategories();
    fetchOrganisers();
  }, []);

  // Fetch categories from API
  const fetchCategories = () => {
    setIsLoadingCategories(true);
    try {
      axiosClient.get('/category').then((resp: any) => setCategories(resp));
    } catch (error) {
      console.error("Error fetching categories:", error);
      setErrors(prev => ({ ...prev, category: "Failed to load categories" }));
    } finally {
      setIsLoadingCategories(false);
    }
  };

  // Handle category change
  const handleCategoryChange = (event: any) => {
    setSelectedCategory(event.target.value);
    clearError('category');
  };

  // Fetch organisers from API
  const fetchOrganisers = () => {
    setIsLoadingOrganisers(true);
    try {
      axiosClient.get('/organiser').then((resp: any) => setOrganisers(resp));
    } catch (error) {
      console.error("Error fetching organisers:", error);
      setErrors(prev => ({ ...prev, organiser: "Failed to load organisers" }));
    } finally {
      setIsLoadingOrganisers(false);
    }
  }

  const handleOrganiserChange = (event: any) => {
    console.log("handleOrganiserChange:" + event.target.value);
    setSelectedOrganiser(event.target.value);
    clearError('organiser');
  }

  // Handle status change
  const handleStatusChange = (event: any) => {
    setSelectedStatus(event.target.value);
    clearError('status');
  };

  // Handle event type change
  const handleEventTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEventType(e.target.value);

    // Clear related errors when event type changes
    const newErrors = { ...errors };
    if (e.target.value === "seat") {
      delete newErrors.positionImage;
      delete newErrors.tickets;
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith("ticket_")) {
          delete newErrors[key];
        }
      });
    } else {
      delete newErrors.seatPrice;
      delete newErrors.bookedSeats;
    }

    setErrors(newErrors);
  };

  // Handle seatPrice change
  const handleSeatPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSeatPrice(e.target.value);
    clearError('seatPrice');
  };

  // Reset state when event changes
  useEffect(() => {
    if (event) {
      setContentData(event.content || "");
      setAddress(event?.locationAddress || "");
      setVenueName(event?.venueName || "");
      setSeatPrice(event?.seatPrice?.toString() || "");
      setBookedSeats(event?.bookedSeats || "");
      setEventType(event?.type ? "ticket" : "seat");
      bannerImageUpload.setImagePreview(event?.bannerImagePath || "");
      positionImageUpload.setImagePreview(event?.positionImagePath || "");
      bannerImageUpload.setOldImagePreview(event?.bannerImagePath || "");
      positionImageUpload.setOldImagePreview(event?.positionImagePath || "");
      setSelectedCategory(event?.categoryDTO?.id || "");
      setSelectedStatus(event?.statusDTO?.id || "1");

      setIsLoading(true);
      setErrors({});

      // Initialize tickets from event if available
      if (event.type === true) {
        axiosClient.get(`/ticket/event/${event.id}`).then((resp: any) => {
          setTickets(resp);
          setIsLoading(false);
        }).catch(error => {
          console.error("Error fetching tickets:", error);
          setIsLoading(false);
        });
      } else {
        // Initialize with empty ticket for create mode
        if (type === "create" && eventType === "ticket") {
          setTickets([{
            id: null,
            title: "",
            description: "",
            price: "",
            type: "",
            quantity: ""
          }]);
        } else {
          setTickets([]);
        }
        setIsLoading(false);
      }
    } else {
      // Set default for create mode
      if (type === "create") {
        setEventType("seat");
        bannerImageUpload.resetImage();
        positionImageUpload.resetImage();
        setSelectedCategory("");
        setSelectedStatus("1");
      }
    }
  }, [event, type]);

  // Handle address change from AddressSelector
  const handleAddressChange = (newAddressInfo: AddressInfo) => {
    setAddressInfo(newAddressInfo);

    // Clear address-related errors
    clearError('province');
    clearError('district');
    clearError('ward');
  };

  // Handler for address details
  const handleAddressDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
    clearError('address');
  };

  // Handler venue name
  const handleVenueNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVenueName(e.target.value);
    clearError('venueName');
  };

  // Ticket management functions
  const handleAddTicket = () => {
    setTickets([
      ...tickets,
      {
        id: null,
        title: "",
        description: "",
        price: "",
        type: "",
        quantity: ""
      }
    ]);
  };

  const handleRemoveTicket = (index: number) => {
    const updatedTickets = [...tickets];
    updatedTickets.splice(index, 1);
    setTickets(updatedTickets);
  };

  const handleTicketChange = (index: number, field: string, value: any) => {
    const updatedTickets = [...tickets];
    updatedTickets[index] = {
      ...updatedTickets[index],
      [field]: value
    };
    setTickets(updatedTickets);
    clearError(`ticket_${index}_${field}`);
  };

  // Clear a specific error
  const clearError = (fieldName: string) => {
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  // Helper function to display field error
  const getFieldError = (fieldName: string) => {
    return errors[fieldName] ? (
      <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p>
    ) : null;
  };

  // Validate form fields
  const validateForm = (formData: EventFormData): boolean => {
    const newErrors: FormErrors = {};

    // Validate basic event info
    if (!formData.title?.trim()) {
      newErrors.title = "Event title is required";
    }

    if (!formData.startedAt) {
      newErrors.startedAt = "Start date is required";
    }

    if (!formData.endedAt) {
      newErrors.endedAt = "End date is required";
    } else if (formData.startedAt && new Date(formData.startedAt) > new Date(formData.endedAt)) {
      newErrors.endedAt = "End date cannot be before start date";
    }

    // Validate category
    if (!formData.categoryId) {
      newErrors.category = "Category is required";
    }

    // Validate organiser
    if (!formData.organiserId) {
      newErrors.organiser = "Organiser is required";
    }

    // Validate address selection
    if (!addressInfo) {
      newErrors.address_selector = "Please select province, district and ward";
    } else {
      if (!addressInfo.province_id || !addressInfo.province_name) {
        newErrors.province = "Province is required";
      }

      if (!addressInfo.district_id || !addressInfo.district_name) {
        newErrors.district = "District is required";
      }

      if (!addressInfo.ward_id || !addressInfo.ward_name) {
        newErrors.ward = "Ward is required";
      }
    }

    // Validate address details
    if (!address?.trim()) {
      newErrors.address = "Address details are required";
    }

    // Validate venue
    if (!venueName?.trim()) {
      newErrors.venueName = "Venue name is required";
    }

    // Validate content
    if (!contentData?.trim()) {
      newErrors.content = "Event content is required";
    }

    // Banner image validation
    if (type === "create" && !bannerImageUpload.image && !bannerImageUpload.imagePreview) {
      newErrors.bannerImage = "Banner image is required";
    }

    // Validate event type specific fields
    if (eventType === "seat") {
      // Validate seat price
      if (!seatPrice || parseFloat(seatPrice) <= 0) {
        newErrors.seatPrice = "Valid seat price is required";
      }
    } else {
      // Position image validation
      if (type === "create" && !positionImageUpload.image && !positionImageUpload.imagePreview) {
        newErrors.positionImage = "Position image is required for ticket events";
      }

      // Validate each ticket
      tickets.forEach((ticket, index) => {
        if (!ticket.title?.trim()) {
          newErrors[`ticket_${index}_title`] = "Ticket title is required";
        }

        if (!ticket.price || parseFloat(ticket.price.toString()) <= 0) {
          newErrors[`ticket_${index}_price`] = "Valid ticket price is required";
        }

        if (!ticket.quantity || parseInt(ticket.quantity.toString()) <= 0) {
          newErrors[`ticket_${index}_quantity`] = "Valid ticket quantity is required";
        }
      });

      // Validate that there is at least one ticket for ticket events
      if (tickets.length === 0) {
        newErrors.tickets = "At least one ticket type is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission handler
  const handleSubmit = async () => {
    // Get the form element
    const formElement = document.getElementById("eventForm") as HTMLFormElement;

    if (!formElement) {
      console.error("Form element not found");
      setErrors(prev => ({ ...prev, submit: "Form element not found" }));
      return false;
    }
    // Collect form data
    const formDataObj: EventFormData = {
      // Basic event info
      title: (formElement.querySelector("[name=\"title\"]") as HTMLInputElement)?.value || "",
      statusId: selectedStatus,
      startedAt: (formElement.querySelector("[name=\"startedAt\"]") as HTMLInputElement)?.value || "",
      endedAt: (formElement.querySelector("[name=\"endedAt\"]") as HTMLInputElement)?.value || "",

      // Category
      categoryId: selectedCategory,

      //Organiser
      organiserId: selectedOrganiser,

      // Address info from component
      locationProvince: addressInfo?.province_name || "",
      locationDistrict: addressInfo?.district_name || "",
      locationWard: addressInfo?.ward_name || "",
      locationAddress: address,

      // Venue info
      venueName: venueName,

      // Content
      content: contentData,

      // Event type
      type: eventType === "ticket",

      // Seat info
      seatPrice: eventType === "seat" ? parseFloat(seatPrice) : null,
      bookedSeats: eventType === "seat" ? bookedSeats : null,

      // Tickets
      tickets: eventType === "ticket" ? tickets : null,

      // Image paths from previous upload
      bannerImagePath: bannerImageUpload.imagePreview || "",
      positionImagePath: eventType === "ticket" ? positionImageUpload.imagePreview || "" : null
    };

    // Validate form data
    if (!validateForm(formDataObj)) {
      console.error("Form validation failed:", errors);
      return false;
    }

    // Show submitting state
    setIsSubmitting(true);

    try {
      // Create FormData for submission with files
      const formData = new FormData();

      // Add all form data
      for (const key in formDataObj) {
        if (key !== 'tickets') { // Handle tickets separately
          if (formDataObj[key as keyof EventFormData] !== null && formDataObj[key as keyof EventFormData] !== undefined) {
            formData.append(key, formDataObj[key as keyof EventFormData] as string);
          }
        }
      }

      // Add tickets as JSON
      if (formDataObj.tickets && formDataObj.tickets.length > 0) {
        formData.append('tickets', JSON.stringify(formDataObj.tickets));
      }

      // Add images if they exist
      if (bannerImageUpload.image) {
        formData.append('bannerImage', bannerImageUpload.image);
      }

      if (positionImageUpload.image && eventType === "ticket") {
        formData.append('positionImage', positionImageUpload.image);
      }

      // Add event ID for edit mode
      if (type === "edit" && event?.id) {
        formData.append('id', event.id.toString());
      }

      // Make API request
      const endpoint = type === "create" ? '/events/create' : '/events/edit';
      const response = await axiosClient.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (type === "create") {
        resetForm();
      }

      console.log("Form submission successful:", response);
      return true;
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors(prev => ({ ...prev, submit: "Failed to submit event. Please try again." }));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    // Reset all form fields
    const formElement = document.getElementById("eventForm") as HTMLFormElement;
    if (formElement) {
      formElement.reset();
    }

    // Reset all state values
    setContentData("");
    setSelectedCategory("");
    setSelectedOrganiser("");
    setSelectedStatus("1");
    setEventType("seat");
    setSeatPrice("");
    setBookedSeats("");
    setAddress("");
    setVenueName("");
    setAddressInfo(null);

    // Reset images
    bannerImageUpload.resetImage();
    positionImageUpload.resetImage();

    // Reset tickets
    setTickets([]);

    // Clear errors
    setErrors({});
  }

  return {
    // States
    errors,
    contentData,
    isLoading,
    isSubmitting,
    tickets,
    categories,
    isLoadingCategories,
    selectedCategory,
    organisers,
    isLoadingOrganisers,
    selectedOrganiser,
    selectedStatus,
    eventType,
    seatPrice,
    bookedSeats,
    addressInfo,
    address,
    venueName,
    bannerImageUpload,
    positionImageUpload,

    // Actions
    setContentData,
    handleCategoryChange,
    handleOrganiserChange,
    handleStatusChange,
    handleEventTypeChange,
    handleSeatPriceChange,
    handleAddressChange,
    handleAddressDetailChange,
    handleVenueNameChange,
    handleAddTicket,
    handleRemoveTicket,
    handleTicketChange,
    validateForm,
    handleSubmit,
    getFieldError,
  };
};