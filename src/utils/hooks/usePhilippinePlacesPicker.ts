import React, { useEffect } from "react";
import philippinePlaces from "../philippinePlaces/philippinePlaces";

function usePhilippinePlacesPicker() {
    const [regionCode, setRegionCode] = React.useState<string |null>(null);
    const [provinceCode, setProvinceCode] = React.useState<string |null>(null);
    const [cityMunCode, setCityMunCode] = React.useState<string |null>(null);
    const [barangayCode, setBarangayCode] = React.useState<string |null>(null);

    useEffect(() => {
        setProvinceCode(null);
    }, [regionCode]);

    useEffect(() => {
        setCityMunCode(null);
    }, [provinceCode]);

    useEffect(() => {
        setBarangayCode(null);
    }, [cityMunCode]);

    // interface retVal {
    //     regionCode: typeof regionCode,
    //     provinceCode: typeof provinceCode,
    //     cityMunCode: typeof cityMunCode,
    //     barangayCode: typeof barangayCode,
    //     setRegionCode: React.Dispatch<React.SetStateAction<string | null>>,
    //     setProvinceCode: React.Dispatch<React.SetStateAction<string | null>>,
    //     setCityMunCode: React.Dispatch<React.SetStateAction<string | null>>,
    //     setBarangayCode: React.Dispatch<React.SetStateAction<string | null>>,
    //     regions: typeof philippinePlaces.regions | null,
    //     provinces: typeof philippinePlaces.provinces | null,
    //     cityMun: typeof philippinePlaces.city_mun | null,
    //     barangay: typeof philippinePlaces.barangays | null,
    // }

    return {
        regionCode,
        provinceCode,
        cityMunCode,
        barangayCode,
        setRegionCode,
        setProvinceCode,
        setCityMunCode,
        setBarangayCode,
        regions: philippinePlaces.regions,
        provinces: regionCode? philippinePlaces.getProvincesByRegion(regionCode) : null,
        cityMun: provinceCode? philippinePlaces.getCityMunByProvince(provinceCode) : null,
        barangay: cityMunCode? philippinePlaces.getBarangayByMun(cityMunCode) : null,
    }
}

export default usePhilippinePlacesPicker;