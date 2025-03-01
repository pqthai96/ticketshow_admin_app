"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Select } from "@/components/FormElements/select";

interface AddressSelectorProps {
  initialProvince?: string;
  initialDistrict?: string;
  initialWard?: string;
  onAddressChange: (addressData: AddressInfo) => void;
}

export interface AddressInfo {
  province_id: string;
  province_name: string;
  district_id: string;
  district_name: string;
  ward_id: string;
  ward_name: string;
}

const AddressSelector: React.FC<AddressSelectorProps> = ({
                                                           initialProvince,
                                                           initialDistrict,
                                                           initialWard,
                                                           onAddressChange,
                                                         }) => {
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [addressInfo, setAddressInfo] = useState<AddressInfo>({
    province_id: "",
    province_name: "",
    district_id: "",
    district_name: "",
    ward_id: "",
    ward_name: "",
  });

  // Fetch provinces on component mount
  useEffect(() => {
    fetchProvinces();
  }, []);

  // Update parent component when address info changes
  useEffect(() => {
    onAddressChange(addressInfo);
  }, [addressInfo, onAddressChange]);

  const fetchProvinces = () => {
    setIsLoading(true);
    axios
      .get("https://vapi.vnappmob.com/api/v2/province/")
      .then((response: any) => {
        setProvinces(response.data.results);
        if (initialProvince) {
          const savedProvince = response.data.results.find(
            (p: any) => p.province_name === initialProvince
          );

          if (savedProvince) {
            setAddressInfo((prev) => ({
              ...prev,
              province_id: savedProvince.province_id,
              province_name: savedProvince.province_name,
            }));
            fetchDistricts(savedProvince.province_id);
          } else {
            setIsLoading(false);
          }
        } else {
          setIsLoading(false);
        }
      })
      .catch((e) => {
        console.log("Error fetching provinces:", e.message);
        setIsLoading(false);
      });
  };

  const fetchDistricts = (provinceId: string) => {
    axios
      .get(`https://vapi.vnappmob.com/api/v2/province/district/${provinceId}`)
      .then((response: any) => {
        setDistricts(response.data.results);
        if (initialDistrict) {
          const savedDistrict = response.data.results.find(
            (d: any) => d.district_name === initialDistrict
          );
          if (savedDistrict) {
            setAddressInfo((prev) => ({
              ...prev,
              district_id: savedDistrict.district_id,
              district_name: savedDistrict.district_name,
            }));
            fetchWards(savedDistrict.district_id);
          } else {
            setIsLoading(false);
          }
        } else {
          setIsLoading(false);
        }
      })
      .catch((e) => {
        console.log("Error fetching districts:", e.message);
        setIsLoading(false);
      });
  };

  const fetchWards = (districtId: string) => {
    axios
      .get(`https://vapi.vnappmob.com/api/v2/province/ward/${districtId}`)
      .then((response: any) => {
        setWards(response.data.results);
        if (initialWard) {
          const savedWard = response.data.results.find(
            (w: any) => w.ward_name === initialWard
          );
          if (savedWard) {
            setAddressInfo((prev) => ({
              ...prev,
              ward_id: savedWard.ward_id,
              ward_name: savedWard.ward_name,
            }));
          }
        }
        setIsLoading(false);
      })
      .catch((e) => {
        console.log("Error fetching wards:", e.message);
        setIsLoading(false);
      });
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceId = e.target.value;
    const selectedProvince = provinces.find(
      (p: any) => p.province_id === provinceId
    );

    setAddressInfo((prev) => ({
      ...prev,
      province_id: provinceId,
      province_name: selectedProvince?.province_name || "",
      district_id: "",
      district_name: "",
      ward_id: "",
      ward_name: "",
    }));

    if (provinceId) {
      setDistricts([]);
      setWards([]);
      fetchDistricts(provinceId);
    } else {
      setDistricts([]);
      setWards([]);
    }
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtId = e.target.value;
    const selectedDistrict = districts.find(
      (d: any) => d.district_id === districtId
    );

    setAddressInfo((prev) => ({
      ...prev,
      district_id: districtId,
      district_name: selectedDistrict?.district_name || "",
      ward_id: "",
      ward_name: "",
    }));

    if (districtId) {
      setWards([]);
      fetchWards(districtId);
    } else {
      setWards([]);
    }
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const wardId = e.target.value;
    const selectedWard = wards.find((w: any) => w.ward_id === wardId);

    setAddressInfo((prev) => ({
      ...prev,
      ward_id: wardId,
      ward_name: selectedWard?.ward_name || "",
    }));
  };

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600"></div>
          <span className="ml-3">Loading address data...</span>
        </div>
      ) : (
        <div>
          <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
            <Select
              label="Province/City"
              placeholder="Select province/city"
              className="w-full xl:w-1/3"
              items={provinces.map((province: any) => ({
                label: province.province_name,
                value: province.province_id,
              }))}
              onChange={handleProvinceChange}
              defaultValue={addressInfo.province_id}
            />
            <Select
              label="District"
              placeholder="Select district"
              className="w-full xl:w-1/3"
              items={districts.map((district: any) => ({
                label: district.district_name,
                value: district.district_id,
              }))}
              onChange={handleDistrictChange}
              defaultValue={addressInfo.district_id}
            />
            <Select
              label="Ward"
              placeholder="Select ward"
              className="w-full xl:w-1/3"
              items={wards.map((ward: any) => ({
                label: ward.ward_name,
                value: ward.ward_id,
              }))}
              onChange={handleWardChange}
              defaultValue={addressInfo.ward_id}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AddressSelector;