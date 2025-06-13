package com.huudat1201.service.interf;

import com.huudat1201.dto.AddressDto;
import com.huudat1201.dto.Response;

public interface AddressService {
    Response saveAndUpdateAddress(AddressDto addressDto);
}
