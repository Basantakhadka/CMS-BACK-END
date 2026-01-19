import { HttpException, HttpStatus } from "@nestjs/common";

import { OwnersDetailsResponseDto } from "./ownersDetailsResponseDto";
export class OwnersReportDtoConverter {
	toDomain(ownersDetailsEntity: any) {
		let ownersReportDto = new OwnersDetailsResponseDto();

		ownersReportDto.merchantId = ownersDetailsEntity.merchant_id;
		ownersReportDto.ownersDetailsId = ownersDetailsEntity.owners_details_id;

		ownersReportDto.alternativeContactNumber =
			ownersDetailsEntity.alternative_contact_number;
		ownersReportDto.contactEmail = ownersDetailsEntity.contact_email;
		ownersReportDto.contactNumber = ownersDetailsEntity.contact_number;
		ownersReportDto.nationality = ownersDetailsEntity.nationality;
		ownersReportDto.ownersName = ownersDetailsEntity.owners_name;
		ownersReportDto.permanentAddressDistrict =
			ownersDetailsEntity.permanent_address_district;
		ownersReportDto.permanentAddressMunicipality =
			ownersDetailsEntity.permanent_address_municipality;
		ownersReportDto.permanentAddressProvince =
			ownersDetailsEntity.permanent_address_province;
		ownersReportDto.permanentAddressStreetName =
			ownersDetailsEntity.permanent_address_street_name;
		ownersReportDto.permanentAddressWardNumber =
			ownersDetailsEntity.permanent_address_ward_number;
		ownersReportDto.temporaryAddressDistrict =
			ownersDetailsEntity.temporary_address_district;
		ownersReportDto.temporaryAddressMunicipality =
			ownersDetailsEntity.temporary_address_municipality;
		ownersReportDto.temporaryAddressProvince =
			ownersDetailsEntity.temporary_address_province;
		ownersReportDto.temporaryAddressStreetName =
			ownersDetailsEntity.temporary_address_street_name;
		ownersReportDto.temporaryAddressWardNumber =
			ownersDetailsEntity.temporary_address_ward_number;

		return ownersReportDto;
	}

	toDomainList(ownersDetailsEntity) {
		let OwnersDetailsResponseDtoList: Array<OwnersDetailsResponseDto> = [];
		let index = 0;
		ownersDetailsEntity.forEach(function (item) {
			let converter = new OwnersReportDtoConverter();
			let dto = converter.toDomain(item);

			OwnersDetailsResponseDtoList[index] = dto;

			index++;
		});

		return OwnersDetailsResponseDtoList;
	}
}
