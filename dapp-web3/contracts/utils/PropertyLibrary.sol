// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

library PropertyLibrary {
    struct ApartmentStruct {
        uint id;
        string name;
        string description;
        string location;
        string[] imageHashes;
        uint rooms;
        uint price;
        uint taxPercent;
        uint securityFee;
        address owner;
        bool booked;
        bool deleted;
        uint timestamp;
    }

    struct BookingStruct {
        uint id;
        uint aid;
        address tenant;
        uint date;
        uint price;
        bool checked;
        bool cancelled;
    }

    struct ReviewStruct {
        uint id;
        uint aid;
        string reviewText;
        uint timestamp;
        address owner;
    }

    struct PropertyStorage {
        mapping(uint => ApartmentStruct) apartments;
        mapping(uint => BookingStruct[]) bookingsOf;
        mapping(uint => ReviewStruct[]) reviewsOf;
        mapping(uint => bool) apartmentExist;
        mapping(uint => uint[]) bookedDates;
        mapping(uint => mapping(uint => bool)) isDateBooked;
        mapping(address => mapping(uint => bool)) hasBooked;
        uint totalApartments;
    }

    function createApartment(
        PropertyStorage storage s,
        string memory name,
        string memory description,
        string memory location,
        string[] memory imageHashes,
        uint rooms,
        uint price,
        uint taxPercent,
        uint securityFee,
        address owner
    ) public returns (uint) {
        s.totalApartments++;
        uint currentId = s.totalApartments;
        ApartmentStruct memory apartment = ApartmentStruct({
            id: currentId,
            name: name,
            description: description,
            location: location,
            imageHashes: imageHashes,
            rooms: rooms,
            price: price,
            taxPercent: taxPercent,
            securityFee: securityFee,
            owner: owner,
            booked: false,
            deleted: false,
            timestamp: block.timestamp
        });

        s.apartments[currentId] = apartment;
        s.apartmentExist[currentId] = true;

        return currentId;
    }

    function updateApartment(
        PropertyStorage storage s,
        uint id,
        string memory name,
        string memory description,
        string memory location,
        string[] memory imageHashes,
        uint rooms,
        uint price,
        uint taxPercent,
        uint securityFee
    ) public {
        ApartmentStruct storage apartment = s.apartments[id];
        require(msg.sender == apartment.owner, "Unauthorized");
        apartment.name = name;
        apartment.description = description;
        apartment.location = location;
        apartment.imageHashes = imageHashes;
        apartment.rooms = rooms;
        apartment.price = price;
        apartment.taxPercent = taxPercent;
        apartment.securityFee = securityFee;
    }

    function deleteApartment(PropertyStorage storage s, uint id) public {
        require(s.apartmentExist[id], "Apartment not found");
        require(msg.sender == s.apartments[id].owner, "Unauthorized");
        s.apartmentExist[id] = false;
        s.apartments[id].deleted = true;
    }

    function getApartments(
        PropertyStorage storage s,
        uint startIndex,
        uint count
    ) public view returns (ApartmentStruct[] memory) {
        uint totalApartments = s.totalApartments;
        if (startIndex >= totalApartments) {
            return new ApartmentStruct[](0); // Return an empty array if startIndex is out of range
        }

        uint endIndex = startIndex + count;
        if (endIndex > totalApartments) {
            endIndex = totalApartments;
        }

        ApartmentStruct[] memory apartments = new ApartmentStruct[](
            endIndex - startIndex
        );
        uint index = 0;
        for (uint i = startIndex; i < endIndex; i++) {
            if (!s.apartments[i + 1].deleted) {
                apartments[index] = s.apartments[i + 1];
                index++;
            }
        }

        ApartmentStruct[] memory filteredApartments = new ApartmentStruct[](
            index
        );
        for (uint j = 0; j < index; j++) {
            filteredApartments[j] = apartments[j];
        }

        return filteredApartments;
    }

    function bookApartment(
        PropertyStorage storage s,
        uint aid,
        uint[] memory dates,
        address tenant,
        uint price
    ) public returns (uint) {
        require(s.apartmentExist[aid], "Apartment does not exist");
        uint bookingId = s.bookingsOf[aid].length;

        for (uint i = 0; i < dates.length; i++) {
            BookingStruct memory booking = BookingStruct({
                id: bookingId,
                aid: aid,
                tenant: tenant,
                date: dates[i],
                price: price,
                checked: false,
                cancelled: false
            });
            s.bookingsOf[aid].push(booking);
            s.isDateBooked[aid][dates[i]] = true;
            s.bookedDates[aid].push(dates[i]);
            bookingId++;
        }

        return s.bookingsOf[aid].length - 1; // Return the last bookingId created
    }

    function datesAreCleared(
        PropertyStorage storage s,
        uint aid,
        uint[] memory dates
    ) public view returns (bool) {
        for (uint i = 0; i < dates.length; i++) {
            if (s.isDateBooked[aid][dates[i]]) {
                return false;
            }
        }
        return true;
    }

    function getQualifiedReviewers(
        PropertyStorage storage s,
        uint aid
    ) public view returns (address[] memory) {
        uint256 available;
        for (uint i = 0; i < s.bookingsOf[aid].length; i++) {
            if (s.bookingsOf[aid][i].checked) available++;
        }

        address[] memory reviewers = new address[](available);
        uint256 index;
        for (uint i = 0; i < s.bookingsOf[aid].length; i++) {
            if (s.bookingsOf[aid][i].checked) {
                reviewers[index++] = s.bookingsOf[aid][i].tenant;
            }
        }
        return reviewers;
    }

    function getBookings(
        PropertyStorage storage s,
        uint aid,
        uint startIndex,
        uint count
    ) public view returns (BookingStruct[] memory) {
        uint totalBookings = s.bookingsOf[aid].length;
        if (startIndex >= totalBookings) {
            return new BookingStruct[](0);
        }

        uint endIndex = startIndex + count;
        if (endIndex > totalBookings) {
            endIndex = totalBookings;
        }

        BookingStruct[] memory bookings = new BookingStruct[](
            endIndex - startIndex
        );
        for (uint i = startIndex; i < endIndex; i++) {
            bookings[i - startIndex] = s.bookingsOf[aid][i];
        }
        return bookings;
    }

    function currentTime() internal view returns (uint256) {
        return (block.timestamp * 1000) + 1000;
    }
}
